"""
GET    /api/memories                          — list (with optional ?agentId= & ?partition= filters)
POST   /api/memories                          — add new verified memory + Merkle block
PATCH  /api/memories/{id}/quarantine          — quarantine a memory
PATCH  /api/memories/{id}/restore             — restore a quarantined memory
"""

from __future__ import annotations
import json, uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query
from models import MemoryItem, MemoryItemCreate
from database import get_db, memory_row_to_dict, block_row_to_dict
from crypto_utils import (
    build_memory_hash, compute_merkle_root,
    generate_block_signature,
)
from firewall import get_firewall, MemoryFirewall

router = APIRouter(prefix="/api/memories", tags=["Memories"])


@router.get("", response_model=list[MemoryItem])
async def list_memories(
    agentId: str | None = Query(None),
    partition: str | None = Query(None),
):
    db = await get_db()
    try:
        query = "SELECT * FROM memories WHERE 1=1"
        params: list = []
        if agentId:
            query += " AND agentId=?"
            params.append(agentId)
        if partition:
            query += " AND partition=?"
            params.append(partition)
        query += " ORDER BY timestamp DESC"
        async with db.execute(query, params) as cur:
            rows = await cur.fetchall()
        
        # Apply Egress Retrieval Protection
        fw = get_firewall()
        scrubbed_memories = []
        for r in rows:
            m = memory_row_to_dict(r)
            egress_result = fw.inspect_egress(m)
            if egress_result.decision == "BLOCK":
                m["content"] = "[BLOCKED BY EGRESS FIREWALL: SENSITIVE PROHIBITED PAYLOAD]"
                m["status"] = "quarantined"
            elif egress_result.decision == "REDACT" and egress_result.filtered_data:
                m["content"] = egress_result.filtered_data.get("content", m["content"])
                m["piiRedacted"] = True
            scrubbed_memories.append(m)
            
        return scrubbed_memories
    finally:
        await db.close()


@router.get("/{memory_id}", response_model=MemoryItem)
async def get_single_memory(memory_id: str):
    db = await get_db()
    try:
        async with db.execute("SELECT * FROM memories WHERE id=?", (memory_id,)) as cur:
            row = await cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Memory not found")
        
        m = memory_row_to_dict(row)
        fw = get_firewall()
        egress_result = fw.inspect_egress(m)
        if egress_result.decision == "BLOCK":
            m["content"] = "[BLOCKED BY EGRESS FIREWALL: SENSITIVE PROHIBITED PAYLOAD]"
            m["status"] = "quarantined"
        elif egress_result.decision == "REDACT" and egress_result.filtered_data:
            m["content"] = egress_result.filtered_data.get("content", m["content"])
            m["piiRedacted"] = True
        return m
    finally:
        await db.close()


@router.post("", response_model=MemoryItem, status_code=201)
async def add_memory(body: MemoryItemCreate):
    # ── 1. Automatic Memory Firewall Ingress Evaluation ──
    fw = get_firewall()
    decision = fw.inspect_ingress(body.model_dump())

    db = await get_db()
    try:
        # Secret-safe audit logging (NEVER logs secrets or unredacted text)
        await MemoryFirewall.log_audit_event(
            db=db,
            decision_result=decision,
            agent_id=body.agentId,
            target_id="PROPOSED_INGESTION",
            operation="INGRESS"
        )

        # Handle BLOCK decision
        if decision.decision == "BLOCK":
            # Record a threat event in database for visibility
            threat_id = f"thr_{uuid.uuid4().hex[:8]}"
            await db.execute(
                """INSERT INTO threats VALUES (
                    :id, :timestamp, :agentId, :agentName, :type, :title,
                    :severity, :rawPayload, :layerTriggered, :actionTaken,
                    :explanation, :threatScore, :mitigationApplied, :sanitizedContent
                )""",
                {
                    "id": threat_id,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "agentId": body.agentId,
                    "agentName": body.agentName,
                    "type": "indirect_prompt_injection",
                    "title": f"Firewall Blocked: {decision.rule_id}",
                    "severity": "critical",
                    "rawPayload": "[MASKED_BY_FIREWALL_AUDIT]",
                    "layerTriggered": f"Memory Firewall ({decision.rule_id})",
                    "actionTaken": "blocked",
                    "explanation": decision.reason,
                    "threatScore": 98,
                    "mitigationApplied": "Hard drop by Memory Firewall. Ingestion rejected.",
                    "sanitizedContent": "[BLOCKED_BY_FIREWALL]",
                }
            )
            await db.commit()
            raise HTTPException(
                status_code=403,
                detail={
                    "status": "BLOCKED",
                    "decision": decision.decision,
                    "rule_id": decision.rule_id,
                    "reason": decision.reason,
                    "filtered_data": None
                }
            )

        # Handle REDACT vs ALLOW decision
        content_to_store = body.content
        is_pii_redacted = 1 if body.piiRedacted else 0
        metadata_to_store = body.metadata or {}

        if decision.decision == "REDACT" and decision.filtered_data:
            content_to_store = decision.filtered_data.get("content", body.content)
            is_pii_redacted = 1
            if "metadata" in decision.filtered_data and isinstance(decision.filtered_data["metadata"], dict):
                metadata_to_store = decision.filtered_data["metadata"]

        # Get latest block to chain onto
        async with db.execute("SELECT * FROM blocks ORDER BY blockNumber DESC LIMIT 1") as cur:
            last_block = await cur.fetchone()

        prev_hash = last_block["hash"] if last_block else "0" * 64
        block_number = (last_block["blockNumber"] + 1) if last_block else 1
        timestamp = datetime.now(timezone.utc).isoformat()
        mem_id = f"mem_{str(uuid.uuid4())[:8]}"

        mem_hash = build_memory_hash(block_number, prev_hash, body.agentId, content_to_store, timestamp)

        # Fetch all running hashes for Merkle root
        async with db.execute("SELECT hash FROM blocks ORDER BY blockNumber") as cur:
            existing_hashes = [r["hash"] for r in await cur.fetchall()]
        existing_hashes.append(mem_hash)
        merkle_root = compute_merkle_root(existing_hashes)
        signature = generate_block_signature(block_number, mem_hash, body.agentId)

        # Insert memory
        await db.execute(
            """INSERT INTO memories VALUES (
                :id,:agentId,:agentName,:partition,:content,:category,
                :timestamp,:hash,:parentHash,'verified',:piiRedacted,
                :confidenceScore,:tags,:author,:vectorDriftDelta,:metadata
            )""",
            {
                "id": mem_id,
                "agentId": body.agentId,
                "agentName": body.agentName,
                "partition": body.partition,
                "content": content_to_store,
                "category": body.category,
                "timestamp": timestamp,
                "hash": mem_hash,
                "parentHash": prev_hash,
                "piiRedacted": is_pii_redacted,
                "confidenceScore": body.confidenceScore,
                "tags": json.dumps(body.tags),
                "author": body.author,
                "vectorDriftDelta": body.vectorDriftDelta,
                "metadata": json.dumps(metadata_to_store),
            },
        )

        # Insert block
        await db.execute(
            """INSERT INTO blocks VALUES (
                :blockNumber,:timestamp,:agentId,:agentName,:memoryId,:content,
                NULL,:prevHash,:hash,:merkleRoot,:signature,0,NULL
            )""",
            {
                "blockNumber": block_number,
                "timestamp": timestamp,
                "agentId": body.agentId,
                "agentName": body.agentName,
                "memoryId": mem_id,
                "content": content_to_store,
                "prevHash": prev_hash,
                "hash": mem_hash,
                "merkleRoot": merkle_root,
                "signature": signature,
            },
        )

        # Update agent counters
        await db.execute(
            f"""UPDATE agents
                SET memoryCount = memoryCount + 1,
                    verifiedCount = verifiedCount + 1,
                    lastActive = 'Just now',
                    partitions = json_set(partitions, '$.{body.partition}',
                        CAST(json_extract(partitions, '$.{body.partition}') AS INTEGER) + 1)
                WHERE id = ?""",
            (body.agentId,),
        )

        await db.commit()

        async with db.execute("SELECT * FROM memories WHERE id=?", (mem_id,)) as cur:
            row = await cur.fetchone()
        return memory_row_to_dict(row)
    finally:
        await db.close()


@router.patch("/{memory_id}/quarantine", response_model=MemoryItem)
async def quarantine_memory(memory_id: str):
    db = await get_db()
    try:
        async with db.execute("SELECT * FROM memories WHERE id=?", (memory_id,)) as cur:
            row = await cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Memory not found")
        await db.execute("UPDATE memories SET status='quarantined' WHERE id=?", (memory_id,))
        await db.execute(
            """UPDATE agents SET quarantinedCount = quarantinedCount + 1,
               verifiedCount = MAX(0, verifiedCount - 1) WHERE id=?""",
            (row["agentId"],),
        )
        await db.commit()
        async with db.execute("SELECT * FROM memories WHERE id=?", (memory_id,)) as cur:
            updated = await cur.fetchone()
        return memory_row_to_dict(updated)
    finally:
        await db.close()


@router.patch("/{memory_id}/restore", response_model=MemoryItem)
async def restore_memory(memory_id: str):
    db = await get_db()
    try:
        async with db.execute("SELECT * FROM memories WHERE id=?", (memory_id,)) as cur:
            row = await cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Memory not found")
        await db.execute("UPDATE memories SET status='verified' WHERE id=?", (memory_id,))
        await db.execute(
            """UPDATE agents SET quarantinedCount = MAX(0, quarantinedCount - 1),
               verifiedCount = verifiedCount + 1 WHERE id=?""",
            (row["agentId"],),
        )
        await db.commit()
        async with db.execute("SELECT * FROM memories WHERE id=?", (memory_id,)) as cur:
            updated = await cur.fetchone()
        return memory_row_to_dict(updated)
    finally:
        await db.close()

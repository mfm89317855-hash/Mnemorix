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
        return [memory_row_to_dict(r) for r in rows]
    finally:
        await db.close()


@router.post("", response_model=MemoryItem, status_code=201)
async def add_memory(body: MemoryItemCreate):
    db = await get_db()
    try:
        # Get latest block to chain onto
        async with db.execute("SELECT * FROM blocks ORDER BY blockNumber DESC LIMIT 1") as cur:
            last_block = await cur.fetchone()

        prev_hash = last_block["hash"] if last_block else "0" * 64
        block_number = (last_block["blockNumber"] + 1) if last_block else 1
        timestamp = datetime.now(timezone.utc).isoformat()
        mem_id = f"mem_{str(uuid.uuid4())[:8]}"

        mem_hash = build_memory_hash(block_number, prev_hash, body.agentId, body.content, timestamp)

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
                "content": body.content,
                "category": body.category,
                "timestamp": timestamp,
                "hash": mem_hash,
                "parentHash": prev_hash,
                "piiRedacted": 1 if body.piiRedacted else 0,
                "confidenceScore": body.confidenceScore,
                "tags": json.dumps(body.tags),
                "author": body.author,
                "vectorDriftDelta": body.vectorDriftDelta,
                "metadata": json.dumps(body.metadata or {}),
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
                "content": body.content,
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

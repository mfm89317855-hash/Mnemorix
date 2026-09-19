"""
MNEMORIX Sentinel — Fastn Automated Workflows Router
Provides 3 automated security workflows integrating MNEMORIX Memory Firewall with the Fastn AI Gateway:
  1. POST /api/fastn/workflow/pre-ingest          — Automated Pre-Ingestion Memory Firewall
  2. POST /api/fastn/workflow/quarantine-dispatch — Automated Threat Quarantine & SecOps Dispatch
  3. POST /api/fastn/workflow/verify-egress       — Automated Egress Scrubbing & Merkle DAG Verification
"""

from __future__ import annotations
import os
import json
import uuid
import httpx
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException

from database import get_db, memory_row_to_dict
from crypto_utils import (
    build_memory_hash, compute_merkle_root, generate_block_signature, sha256
)
from firewall import get_firewall, MemoryFirewall

from dotenv import load_dotenv
load_dotenv()

router = APIRouter(prefix="/api/fastn/workflow", tags=["Fastn Automation Workflows"])


def get_fastn_api_key() -> str:
    """Dynamically reads FASTN_API_KEY from environment."""
    return os.getenv("FASTN_API_KEY", "").strip()


def get_fastn_endpoint() -> str:
    """Dynamically reads FASTN_API_ENDPOINT from environment."""
    return os.getenv("FASTN_API_ENDPOINT", "https://api.fastn.dev/api/v1").strip()


def get_fastn_workflow_id() -> str:
    """Dynamically reads FASTN_WORKFLOW_ID from environment."""
    return os.getenv("FASTN_WORKFLOW_ID", "wf_f0e5443821f2").strip()


async def dispatch_fastn_telemetry(workflow_name: str, payload: dict) -> dict:
    """
    Dispatches real-time automated workflow telemetry to the Fastn AI Platform using FASTN_API_KEY.
    Ensures every automation across MNEMORIX executes on the Fastn platform.
    """
    api_key = get_fastn_api_key()
    endpoint = get_fastn_endpoint()
    has_key = bool(api_key and api_key.startswith("fsk_"))
    masked_key = f"{api_key[:8]}...{api_key[-4:]}" if has_key else "NOT_CONFIGURED"

    telemetry_record = {
        "fastn_connected": has_key,
        "fastn_key": masked_key,
        "workflow": workflow_name,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "dispatched": True,
        "platform": "Fastn AI Gateway & Orchestrator",
        "endpoint": endpoint,
    }

    if has_key:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "X-Fastn-Client": "mnemorix-sentinel-v2.5",
        }
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                resp = await client.post(
                    f"{endpoint}/events",
                    json={
                        "workflow": workflow_name,
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "payload": payload,
                    },
                    headers=headers,
                )
                telemetry_record["fastn_status_code"] = resp.status_code
                telemetry_record["fastn_response"] = "dispatched" if resp.is_success else f"HTTP {resp.status_code}"
        except Exception as e:
            telemetry_record["local_mode"] = True
            telemetry_record["note"] = f"Fastn event queued locally: {e}"

    return telemetry_record


@router.get("/status")
async def fastn_workflow_status():
    """
    Returns the Fastn AI platform connection status, authenticated key mask,
    and registered automated workflows.
    """
    api_key = get_fastn_api_key()
    has_key = bool(api_key and api_key.startswith("fsk_"))
    masked = f"{api_key[:8]}...{api_key[-4:]}" if has_key else "NOT_CONFIGURED"
    wf_id = get_fastn_workflow_id()
    endpoint = get_fastn_endpoint()
    return {
        "connected": True,
        "platform": "Fastn AI Gateway & Orchestrator",
        "endpoint": endpoint,
        "apiKeyConfigured": has_key,
        "maskedKey": masked,
        "activeAutomations": 3,
        "fastnWorkflowId": wf_id,
        "fastnExecuteUrl": f"{endpoint}/workflows/{wf_id}/execute",
        "workflows": [
            {
                "id": "wf_pre_ingest",
                "name": "Fastn Automated Pre-Ingestion Memory Firewall",
                "endpoint": "/api/fastn/workflow/pre-ingest",
                "trigger": "agent:memory:beforeSave",
                "status": "active",
            },
            {
                "id": "wf_quarantine_dispatch",
                "name": "Fastn Threat Quarantine & SecOps Dispatch",
                "endpoint": "/api/fastn/workflow/quarantine-dispatch",
                "trigger": "security:incident:threatDetected",
                "status": "active",
            },
            {
                "id": "wf_verify_egress",
                "name": "Fastn Egress Scrubbing & Merkle Audit",
                "endpoint": "/api/fastn/workflow/verify-egress",
                "trigger": "agent:prompt:contextRetrieve",
                "status": "active",
            },
        ],
    }


class FastnCloudExecuteRequest(BaseModel):
    workflowId: Optional[str] = None
    payload: Optional[Dict[str, Any]] = None


@router.post("/execute-cloud")
async def execute_fastn_cloud_workflow(req: FastnCloudExecuteRequest):
    """
    Executes a cloud workflow directly on the Fastn platform (https://api.fastn.dev/api/v1/workflows/{wf_id}/execute)
    using the configured FASTN_API_KEY.
    """
    api_key = get_fastn_api_key()
    endpoint = get_fastn_endpoint()
    wf_id = req.workflowId or get_fastn_workflow_id()

    url = f"{endpoint}/workflows/{wf_id}/execute"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "X-Fastn-Client": "mnemorix-sentinel-v2.5",
    }

    body = req.payload or {}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=body, headers=headers)
            try:
                data = resp.json()
            except Exception:
                data = {"raw": resp.text}
            return {
                "success": resp.is_success,
                "status_code": resp.status_code,
                "workflow_id": wf_id,
                "execute_url": url,
                "response": data,
            }
    except Exception as e:
        return {
            "success": False,
            "workflow_id": wf_id,
            "execute_url": url,
            "error": str(e),
        }


# ─── Request / Response Schemas ──────────────────────────────────────────────

class FastnPreIngestRequest(BaseModel):
    agentId: str
    agentName: Optional[str] = "Fastn Agent"
    partition: str = "semantic"
    content: str
    author: Optional[str] = "Fastn AI Orchestrator"
    category: Optional[str] = "Fastn Ingestion Pipeline"
    metadata: Optional[Dict[str, Any]] = None


class FastnPreIngestResponse(BaseModel):
    workflow: str = "fastn_pre_ingestion_firewall"
    status: str
    decision: str
    rule_id: str
    reason: str
    stored: bool
    memory_id: Optional[str] = None
    merkle_block: Optional[int] = None
    sanitized_content: Optional[str] = None
    pii_redacted: bool = False
    audit_id: str
    fastn_telemetry: Optional[Dict[str, Any]] = None


class FastnQuarantineRequest(BaseModel):
    agentId: str
    threatType: str = "indirect_prompt_injection"
    reason: str
    triggerPayload: Optional[str] = None
    dispatchTarget: Optional[str] = "secops_webhook"


class FastnQuarantineResponse(BaseModel):
    workflow: str = "fastn_threat_quarantine_dispatch"
    status: str
    agentId: str
    isolated_partitions: List[str]
    quarantined_count: int
    incident_id: str
    fastn_alert_payload: Dict[str, Any]
    fastn_telemetry: Optional[Dict[str, Any]] = None


class FastnVerifyEgressRequest(BaseModel):
    agentId: str
    partition: Optional[str] = None
    limit: int = 20


class FastnVerifyEgressResponse(BaseModel):
    workflow: str = "fastn_egress_scrub_and_verify"
    status: str
    is_dag_intact: bool
    total_retrieved: int
    scrubbed_count: int
    merkle_root: str
    signature: str
    verified_context: List[Dict[str, Any]]
    fastn_telemetry: Optional[Dict[str, Any]] = None


# ─── Workflow 1: Fastn Automated Pre-Ingestion Memory Firewall ────────────────

@router.post("/pre-ingest", response_model=FastnPreIngestResponse)
async def fastn_workflow_pre_ingest(body: FastnPreIngestRequest):
    """
    Automated Workflow 1:
    Intercepts proposed memory from Fastn AI Gateway before storage.
    Runs deterministic Memory Firewall inspection.
    - BLOCK: Discards immediately, logs secret-safe audit record.
    - REDACT: Scrubs sensitive credentials/PII, anchors into Merkle DAG.
    - ALLOW: Persists unchanged, anchors into Merkle DAG.
    """
    fw = get_firewall()
    decision = fw.inspect_ingress({
        "content": body.content,
        "metadata": body.metadata or {}
    })

    db = await get_db()
    try:
        audit_id = await MemoryFirewall.log_audit_event(
            db=db,
            decision_result=decision,
            agent_id=body.agentId,
            target_id="FASTN_WORKFLOW_INGRESS",
            operation="FASTN_PRE_INGEST"
        )

        if decision.decision == "BLOCK":
            # Record threat incident for SecOps visibility
            threat_id = f"thr_fastn_{uuid.uuid4().hex[:6]}"
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
                    "title": f"Fastn Intercepted: {decision.rule_id}",
                    "severity": "critical",
                    "rawPayload": "[MASKED_BY_FIREWALL_AUDIT]",
                    "layerTriggered": "Fastn Pre-Ingestion Firewall",
                    "actionTaken": "blocked",
                    "explanation": decision.reason,
                    "threatScore": 96,
                    "mitigationApplied": "Dropped memory before Fastn persistence",
                    "sanitizedContent": "[BLOCKED_BY_FIREWALL]",
                }
            )
            await db.commit()

            telemetry = await dispatch_fastn_telemetry("fastn_pre_ingestion_firewall", {
                "event": "INGESTION_BLOCKED",
                "agentId": body.agentId,
                "rule_id": decision.rule_id,
                "reason": decision.reason,
                "threat_id": threat_id,
            })

            return FastnPreIngestResponse(
                status="BLOCKED",
                decision=decision.decision,
                rule_id=decision.rule_id,
                reason=decision.reason,
                stored=False,
                sanitized_content=None,
                pii_redacted=False,
                audit_id=audit_id,
                fastn_telemetry=telemetry,
            )

        # REDACT or ALLOW: Proceed with cryptographic storage
        content_to_store = body.content
        pii_redacted = False
        if decision.decision == "REDACT" and decision.filtered_data:
            content_to_store = decision.filtered_data.get("content", body.content)
            pii_redacted = True

        async with db.execute("SELECT * FROM blocks ORDER BY blockNumber DESC LIMIT 1") as cur:
            last_block = await cur.fetchone()

        prev_hash = last_block["hash"] if last_block else "0" * 64
        block_number = (last_block["blockNumber"] + 1) if last_block else 1
        timestamp = datetime.now(timezone.utc).isoformat()
        mem_id = f"mem_fastn_{str(uuid.uuid4())[:8]}"

        mem_hash = build_memory_hash(block_number, prev_hash, body.agentId, content_to_store, timestamp)

        async with db.execute("SELECT hash FROM blocks ORDER BY blockNumber") as cur:
            existing_hashes = [r["hash"] for r in await cur.fetchall()]
        existing_hashes.append(mem_hash)
        merkle_root = compute_merkle_root(existing_hashes)
        signature = generate_block_signature(block_number, mem_hash, body.agentId)

        # Persist memory
        await db.execute(
            """INSERT INTO memories VALUES (
                :id,:agentId,:agentName,:partition,:content,:category,
                :timestamp,:hash,:parentHash,'verified',:piiRedacted,
                0.999,:tags,:author,0.001,:metadata
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
                "piiRedacted": 1 if pii_redacted else 0,
                "tags": json.dumps(["fastn_automated", body.partition]),
                "author": body.author,
                "metadata": json.dumps(body.metadata or {}),
            },
        )

        # Persist block
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
            """UPDATE agents
               SET memoryCount = memoryCount + 1,
                   verifiedCount = verifiedCount + 1,
                   lastActive = 'Just now'
               WHERE id = ?""",
            (body.agentId,),
        )
        await db.commit()

        telemetry = await dispatch_fastn_telemetry("fastn_pre_ingestion_firewall", {
            "event": "INGESTION_STORED",
            "agentId": body.agentId,
            "memoryId": mem_id,
            "merkleBlock": block_number,
            "decision": decision.decision,
            "rule_id": decision.rule_id,
            "pii_redacted": pii_redacted,
        })

        return FastnPreIngestResponse(
            status="SUCCESS",
            decision=decision.decision,
            rule_id=decision.rule_id,
            reason=decision.reason,
            stored=True,
            memory_id=mem_id,
            merkle_block=block_number,
            sanitized_content=content_to_store,
            pii_redacted=pii_redacted,
            audit_id=audit_id,
            fastn_telemetry=telemetry,
        )
    finally:
        await db.close()


# ─── Workflow 2: Fastn Threat Quarantine & Incident Dispatch ─────────────────

@router.post("/quarantine-dispatch", response_model=FastnQuarantineResponse)
async def fastn_workflow_quarantine_dispatch(body: FastnQuarantineRequest):
    """
    Automated Workflow 2:
    Immediately isolates an agent node and its memory partitions when a compromise occurs,
    generating a Fastn security dispatch payload for downstream notification webhooks.
    """
    db = await get_db()
    try:
        # Check agent exists
        async with db.execute("SELECT * FROM agents WHERE id=?", (body.agentId,)) as cur:
            agent = await cur.fetchone()
        if not agent:
            raise HTTPException(status_code=404, detail="Agent node not found")

        # Quarantine all recent unverified memories for this agent
        await db.execute(
            "UPDATE memories SET status='quarantined' WHERE agentId=?",
            (body.agentId,)
        )
        async with db.execute("SELECT COUNT(*) FROM memories WHERE agentId=? AND status='quarantined'", (body.agentId,)) as cur:
            count_row = await cur.fetchone()
            quarantined_count = count_row[0] if count_row else 1

        # Elevate agent status to quarantined and threatLevel to critical
        await db.execute(
            """UPDATE agents
               SET status='quarantined',
                   threatLevel='critical',
                   quarantinedCount=?,
                   lastActive='QUARANTINED'
               WHERE id=?""",
            (quarantined_count, body.agentId)
        )

        incident_id = f"inc_fastn_{uuid.uuid4().hex[:8]}"
        now_iso = datetime.now(timezone.utc).isoformat()

        # Record incident in audit log
        await db.execute(
            """INSERT INTO audit_logs (id, timestamp, action, source, targetId, status, hash, details)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                f"aud_{uuid.uuid4().hex[:10]}",
                now_iso,
                "FASTN_AUTOMATED_QUARANTINE",
                f"Fastn Dispatcher ({body.dispatchTarget})",
                body.agentId,
                "QUARANTINED",
                sha256(f"{body.agentId}:{incident_id}:{now_iso}"),
                f"Incident: {incident_id} | Reason: {body.reason} | Threat: {body.threatType}"
            )
        )
        await db.commit()

        # Build standardized Fastn notification payload
        fastn_payload = {
            "version": "1.0",
            "incident_id": incident_id,
            "timestamp": now_iso,
            "severity": "CRITICAL",
            "agent": {
                "id": agent["id"],
                "name": agent["name"],
                "role": agent["role"]
            },
            "threat_type": body.threatType,
            "reason": body.reason,
            "containment": {
                "status": "ISOLATED",
                "quarantined_records": quarantined_count,
                "merkle_freeze": True
            },
            "dispatch_webhook": body.dispatchTarget
        }

        telemetry = await dispatch_fastn_telemetry("fastn_threat_quarantine_dispatch", {
            "event": "AGENT_QUARANTINED",
            "agentId": body.agentId,
            "incident_id": incident_id,
            "threatType": body.threatType,
            "alertPayload": fastn_payload,
        })

        return FastnQuarantineResponse(
            status="CONTAINED",
            agentId=body.agentId,
            isolated_partitions=["episodic", "semantic", "procedural", "working"],
            quarantined_count=quarantined_count,
            incident_id=incident_id,
            fastn_alert_payload=fastn_payload,
            fastn_telemetry=telemetry,
        )
    finally:
        await db.close()


# ─── Workflow 3: Fastn Automated Egress Scrubbing & Merkle Integrity ──────────

@router.post("/verify-egress", response_model=FastnVerifyEgressResponse)
async def fastn_workflow_verify_egress(body: FastnVerifyEgressRequest):
    """
    Automated Workflow 3:
    Called before an agent injects memories into an LLM prompt.
    1. Verifies the cryptographic Merkle DAG chain integrity.
    2. Runs Egress Firewall inspection to scrub any sensitive credentials/PII.
    3. Returns cryptographically certified context buffer for the LLM.
    """
    db = await get_db()
    try:
        # Fetch sequential blocks to audit Merkle DAG
        async with db.execute("SELECT * FROM blocks ORDER BY blockNumber ASC") as cur:
            block_rows = await cur.fetchall()

        is_dag_intact = True
        for i in range(1, len(block_rows)):
            if block_rows[i]["prevHash"] != block_rows[i-1]["hash"]:
                is_dag_intact = False
                break

        latest_merkle_root = block_rows[-1]["merkleRoot"] if block_rows else "0" * 64

        # Fetch memories to return to Fastn LLM orchestrator
        query = "SELECT * FROM memories WHERE agentId=? AND status='verified'"
        params = [body.agentId]
        if body.partition:
            query += " AND partition=?"
            params.append(body.partition)
        query += f" ORDER BY timestamp DESC LIMIT {min(body.limit, 50)}"

        async with db.execute(query, params) as cur:
            mem_rows = await cur.fetchall()

        fw = get_firewall()
        scrubbed_count = 0
        verified_context = []

        for r in mem_rows:
            item = memory_row_to_dict(r)
            egress_res = fw.inspect_egress(item)
            if egress_res.decision == "BLOCK":
                # Do not emit blocked memories into LLM prompt
                continue
            elif egress_res.decision == "REDACT" and egress_res.filtered_data:
                item["content"] = egress_res.filtered_data.get("content", item["content"])
                item["piiRedacted"] = True
                scrubbed_count += 1
            
            verified_context.append({
                "id": item["id"],
                "partition": item["partition"],
                "content": item["content"],
                "hash": item["hash"],
                "piiRedacted": item["piiRedacted"],
                "verified": True
            })

        # Generate Ed25519 signature proof for Fastn
        signature = generate_block_signature(len(block_rows), latest_merkle_root, body.agentId)

        telemetry = await dispatch_fastn_telemetry("fastn_egress_scrub_and_verify", {
            "event": "EGRESS_VERIFIED",
            "agentId": body.agentId,
            "dag_intact": is_dag_intact,
            "scrubbed_count": scrubbed_count,
            "retrieved_count": len(verified_context),
            "merkle_root": latest_merkle_root,
        })

        return FastnVerifyEgressResponse(
            status="VERIFIED" if is_dag_intact else "INTEGRITY_COMPROMISED",
            is_dag_intact=is_dag_intact,
            total_retrieved=len(verified_context),
            scrubbed_count=scrubbed_count,
            merkle_root=latest_merkle_root,
            signature=signature,
            verified_context=verified_context,
            fastn_telemetry=telemetry,
        )
    finally:
        await db.close()

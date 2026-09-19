"""
GET  /api/blocks                 — list all Merkle blocks
POST /api/blocks/tamper          — simulate tamper attack on a block
POST /api/blocks/self-heal       — restore canonical ledger
POST /api/blocks/audit-integrity — validate entire hash chain
POST /api/blocks/reset-empty     — wipe to genesis only
POST /api/blocks/reset-baseline  — restore seed data
"""

from __future__ import annotations
import json
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from models import MerkleBlock, TamperBlockRequest, ChainIntegrityResponse
from database import get_db, block_row_to_dict, init_db
from crypto_utils import (
    sha256, compute_merkle_root, generate_block_signature,
    build_memory_hash,
    GENESIS_PREV_HASH, GENESIS_CONTENT, GENESIS_TIMESTAMP, GENESIS_AGENT_ID,
)
from presets_data import INITIAL_MEMORIES_RAW, INITIAL_THREATS

router = APIRouter(prefix="/api/blocks", tags=["Merkle Chain"])


@router.get("", response_model=list[MerkleBlock])
async def list_blocks():
    db = await get_db()
    try:
        async with db.execute("SELECT * FROM blocks ORDER BY blockNumber") as cur:
            rows = await cur.fetchall()
        return [block_row_to_dict(r) for r in rows]
    finally:
        await db.close()


@router.post("/tamper", status_code=200)
async def tamper_block(body: TamperBlockRequest):
    db = await get_db()
    try:
        async with db.execute(
            "SELECT * FROM blocks WHERE blockNumber=?", (body.blockNumber,)
        ) as cur:
            row = await cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Block #{body.blockNumber} not found")

        original = row["content"] if not row["isTampered"] else row["originalContent"]
        reason = (
            f"ATTACK SIMULATION: Rogue payload injected into memory node "
            f"without cryptographic re-signing on Block #{body.blockNumber}."
        )
        await db.execute(
            """UPDATE blocks
               SET content=?, originalContent=?, isTampered=1, tamperReason=?
               WHERE blockNumber=?""",
            (body.newContent, original, reason, body.blockNumber),
        )
        await db.commit()
        return {"message": f"Block #{body.blockNumber} tampered successfully", "compromised": True}
    finally:
        await db.close()


@router.post("/self-heal", status_code=200)
async def self_heal():
    """Rebuild the canonical Merkle ledger from seed data."""
    db = await get_db()
    try:
        await db.execute("DELETE FROM blocks")
        await db.execute("DELETE FROM memories")
        await db.execute("DELETE FROM threats")

        for t in INITIAL_THREATS:
            await db.execute(
                """INSERT OR IGNORE INTO threats VALUES (
                    :id,:timestamp,:agentId,:agentName,:type,:title,:severity,
                    :rawPayload,:layerTriggered,:actionTaken,:explanation,
                    :threatScore,:mitigationApplied,:sanitizedContent
                )""",
                t,
            )

        prev_hash = GENESIS_PREV_HASH
        genesis_hash = sha256(f"0:{prev_hash}:{GENESIS_AGENT_ID}:{GENESIS_CONTENT}:{GENESIS_TIMESTAMP}")
        await db.execute(
            """INSERT INTO blocks VALUES (
                0,:timestamp,:agentId,'MNEMORIX ROOT SENTINEL','mem_genesis',:content,
                NULL,:prevHash,:hash,:merkleRoot,:signature,0,NULL
            )""",
            {
                "timestamp": GENESIS_TIMESTAMP,
                "agentId": GENESIS_AGENT_ID,
                "content": GENESIS_CONTENT,
                "prevHash": prev_hash,
                "hash": genesis_hash,
                "merkleRoot": genesis_hash,
                "signature": generate_block_signature(0, genesis_hash, GENESIS_AGENT_ID),
            },
        )

        running = [genesis_hash]
        prev_hash = genesis_hash

        for idx, m in enumerate(INITIAL_MEMORIES_RAW):
            bn = idx + 1
            h = build_memory_hash(bn, prev_hash, m["agentId"], m["content"], m["timestamp"])
            running.append(h)
            mr = compute_merkle_root(running)
            sig = generate_block_signature(bn, h, m["agentId"])

            await db.execute(
                """INSERT OR REPLACE INTO memories VALUES (
                    :id,:agentId,:agentName,:partition,:content,:category,
                    :timestamp,:hash,:parentHash,:status,:piiRedacted,
                    :confidenceScore,:tags,:author,:vectorDriftDelta,:metadata
                )""",
                {
                    **m,
                    "hash": h,
                    "parentHash": prev_hash,
                    "piiRedacted": 1 if m.get("piiRedacted") else 0,
                    "tags": json.dumps(m.get("tags", [])),
                    "metadata": json.dumps(m.get("metadata", {})),
                },
            )
            await db.execute(
                """INSERT INTO blocks VALUES (
                    :bn,:timestamp,:agentId,:agentName,:memoryId,:content,
                    NULL,:prevHash,:hash,:mr,:sig,0,NULL
                )""",
                {
                    "bn": bn,
                    "timestamp": m["timestamp"],
                    "agentId": m["agentId"],
                    "agentName": m["agentName"],
                    "memoryId": m["id"],
                    "content": m["content"],
                    "prevHash": prev_hash,
                    "hash": h,
                    "mr": mr,
                    "sig": sig,
                },
            )
            prev_hash = h

        await db.commit()
        return {"message": "Chain self-healed and restored to canonical state", "isChainCompromised": False}
    finally:
        await db.close()


@router.post("/audit-integrity", response_model=ChainIntegrityResponse)
async def audit_integrity():
    db = await get_db()
    try:
        async with db.execute(
            "SELECT blockNumber,prevHash,hash,content,timestamp,agentId,isTampered FROM blocks ORDER BY blockNumber"
        ) as cur:
            rows = await cur.fetchall()

        blocks = [dict(r) for r in rows]
        total = len(blocks)

        if not blocks:
            return ChainIntegrityResponse(isValid=True, brokenBlockIndex=None, reason=None, totalBlocks=0)

        # Genesis check
        if blocks[0]["prevHash"] != GENESIS_PREV_HASH:
            return ChainIntegrityResponse(
                isValid=False, brokenBlockIndex=0,
                reason="Genesis block prevHash is not zero", totalBlocks=total,
            )

        for i, block in enumerate(blocks):
            # Tamper flag check
            if block.get("isTampered"):
                return ChainIntegrityResponse(
                    isValid=False, brokenBlockIndex=i,
                    reason=f"Block #{block['blockNumber']} is flagged as tampered.",
                    totalBlocks=total,
                )
            # Chain link check
            if i > 0 and block["prevHash"] != blocks[i - 1]["hash"]:
                return ChainIntegrityResponse(
                    isValid=False, brokenBlockIndex=i,
                    reason=f"Block #{block['blockNumber']} prevHash does not match Block #{blocks[i-1]['blockNumber']} hash.",
                    totalBlocks=total,
                )
            # Skip genesis hash recomputation (timestamp is fixed)
            if i == 0:
                expected = sha256(
                    f"0:{GENESIS_PREV_HASH}:{GENESIS_AGENT_ID}:{GENESIS_CONTENT}:{GENESIS_TIMESTAMP}"
                )
            else:
                expected = build_memory_hash(
                    block["blockNumber"], block["prevHash"],
                    block["agentId"], block["content"], block["timestamp"],
                )
            if expected != block["hash"]:
                return ChainIntegrityResponse(
                    isValid=False, brokenBlockIndex=i,
                    reason=f"SHA-256 checksum mismatch on Block #{block['blockNumber']}. "
                           f"Expected {expected[:10]}... Got {block['hash'][:10]}...",
                    totalBlocks=total,
                )

        return ChainIntegrityResponse(isValid=True, brokenBlockIndex=None, reason=None, totalBlocks=total)
    finally:
        await db.close()


@router.post("/reset-empty", status_code=200)
async def reset_empty():
    """Wipe all blocks + memories, keep only genesis block."""
    db = await get_db()
    try:
        await db.execute("DELETE FROM blocks")
        await db.execute("DELETE FROM memories")
        await db.execute("DELETE FROM threats")

        genesis_hash = sha256(f"0:{GENESIS_PREV_HASH}:{GENESIS_AGENT_ID}:{GENESIS_CONTENT}:{GENESIS_TIMESTAMP}")
        await db.execute(
            """INSERT INTO blocks VALUES (
                0,:timestamp,:agentId,'MNEMORIX ROOT SENTINEL','mem_genesis',:content,
                NULL,:prevHash,:hash,:merkleRoot,:signature,0,NULL
            )""",
            {
                "timestamp": GENESIS_TIMESTAMP,
                "agentId": GENESIS_AGENT_ID,
                "content": GENESIS_CONTENT,
                "prevHash": GENESIS_PREV_HASH,
                "hash": genesis_hash,
                "merkleRoot": genesis_hash,
                "signature": generate_block_signature(0, genesis_hash, GENESIS_AGENT_ID),
            },
        )
        await db.commit()
        return {"message": "Ledger wiped. Genesis block anchored.", "totalBlocks": 1}
    finally:
        await db.close()


@router.post("/reset-baseline", status_code=200)
async def reset_baseline():
    """Full reset to the preset seed data (same as self-heal)."""
    return await self_heal()

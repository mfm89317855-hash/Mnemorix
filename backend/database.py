"""
MNEMORIX Sentinel — Async SQLite database layer
Creates all tables, seeds initial data on first startup, and provides
helper functions used by every router.
"""

from __future__ import annotations
import aiosqlite
import json
import os
from datetime import datetime, timezone

from crypto_utils import (
    sha256, compute_merkle_root, generate_block_signature,
    build_memory_hash,
    GENESIS_PREV_HASH, GENESIS_CONTENT, GENESIS_TIMESTAMP, GENESIS_AGENT_ID,
)
from presets_data import (
    INITIAL_AGENTS, INITIAL_MEMORIES_RAW,
    INITIAL_THREATS, INITIAL_POLICIES, INITIAL_AUDIT_LOGS,
)

DATABASE_URL = os.getenv("DATABASE_URL", "./mnemorix.db")

# On Vercel serverless, only /tmp is writable.
# vercel.json sets DATABASE_URL=/tmp/mnemorix.db for production.
_IS_VERCEL = os.getenv("VERCEL") == "1"
if _IS_VERCEL and DATABASE_URL == "./mnemorix.db":
    DATABASE_URL = "/tmp/mnemorix.db"


# ─── Schema ───────────────────────────────────────────────────────────────────

CREATE_TABLES_SQL = """
CREATE TABLE IF NOT EXISTS agents (
    id               TEXT PRIMARY KEY,
    name             TEXT NOT NULL,
    codeName         TEXT,
    role             TEXT,
    avatar           TEXT,
    model            TEXT,
    status           TEXT DEFAULT 'active',
    memoryCount      INTEGER DEFAULT 0,
    verifiedCount    INTEGER DEFAULT 0,
    quarantinedCount INTEGER DEFAULT 0,
    integrityScore   REAL DEFAULT 100.0,
    vectorDriftAvg   REAL DEFAULT 0.001,
    lastActive       TEXT DEFAULT 'Just now',
    partitions       TEXT DEFAULT '{"episodic":0,"semantic":0,"procedural":0,"working":0}',
    threatLevel      TEXT DEFAULT 'low'
);

CREATE TABLE IF NOT EXISTS memories (
    id               TEXT PRIMARY KEY,
    agentId          TEXT NOT NULL,
    agentName        TEXT,
    partition        TEXT,
    content          TEXT,
    category         TEXT,
    timestamp        TEXT,
    hash             TEXT,
    parentHash       TEXT,
    status           TEXT DEFAULT 'verified',
    piiRedacted      INTEGER DEFAULT 0,
    confidenceScore  REAL DEFAULT 0.999,
    tags             TEXT DEFAULT '[]',
    author           TEXT,
    vectorDriftDelta REAL DEFAULT 0.002,
    metadata         TEXT DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS blocks (
    blockNumber     INTEGER PRIMARY KEY,
    timestamp       TEXT,
    agentId         TEXT,
    agentName       TEXT,
    memoryId        TEXT,
    content         TEXT,
    originalContent TEXT,
    prevHash        TEXT,
    hash            TEXT,
    merkleRoot      TEXT,
    signature       TEXT,
    isTampered      INTEGER DEFAULT 0,
    tamperReason    TEXT
);

CREATE TABLE IF NOT EXISTS threats (
    id               TEXT PRIMARY KEY,
    timestamp        TEXT,
    agentId          TEXT,
    agentName        TEXT,
    type             TEXT,
    title            TEXT,
    severity         TEXT,
    rawPayload       TEXT,
    layerTriggered   TEXT,
    actionTaken      TEXT,
    explanation      TEXT,
    threatScore      INTEGER,
    mitigationApplied TEXT,
    sanitizedContent TEXT
);

CREATE TABLE IF NOT EXISTS policies (
    id           TEXT PRIMARY KEY,
    name         TEXT,
    description  TEXT,
    category     TEXT,
    enabled      INTEGER DEFAULT 1,
    ruleType     TEXT,
    threshold    REAL,
    pattern      TEXT,
    action       TEXT,
    enforcedCount INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id        TEXT PRIMARY KEY,
    timestamp TEXT,
    action    TEXT,
    source    TEXT,
    targetId  TEXT,
    status    TEXT,
    hash      TEXT,
    details   TEXT
);

CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT
);
"""


# ─── Connection helper ────────────────────────────────────────────────────────

async def get_db() -> aiosqlite.Connection:
    db = await aiosqlite.connect(DATABASE_URL)
    db.row_factory = aiosqlite.Row
    await db.execute("PRAGMA journal_mode=WAL")
    return db


# ─── Initialise & Seed ───────────────────────────────────────────────────────

async def init_db() -> None:
    """Create tables + seed initial data (idempotent — safe to call on every startup)."""
    async with aiosqlite.connect(DATABASE_URL) as db:
        db.row_factory = aiosqlite.Row
        await db.executescript(CREATE_TABLES_SQL)
        await db.commit()

        # Check if already seeded
        async with db.execute("SELECT value FROM meta WHERE key='seeded'") as cur:
            row = await cur.fetchone()
            if row:
                return  # Already seeded — skip

        # ── Seed agents ───────────────────────────────────────────────────────
        for a in INITIAL_AGENTS:
            await db.execute(
                """INSERT OR IGNORE INTO agents VALUES (
                    :id,:name,:codeName,:role,:avatar,:model,:status,
                    :memoryCount,:verifiedCount,:quarantinedCount,
                    :integrityScore,:vectorDriftAvg,:lastActive,:partitions,:threatLevel
                )""",
                {**a, "partitions": json.dumps(a["partitions"])},
            )

        # ── Seed threats ──────────────────────────────────────────────────────
        for t in INITIAL_THREATS:
            await db.execute(
                """INSERT OR IGNORE INTO threats VALUES (
                    :id,:timestamp,:agentId,:agentName,:type,:title,:severity,
                    :rawPayload,:layerTriggered,:actionTaken,:explanation,
                    :threatScore,:mitigationApplied,:sanitizedContent
                )""",
                t,
            )

        # ── Seed policies ─────────────────────────────────────────────────────
        for p in INITIAL_POLICIES:
            await db.execute(
                """INSERT OR IGNORE INTO policies VALUES (
                    :id,:name,:description,:category,:enabled,:ruleType,
                    :threshold,:pattern,:action,:enforcedCount
                )""",
                {
                    **p,
                    "enabled": 1 if p["enabled"] else 0,
                    "threshold": p.get("threshold"),
                    "pattern": p.get("pattern"),
                },
            )

        # ── Seed audit logs ───────────────────────────────────────────────────
        for log in INITIAL_AUDIT_LOGS:
            await db.execute(
                """INSERT OR IGNORE INTO audit_logs VALUES (
                    :id,:timestamp,:action,:source,:targetId,:status,:hash,:details
                )""",
                log,
            )

        # ── Build genesis block + real Merkle chain from seed memories ────────
        prev_hash = GENESIS_PREV_HASH
        genesis_hash = sha256(f"0:{prev_hash}:{GENESIS_AGENT_ID}:{GENESIS_CONTENT}:{GENESIS_TIMESTAMP}")
        await db.execute(
            """INSERT OR IGNORE INTO blocks VALUES (
                0,:timestamp,:agentId,:agentName,'mem_genesis',:content,
                NULL,:prevHash,:hash,:merkleRoot,:signature,0,NULL
            )""",
            {
                "timestamp": GENESIS_TIMESTAMP,
                "agentId": GENESIS_AGENT_ID,
                "agentName": "MNEMORIX ROOT SENTINEL",
                "content": GENESIS_CONTENT,
                "prevHash": prev_hash,
                "hash": genesis_hash,
                "merkleRoot": genesis_hash,
                "signature": generate_block_signature(0, genesis_hash, GENESIS_AGENT_ID),
            },
        )

        running_hashes = [genesis_hash]
        prev_hash = genesis_hash

        for idx, m in enumerate(INITIAL_MEMORIES_RAW):
            block_num = idx + 1
            mem_hash = build_memory_hash(block_num, prev_hash, m["agentId"], m["content"], m["timestamp"])
            running_hashes.append(mem_hash)
            merkle_root = compute_merkle_root(running_hashes)
            sig = generate_block_signature(block_num, mem_hash, m["agentId"])

            # Insert memory
            await db.execute(
                """INSERT OR IGNORE INTO memories VALUES (
                    :id,:agentId,:agentName,:partition,:content,:category,
                    :timestamp,:hash,:parentHash,:status,:piiRedacted,
                    :confidenceScore,:tags,:author,:vectorDriftDelta,:metadata
                )""",
                {
                    **m,
                    "hash": mem_hash,
                    "parentHash": prev_hash,
                    "piiRedacted": 1 if m.get("piiRedacted") else 0,
                    "tags": json.dumps(m.get("tags", [])),
                    "metadata": json.dumps(m.get("metadata", {})),
                },
            )

            # Insert block
            await db.execute(
                """INSERT OR IGNORE INTO blocks VALUES (
                    :blockNumber,:timestamp,:agentId,:agentName,:memoryId,:content,
                    NULL,:prevHash,:hash,:merkleRoot,:signature,0,NULL
                )""",
                {
                    "blockNumber": block_num,
                    "timestamp": m["timestamp"],
                    "agentId": m["agentId"],
                    "agentName": m["agentName"],
                    "memoryId": m["id"],
                    "content": m["content"],
                    "prevHash": prev_hash,
                    "hash": mem_hash,
                    "merkleRoot": merkle_root,
                    "signature": sig,
                },
            )

            prev_hash = mem_hash

        await db.execute("INSERT INTO meta VALUES ('seeded','1')")
        await db.commit()


# ─── Row → dict helpers ───────────────────────────────────────────────────────

def row_to_dict(row: aiosqlite.Row) -> dict:
    return dict(row)


def memory_row_to_dict(row: aiosqlite.Row) -> dict:
    d = dict(row)
    d["tags"] = json.loads(d.get("tags") or "[]")
    d["metadata"] = json.loads(d.get("metadata") or "{}")
    d["piiRedacted"] = bool(d.get("piiRedacted", 0))
    return d


def agent_row_to_dict(row: aiosqlite.Row) -> dict:
    d = dict(row)
    d["partitions"] = json.loads(d.get("partitions") or "{}")
    return d


def block_row_to_dict(row: aiosqlite.Row) -> dict:
    d = dict(row)
    d["isTampered"] = bool(d.get("isTampered", 0))
    return d


def policy_row_to_dict(row: aiosqlite.Row) -> dict:
    d = dict(row)
    d["enabled"] = bool(d.get("enabled", 1))
    return d

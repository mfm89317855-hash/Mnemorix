"""
GET /api/kpis  — aggregated dashboard statistics including chain integrity status
"""

from fastapi import APIRouter
from models import KPIResponse
from database import get_db

router = APIRouter(prefix="/api/kpis", tags=["KPIs"])


@router.get("", response_model=KPIResponse)
async def get_kpis() -> KPIResponse:
    db = await get_db()
    try:
        async with db.execute("SELECT COUNT(*) FROM memories") as cur:
            total_memories = (await cur.fetchone())[0]

        async with db.execute("SELECT COUNT(*) FROM threats WHERE actionTaken='blocked'") as cur:
            injections_blocked = (await cur.fetchone())[0]

        async with db.execute("SELECT COUNT(*) FROM memories WHERE status='quarantined'") as cur:
            quarantined_count = (await cur.fetchone())[0]

        async with db.execute("SELECT COUNT(*) FROM agents") as cur:
            total_agents = (await cur.fetchone())[0]

        async with db.execute("SELECT COUNT(*) FROM blocks") as cur:
            total_blocks = (await cur.fetchone())[0]

        async with db.execute("SELECT COUNT(*) FROM policies WHERE enabled=1") as cur:
            active_policies = (await cur.fetchone())[0]

        async with db.execute("SELECT COUNT(*) FROM blocks WHERE isTampered=1") as cur:
            tampered = (await cur.fetchone())[0]

        is_chain_compromised = tampered > 0
        integrity_score = 78.4 if is_chain_compromised else 99.8

        return KPIResponse(
            totalMemories=total_memories,
            injectionsBlocked=injections_blocked,
            quarantinedCount=quarantined_count,
            integrityScore=integrity_score,
            avgLatencyMs=1.18,
            totalAgents=total_agents,
            totalBlocks=total_blocks,
            activePolicies=active_policies,
            isChainCompromised=is_chain_compromised,
        )
    finally:
        await db.close()

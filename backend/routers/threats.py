"""
GET  /api/threats      — list all threat events
POST /api/threats      — add a new threat event
"""

from __future__ import annotations
from datetime import datetime, timezone

from fastapi import APIRouter
from models import ThreatEvent, ThreatEventCreate
from database import get_db, row_to_dict

router = APIRouter(prefix="/api/threats", tags=["Threats"])


@router.get("", response_model=list[ThreatEvent])
async def list_threats():
    db = await get_db()
    try:
        async with db.execute("SELECT * FROM threats ORDER BY timestamp DESC") as cur:
            rows = await cur.fetchall()
        return [row_to_dict(r) for r in rows]
    finally:
        await db.close()


@router.post("", response_model=ThreatEvent, status_code=201)
async def add_threat(body: ThreatEventCreate):
    import time
    new_id = f"thr_{int(time.time() * 1000)}"
    timestamp = datetime.now(timezone.utc).isoformat()

    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO threats VALUES (
                :id,:timestamp,:agentId,:agentName,:type,:title,:severity,
                :rawPayload,:layerTriggered,:actionTaken,:explanation,
                :threatScore,:mitigationApplied,:sanitizedContent
            )""",
            {
                "id": new_id,
                "timestamp": timestamp,
                "agentId": body.agentId,
                "agentName": body.agentName,
                "type": body.type,
                "title": body.title,
                "severity": body.severity,
                "rawPayload": body.rawPayload,
                "layerTriggered": body.layerTriggered,
                "actionTaken": body.actionTaken,
                "explanation": body.explanation,
                "threatScore": body.threatScore,
                "mitigationApplied": body.mitigationApplied,
                "sanitizedContent": body.sanitizedContent,
            },
        )
        await db.commit()
        async with db.execute("SELECT * FROM threats WHERE id=?", (new_id,)) as cur:
            row = await cur.fetchone()
        return row_to_dict(row)
    finally:
        await db.close()

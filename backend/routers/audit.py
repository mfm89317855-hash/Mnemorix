"""
GET    /api/audit-logs           — list all audit logs (filterable)
POST   /api/audit-logs           — append a new log entry
DELETE /api/audit-logs           — clear all logs
GET    /api/audit-logs/export    — download JSON file
"""

from __future__ import annotations
import json, time
from datetime import datetime, timezone

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse, Response
from models import AuditLog, AuditLogCreate
from database import get_db, row_to_dict
from crypto_utils import sha256

router = APIRouter(prefix="/api/audit-logs", tags=["Audit Logs"])


@router.get("/export")
async def export_logs():
    db = await get_db()
    try:
        async with db.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC") as cur:
            rows = await cur.fetchall()
        data = [row_to_dict(r) for r in rows]
        content = json.dumps(data, indent=2)
        return Response(
            content=content,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=mnemorix-audit-trail-{int(time.time())}.json"},
        )
    finally:
        await db.close()


@router.get("", response_model=list[AuditLog])
async def list_logs(
    status: str | None = Query(None),
    search: str | None = Query(None),
    limit: int = Query(100, le=500),
):
    db = await get_db()
    try:
        query = "SELECT * FROM audit_logs WHERE 1=1"
        params: list = []
        if status and status != "all":
            query += " AND status=?"
            params.append(status)
        if search:
            q = f"%{search.lower()}%"
            query += " AND (LOWER(action) LIKE ? OR LOWER(source) LIKE ? OR LOWER(targetId) LIKE ? OR LOWER(details) LIKE ?)"
            params.extend([q, q, q, q])
        query += " ORDER BY timestamp DESC LIMIT ?"
        params.append(limit)
        async with db.execute(query, params) as cur:
            rows = await cur.fetchall()
        return [row_to_dict(r) for r in rows]
    finally:
        await db.close()


@router.post("", response_model=AuditLog, status_code=201)
async def add_log(body: AuditLogCreate):
    new_id = f"log_{int(time.time() * 1000)}_{str(time.time_ns())[-4:]}"
    timestamp = datetime.now(timezone.utc).isoformat()
    log_hash = body.hash or sha256(body.action + body.targetId + timestamp)

    db = await get_db()
    try:
        await db.execute(
            "INSERT INTO audit_logs VALUES (:id,:timestamp,:action,:source,:targetId,:status,:hash,:details)",
            {
                "id": new_id,
                "timestamp": timestamp,
                "action": body.action,
                "source": body.source,
                "targetId": body.targetId,
                "status": body.status,
                "hash": log_hash,
                "details": body.details,
            },
        )
        await db.commit()
        async with db.execute("SELECT * FROM audit_logs WHERE id=?", (new_id,)) as cur:
            row = await cur.fetchone()
        return row_to_dict(row)
    finally:
        await db.close()


@router.delete("", status_code=204)
async def clear_logs():
    db = await get_db()
    try:
        await db.execute("DELETE FROM audit_logs")
        await db.commit()
    finally:
        await db.close()

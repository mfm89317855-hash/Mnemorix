"""
GET  /api/agents          — list all agents
POST /api/agents          — create new agent
GET  /api/agents/{id}     — get single agent
"""

from __future__ import annotations
import json
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from models import AgentInfo, AgentInfoCreate
from database import get_db, agent_row_to_dict

router = APIRouter(prefix="/api/agents", tags=["Agents"])


@router.get("", response_model=list[AgentInfo])
async def list_agents():
    db = await get_db()
    try:
        async with db.execute("SELECT * FROM agents ORDER BY name") as cur:
            rows = await cur.fetchall()
        return [agent_row_to_dict(r) for r in rows]
    finally:
        await db.close()


@router.get("/{agent_id}", response_model=AgentInfo)
async def get_agent(agent_id: str):
    db = await get_db()
    try:
        async with db.execute("SELECT * FROM agents WHERE id=?", (agent_id,)) as cur:
            row = await cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Agent not found")
        return agent_row_to_dict(row)
    finally:
        await db.close()


@router.post("", response_model=AgentInfo, status_code=201)
async def create_agent(body: AgentInfoCreate):
    new_id = f"agent_{int(datetime.now(timezone.utc).timestamp() * 1000)}"
    partitions = json.dumps({"episodic": 0, "semantic": 0, "procedural": 0, "working": 0})
    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO agents VALUES (
                :id,:name,:codeName,:role,:avatar,:model,:status,
                0,0,0,100.0,0.001,'Just now',:partitions,'low'
            )""",
            {
                "id": new_id,
                "name": body.name,
                "codeName": body.codeName,
                "role": body.role,
                "avatar": body.avatar,
                "model": body.model,
                "status": body.status,
                "partitions": partitions,
            },
        )
        await db.commit()
        async with db.execute("SELECT * FROM agents WHERE id=?", (new_id,)) as cur:
            row = await cur.fetchone()
        return agent_row_to_dict(row)
    finally:
        await db.close()

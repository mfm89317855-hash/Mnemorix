"""
GET    /api/policies                    — list policies (with optional ?category= filter)
POST   /api/policies                    — create new policy
PATCH  /api/policies/{id}/toggle        — enable / disable a policy
POST   /api/policies/evaluate           — test a payload against active rules
"""

from __future__ import annotations
import re, time
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query
from models import SecurityPolicy, SecurityPolicyCreate, PolicyEvaluateRequest, PolicyEvaluateResponse
from database import get_db, policy_row_to_dict

router = APIRouter(prefix="/api/policies", tags=["Policies"])


@router.get("", response_model=list[SecurityPolicy])
async def list_policies(category: str | None = Query(None)):
    db = await get_db()
    try:
        query = "SELECT * FROM policies"
        params: list = []
        if category and category != "all":
            query += " WHERE category=?"
            params.append(category)
        async with db.execute(query, params) as cur:
            rows = await cur.fetchall()
        return [policy_row_to_dict(r) for r in rows]
    finally:
        await db.close()


@router.post("", response_model=SecurityPolicy, status_code=201)
async def create_policy(body: SecurityPolicyCreate):
    new_id = f"pol_{int(time.time() * 1000)}"
    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO policies VALUES (
                :id,:name,:description,:category,:enabled,:ruleType,
                :threshold,:pattern,:action,0
            )""",
            {
                "id": new_id,
                "name": body.name,
                "description": body.description,
                "category": body.category,
                "enabled": 1 if body.enabled else 0,
                "ruleType": body.ruleType,
                "threshold": body.threshold,
                "pattern": body.pattern,
                "action": body.action,
            },
        )
        await db.commit()
        async with db.execute("SELECT * FROM policies WHERE id=?", (new_id,)) as cur:
            row = await cur.fetchone()
        return policy_row_to_dict(row)
    finally:
        await db.close()


@router.patch("/{policy_id}/toggle", response_model=SecurityPolicy)
async def toggle_policy(policy_id: str):
    db = await get_db()
    try:
        async with db.execute("SELECT * FROM policies WHERE id=?", (policy_id,)) as cur:
            row = await cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Policy not found")
        new_state = 0 if row["enabled"] else 1
        await db.execute("UPDATE policies SET enabled=? WHERE id=?", (new_state, policy_id))
        await db.commit()
        async with db.execute("SELECT * FROM policies WHERE id=?", (policy_id,)) as cur:
            updated = await cur.fetchone()
        return policy_row_to_dict(updated)
    finally:
        await db.close()


@router.post("/evaluate", response_model=PolicyEvaluateResponse)
async def evaluate_payload(body: PolicyEvaluateRequest):
    db = await get_db()
    try:
        async with db.execute("SELECT * FROM policies WHERE enabled=1") as cur:
            rows = await cur.fetchall()
        active_policies = [policy_row_to_dict(r) for r in rows]
    finally:
        await db.close()

    lower = body.payload.lower()
    violated: list[str] = []

    for p in active_policies:
        matched = False
        if p["ruleType"] == "regex_guard":
            if any(kw in lower for kw in ["override", "ignore previous", "system_override",
                                           "jailbreak", "unfiltered_debug"]):
                matched = True
        elif p["ruleType"] == "pii_redaction":
            if any(kw in lower for kw in ["api_key", "password", "bearer", "secret"]):
                matched = True
        elif p["ruleType"] == "canary_trap":
            if "canary" in lower:
                matched = True

        if matched:
            violated.append(p["name"])
            # Increment enforcedCount
            db2 = await get_db()
            try:
                await db2.execute(
                    "UPDATE policies SET enforcedCount = enforcedCount + 1 WHERE id=?", (p["id"],)
                )
                await db2.commit()
            finally:
                await db2.close()

    if violated:
        return PolicyEvaluateResponse(
            passed=False,
            violatedPolicies=violated,
            result=f"🚨 VIOLATION TRIGGERED: Blocked by [{', '.join(violated)}]",
        )
    return PolicyEvaluateResponse(
        passed=True,
        violatedPolicies=[],
        result="✅ PASSED: No active security policy violations found.",
    )

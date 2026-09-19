"""
MNEMORIX Sentinel — FastAPI Application Entry Point
Zero-Trust AI Memory Firewall Backend
"""

from __future__ import annotations
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from database import init_db
from routers import sentinel, agents, memories, blocks, threats, audit, policies, copilot, kpis, fastn


# ─── Lifespan: DB init on startup ────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[MNEMORIX] Sentinel starting -- initialising database...")
    await init_db()
    print("[MNEMORIX] Database ready. All tables seeded.")
    yield
    print("[MNEMORIX] Sentinel shutting down.")


# ─── App ─────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="MNEMORIX Zero-Trust AI Memory Sentinel Firewall API",
    description=(
        "Pre-Ingestion & Post-Retrieval Security Middleware for Autonomous AI Agents. "
        "Implements L1 Heuristic, L2 Vector Drift, and L3 Gemini 2.5 Neural Semantic analysis."
    ),
    version="2.5.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


# ─── CORS ────────────────────────────────────────────────────────────────────

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_origin,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Routers ─────────────────────────────────────────────────────────────────

app.include_router(sentinel.router)
app.include_router(agents.router)
app.include_router(memories.router)
app.include_router(blocks.router)
app.include_router(threats.router)
app.include_router(audit.router)
app.include_router(policies.router)
app.include_router(copilot.router)
app.include_router(kpis.router)
app.include_router(fastn.router)


# ─── Health check ────────────────────────────────────────────────────────────

@app.get("/health", tags=["System"])
async def health():
    return {
        "status": "OPERATIONAL",
        "system": "MNEMORIX Zero-Trust AI Memory Sentinel",
        "version": "2.5.0",
        "compliance": ["FIPS 180-4 SHA-256", "NIST AI RMF 1.0", "ISO 42001", "SOC2 Type II"],
    }


@app.get("/", tags=["System"])
async def root():
    return {
        "message": "MNEMORIX Sentinel API is active. Visit /docs for the interactive API explorer.",
        "endpoints": {
            "inspect":    "POST /api/sentinel/inspect",
            "agents":     "GET  /api/agents",
            "memories":   "GET  /api/memories",
            "blocks":     "GET  /api/blocks",
            "threats":    "GET  /api/threats",
            "audit_logs": "GET  /api/audit-logs",
            "policies":   "GET  /api/policies",
            "copilot":    "POST /api/copilot/chat",
            "kpis":       "GET  /api/kpis",
            "docs":       "GET  /docs",
        },
    }


# ─── Dev runner ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

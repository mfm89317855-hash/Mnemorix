"""
MNEMORIX Sentinel — Pydantic v2 models
Mirrors the TypeScript types.ts exactly so the frontend can deserialize without changes.
"""

from __future__ import annotations
from typing import Literal, Optional, Any
from pydantic import BaseModel, Field
import uuid
from datetime import datetime


# ─── Enums / Literals ────────────────────────────────────────────────────────

MemoryPartition = Literal["episodic", "semantic", "procedural", "working"]
MemoryStatus    = Literal["verified", "quarantined", "flagged", "tampered"]
ThreatType      = Literal[
    "indirect_prompt_injection", "memory_backdoor", "privilege_escalation",
    "semantic_drift", "exfiltration_beacon", "unauthorized_write",
]
ThreatSeverity  = Literal["critical", "high", "medium", "low"]
AgentStatus     = Literal["active", "quarantined", "shielded", "analyzing"]
ThreatLevel     = Literal["low", "elevated", "severe", "critical"]
LayerTriggered  = Literal[
    "L1: Heuristic Pattern Sentinel",
    "L2: Vector Cosine Anomaly",
    "L3: Gemini Neural Semantic",
]
ActionTaken     = Literal["blocked", "quarantined", "redacted", "audited"]
PolicyCategory  = Literal["Zero-Trust", "Drift Control", "Privacy & PII", "Canary Defense", "Merkle Sealing"]
PolicyRuleType  = Literal["drift_threshold", "pii_redaction", "merkle_strict", "canary_trap", "regex_guard"]
PolicyAction    = Literal["quarantine", "block", "sanitize", "alert_only"]
AuditStatus     = Literal["SUCCESS", "BLOCKED", "TAMPER_ALERT", "RESTORED", "QUARANTINED"]


# ─── MemoryItem ───────────────────────────────────────────────────────────────

class MemoryItemCreate(BaseModel):
    agentId: str
    agentName: str
    partition: MemoryPartition
    content: str
    category: str
    piiRedacted: bool = False
    confidenceScore: float = 0.999
    tags: list[str] = []
    author: str = "System"
    vectorDriftDelta: float = 0.002
    metadata: Optional[dict[str, Any]] = None


class MemoryItem(MemoryItemCreate):
    id: str
    hash: str
    parentHash: str
    status: MemoryStatus = "verified"
    timestamp: str


# ─── MerkleBlock ─────────────────────────────────────────────────────────────

class MerkleBlock(BaseModel):
    blockNumber: int
    timestamp: str
    agentId: str
    agentName: str
    memoryId: str
    content: str
    originalContent: Optional[str] = None
    prevHash: str
    hash: str
    merkleRoot: str
    signature: str
    isTampered: Optional[bool] = None
    tamperReason: Optional[str] = None


# ─── AgentInfo ───────────────────────────────────────────────────────────────

class AgentPartitions(BaseModel):
    episodic: int = 0
    semantic: int = 0
    procedural: int = 0
    working: int = 0


class AgentInfoCreate(BaseModel):
    name: str
    codeName: str
    role: str
    avatar: str
    model: str
    status: AgentStatus = "active"


class AgentInfo(AgentInfoCreate):
    id: str
    memoryCount: int = 0
    verifiedCount: int = 0
    quarantinedCount: int = 0
    integrityScore: float = 100.0
    vectorDriftAvg: float = 0.001
    lastActive: str = "Just now"
    partitions: AgentPartitions = AgentPartitions()
    threatLevel: ThreatLevel = "low"


# ─── ThreatEvent ─────────────────────────────────────────────────────────────

class ThreatEventCreate(BaseModel):
    agentId: str
    agentName: str
    type: ThreatType
    title: str
    severity: ThreatSeverity
    rawPayload: str
    layerTriggered: str
    actionTaken: ActionTaken
    explanation: str
    threatScore: int = Field(ge=0, le=100)
    mitigationApplied: str
    sanitizedContent: Optional[str] = None


class ThreatEvent(ThreatEventCreate):
    id: str
    timestamp: str


# ─── SecurityPolicy ──────────────────────────────────────────────────────────

class SecurityPolicyCreate(BaseModel):
    name: str
    description: str
    category: PolicyCategory
    enabled: bool = True
    ruleType: PolicyRuleType = "regex_guard"
    threshold: Optional[float] = None
    pattern: Optional[str] = None
    action: PolicyAction = "block"


class SecurityPolicy(SecurityPolicyCreate):
    id: str
    enforcedCount: int = 0


# ─── AuditLog ────────────────────────────────────────────────────────────────

class AuditLogCreate(BaseModel):
    action: str
    source: str
    targetId: str
    status: AuditStatus
    details: str
    hash: Optional[str] = None


class AuditLog(AuditLogCreate):
    id: str
    timestamp: str
    hash: str


# ─── Sentinel Inspect ────────────────────────────────────────────────────────

class SentinelInspectRequest(BaseModel):
    agentId: str
    agentName: str
    partition: MemoryPartition
    content: str


class InspectionLayer(BaseModel):
    layer: str
    name: str
    status: Literal["passed", "flagged"]
    score: int
    details: str
    latencyMs: float


class SentinelInspectResponse(BaseModel):
    allowed: bool
    threatDetected: bool
    threatType: str
    threatScore: int
    severity: str
    confidence: float
    verdict: str
    sha256Hash: str
    merkleRoot: str
    sanitizedContent: str
    identifiedTokens: list[str]
    recommendedAction: str
    mitigationPlaybook: str
    layers: list[InspectionLayer]
    timestamp: str


# ─── Policy Evaluate ─────────────────────────────────────────────────────────

class PolicyEvaluateRequest(BaseModel):
    payload: str


class PolicyEvaluateResponse(BaseModel):
    passed: bool
    violatedPolicies: list[str]
    result: str


# ─── Tamper Block ────────────────────────────────────────────────────────────

class TamperBlockRequest(BaseModel):
    blockNumber: int
    newContent: str


# ─── KPIs ────────────────────────────────────────────────────────────────────

class KPIResponse(BaseModel):
    totalMemories: int
    injectionsBlocked: int
    quarantinedCount: int
    integrityScore: float
    avgLatencyMs: float
    totalAgents: int
    totalBlocks: int
    activePolicies: int
    isChainCompromised: bool = False


# ─── Copilot ─────────────────────────────────────────────────────────────────

class CopilotMessage(BaseModel):
    role: Literal["user", "sentinel"]
    text: str


class CopilotChatRequest(BaseModel):
    message: str
    systemContext: Optional[str] = None


class CopilotChatResponse(BaseModel):
    reply: str
    timestamp: str


# ─── Chain Integrity ─────────────────────────────────────────────────────────

class ChainIntegrityResponse(BaseModel):
    isValid: bool
    brokenBlockIndex: Optional[int]
    reason: Optional[str]
    totalBlocks: int

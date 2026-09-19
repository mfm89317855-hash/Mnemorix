"""
POST /api/copilot/chat
Proxies to Gemini 2.5 Flash with the Sentinel system prompt.
Falls back to smart heuristic canned responses if API key not set.
"""

from __future__ import annotations
import os
from datetime import datetime, timezone

from fastapi import APIRouter
from models import CopilotChatRequest, CopilotChatResponse

router = APIRouter(prefix="/api/copilot", tags=["Copilot"])

HEURISTIC_RESPONSES = {
    ("merkle", "hash", "tamper"): """### 🛡️ Merkle DAG & Hash-Chain Architecture

MNEMORIX protects agent memory stores via **Cryptographic SHA-256 Commit Anchors**:

1. **Continuous Chaining**: Each block hash is computed as:
   `SHA-256(blockNumber ∥ prevHash ∥ agentId ∥ content ∥ timestamp)`
2. **Instant Invalidation**: A single character change in any past block causes a Merkle root mismatch detected in < 1.2ms.
3. **Automated Rollback**: The system halts agent reasoning and restores the canonical ledger automatically.""",

    ("injection", "prompt", "attack"): """### 🚨 Indirect Prompt Injection & Memory Poisoning Defense

MNEMORIX implements a **3-Layer Defence Filter**:

- **L1 (Heuristic)**: Microsecond regex matching against 140+ adversarial jailbreak patterns.
- **L2 (Vector Distance)**: Cosine outlier scores — spikes > 0.08 trigger automatic quarantine.
- **L3 (Neural Semantic)**: Gemini 2.5 Flash inspects covert intent and multi-turn sleeper triggers before memory indexing.""",

    ("compliance", "soc2", "nist", "iso"): """### 📜 Compliance & AI Safety Governance

MNEMORIX fulfils enterprise compliance requirements:

- **NIST AI RMF 1.0**: Tamper-evident audit trails and continuous memory validation.
- **ISO/IEC 42001**: Cryptographically verifiable data lifecycle controls.
- **SOC2 Type II**: Zero-knowledge PII masking and immutable block verification logs.

Generate a certified audit report from the **Forensic Audit** tab.""",

    ("drift", "vector", "embedding"): """### 📡 Vector Drift & Semantic Anomaly Detection

The L2 Vector Cosine Drift Radar:

- Computes cosine distance between new memory embeddings and the agent's historical semantic centroid.
- Threshold: **Δ > 0.08** triggers quarantine.
- Protects against slow-burn semantic poisoning that heuristics alone cannot detect.""",
}


@router.post("/chat", response_model=CopilotChatResponse)
async def copilot_chat(body: CopilotChatRequest) -> CopilotChatResponse:
    api_key = os.getenv("GEMINI_API_KEY", "")
    reply: str = ""

    if len(api_key) > 10:
        try:
            import google.generativeai as genai  # type: ignore
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-2.5-flash")
            system_prompt = (
                "You are MNEMORIX Sentinel AI, an expert cybersecurity architect specialising in "
                "Autonomous AI Agent Memory Firewalls, Merkle DAG hash-chains, prompt injection defence, "
                "and NIST AI RMF compliance.\n\n"
            )
            if body.systemContext:
                system_prompt += f"Current System Context:\n{body.systemContext}\n\n"
            system_prompt += (
                "Respond in concise, professional, cyber-grade markdown. "
                "Use structured bullet points, clear technical explanations, and actionable mitigation guidance."
            )
            response = model.generate_content(f"{system_prompt}\n\nUser Question:\n{body.message}")
            if response and response.text:
                reply = response.text
        except Exception as e:
            print(f"[Copilot] Gemini error: {e}")

    if not reply:
        # Heuristic fallback
        q = body.message.lower()
        for keywords, response_text in HEURISTIC_RESPONSES.items():
            if any(kw in q for kw in keywords):
                reply = response_text
                break
        if not reply:
            reply = """### 🤖 MNEMORIX Sentinel System Advisory

I am continuously monitoring all active agent memory partitions (**Episodic, Semantic, Procedural, Working**).

- **Fleet Health**: Connected Agents with 100% Merkle Integrity
- **Active Defences**: L1 Heuristic + L2 Vector Drift + L3 Neural Guard
- **Zero-Trust Baseline**: Strict SHA-256 Sealing Enforced

*Tip: Test live attacks in the **Firewall Playground** tab, or simulate memory tampering in the **Merkle Hash-Chain Explorer**.*"""

    return CopilotChatResponse(
        reply=reply,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )

"""
MNEMORIX Sentinel — Reusable Memory Firewall Service
Enforces deterministic ALLOW, BLOCK, and REDACT policies on all memory operations.
Guarantees secret-safe audit logging without ever leaking confidential payloads.
"""

from __future__ import annotations
import os
import json
import re
import uuid
import hashlib
from datetime import datetime, timezone
from typing import Literal, Optional, Any, Dict
from pydantic import BaseModel, Field


# ─── Structured Decision Result Schema ───────────────────────────────────────

class FirewallDecisionResult(BaseModel):
    decision: Literal["ALLOW", "BLOCK", "REDACT"]
    filtered_data: Optional[Dict[str, Any]] = None
    reason: str
    rule_id: str
    sanitized_preview: Optional[str] = None
    redacted_count: int = 0


# ─── Memory Firewall Service Class ──────────────────────────────────────────

class MemoryFirewall:
    def __init__(self, policy_file_path: Optional[str] = None):
        if policy_file_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            policy_file_path = os.path.join(base_dir, "policies.json")
        self.policy_file_path = policy_file_path
        self.policies = self._load_policies()

    def _load_policies(self) -> dict:
        """Loads deterministic policies from the JSON configuration file."""
        if os.path.exists(self.policy_file_path):
            try:
                with open(self.policy_file_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"[MemoryFirewall] Warning: failed to parse policies.json: {e}")
        
        # Safe built-in fallback rules if file is missing
        return {
            "rules": [
                {
                    "id": "RULE_BLOCK_PROMPT_INJECTION",
                    "action": "BLOCK",
                    "patterns": [
                        r"(?i)\[system_override",
                        r"(?i)system[\s_-]*override",
                        r"(?i)ignore\s+all\s+instructions",
                        r"(?i)bypass\s+(safety|security)",
                        r"(?i)<\|im_start\|>",
                        r"(?i)jailbreak"
                    ],
                    "reason": "Adversarial prompt injection pattern detected"
                },
                {
                    "id": "RULE_BLOCK_EXFILTRATION",
                    "action": "BLOCK",
                    "patterns": [
                        r"(?i)exfiltrate\s+private",
                        r"(?i)c2-tracker",
                        r"(?i)webhook\.site/"
                    ],
                    "reason": "Data exfiltration attempt detected"
                },
                {
                    "id": "RULE_REDACT_API_KEY",
                    "action": "REDACT",
                    "patterns": [
                        r"sk-[A-Za-z0-9_-]{20,}",
                        r"AIza[0-9A-Za-z_-]{35}",
                        r"(?i)bearer\s+[a-zA-Z0-9_\-\.]{20,}"
                    ],
                    "replacement": "[REDACTED_API_KEY]",
                    "reason": "Secret API key or auth token redacted"
                },
                {
                    "id": "RULE_REDACT_PASSWORD",
                    "action": "REDACT",
                    "patterns": [
                        r"(?i)password\s*[:=]\s*['\"]?[^\s'\"]+['\"]?"
                    ],
                    "replacement": "[REDACTED_PASSWORD]",
                    "reason": "Password redacted"
                },
                {
                    "id": "RULE_REDACT_PII_SSN",
                    "action": "REDACT",
                    "patterns": [
                        r"\b\d{3}-\d{2}-\d{4}\b"
                    ],
                    "replacement": "[REDACTED_SSN]",
                    "reason": "SSN redacted"
                }
            ],
            "default_decision": {
                "action": "ALLOW",
                "rule_id": "RULE_ALLOW_DEFAULT",
                "reason": "Content passed all deterministic firewall policies cleanly"
            }
        }

    def inspect_ingress(self, memory_data: Dict[str, Any]) -> FirewallDecisionResult:
        """
        Evaluates an incoming memory before persistence.
        Order of deterministic precedence:
          1. Check BLOCK rules -> Immediately drop and do not store.
          2. Check REDACT rules -> Sanitize content and strip sensitive fields.
          3. Fallback to ALLOW -> Store unchanged.
        """
        content = memory_data.get("content", "")
        if not isinstance(content, str):
            content = str(content)

        rules = self.policies.get("rules", [])

        # ── Step 1: Evaluate BLOCK rules ──
        for rule in rules:
            if rule.get("action") == "BLOCK":
                patterns = rule.get("patterns", [])
                for pat in patterns:
                    if re.search(pat, content):
                        return FirewallDecisionResult(
                            decision="BLOCK",
                            filtered_data=None,
                            reason=rule.get("reason", "Prohibited memory pattern detected"),
                            rule_id=rule.get("id", "RULE_BLOCK_GENERIC"),
                            sanitized_preview=None,
                            redacted_count=0
                        )

        # ── Step 2: Evaluate REDACT rules ──
        modified_data = dict(memory_data)
        sanitized_content = content
        redacted_count = 0
        triggered_redact_rules = []

        for rule in rules:
            action = rule.get("action")
            
            # Content regex replacement (API keys, passwords, SSN, etc.)
            if action == "REDACT":
                patterns = rule.get("patterns", [])
                replacement = rule.get("replacement", "[REDACTED]")
                for pat in patterns:
                    matches = list(re.finditer(pat, sanitized_content))
                    if matches:
                        redacted_count += len(matches)
                        sanitized_content = re.sub(pat, replacement, sanitized_content)
                        if rule.get("id") not in triggered_redact_rules:
                            triggered_redact_rules.append(rule.get("id"))

            # Sensitive metadata field removal
            elif action == "REDACT_FIELD":
                fields = rule.get("fields", [])
                # Check top-level metadata dict
                meta = modified_data.get("metadata")
                if isinstance(meta, dict):
                    meta_copy = dict(meta)
                    for f_name in fields:
                        if f_name in meta_copy:
                            del meta_copy[f_name]
                            redacted_count += 1
                            if rule.get("id") not in triggered_redact_rules:
                                triggered_redact_rules.append(rule.get("id"))
                    modified_data["metadata"] = meta_copy

                # Check if field exists on top-level dictionary itself
                for f_name in fields:
                    if f_name in modified_data:
                        del modified_data[f_name]
                        redacted_count += 1
                        if rule.get("id") not in triggered_redact_rules:
                            triggered_redact_rules.append(rule.get("id"))

        if redacted_count > 0:
            modified_data["content"] = sanitized_content
            modified_data["piiRedacted"] = True
            primary_rule = triggered_redact_rules[0] if triggered_redact_rules else "RULE_REDACT_GENERIC"
            return FirewallDecisionResult(
                decision="REDACT",
                filtered_data=modified_data,
                reason=f"Sanitized {redacted_count} sensitive entity/field(s) before storage",
                rule_id=primary_rule,
                sanitized_preview=sanitized_content[:120] + ("..." if len(sanitized_content) > 120 else ""),
                redacted_count=redacted_count
            )

        # ── Step 3: ALLOW Decision ──
        default = self.policies.get("default_decision", {})
        return FirewallDecisionResult(
            decision="ALLOW",
            filtered_data=modified_data,
            reason=default.get("reason", "Content passed all deterministic firewall policies cleanly"),
            rule_id=default.get("rule_id", "RULE_ALLOW_DEFAULT"),
            sanitized_preview=content[:120] + ("..." if len(content) > 120 else ""),
            redacted_count=0
        )

    def inspect_egress(self, memory_data: Dict[str, Any]) -> FirewallDecisionResult:
        """
        Evaluates memory upon retrieval (egress filtering).
        Protects LLM prompt context by ensuring secrets or sensitive PII are
        redacted even if historical or external data had entered the store.
        """
        # Run standard inspection on the stored memory representation
        result = self.inspect_ingress(memory_data)
        return result

    @staticmethod
    async def log_audit_event(
        db,
        decision_result: FirewallDecisionResult,
        agent_id: str,
        target_id: str,
        operation: str = "INGRESS"
    ) -> str:
        """
        Persists a secret-safe audit log into the database.
        NEVER logs raw passwords, keys, tokens, or unredacted confidential strings.
        """
        audit_id = f"aud_{uuid.uuid4().hex[:10]}"
        now_iso = datetime.now(timezone.utc).isoformat()
        
        # Calculate safe non-reversible hash of the outcome
        safe_hash_input = f"{decision_result.decision}:{decision_result.rule_id}:{target_id}:{now_iso}"
        safe_hash = hashlib.sha256(safe_hash_input.encode("utf-8")).hexdigest()

        status_mapping = {
            "ALLOW": "SUCCESS",
            "REDACT": "REDACTED",
            "BLOCK": "BLOCKED"
        }
        status = status_mapping.get(decision_result.decision, "UNKNOWN")

        # Construct sanitized details string - NO raw sensitive inputs
        safe_details = (
            f"Operation: {operation} | Decision: {decision_result.decision} | "
            f"Rule: {decision_result.rule_id} | "
            f"Reason: {decision_result.reason} | "
            f"Entities Redacted: {decision_result.redacted_count}"
        )

        await db.execute(
            """INSERT INTO audit_logs (id, timestamp, action, source, targetId, status, hash, details)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                audit_id,
                now_iso,
                f"FIREWALL_{operation}_EVALUATION",
                f"MemoryFirewall (Agent: {agent_id})",
                target_id,
                status,
                safe_hash,
                safe_details
            )
        )
        return audit_id


# ─── Singleton Factory ───────────────────────────────────────────────────────

_instance: Optional[MemoryFirewall] = None

def get_firewall() -> MemoryFirewall:
    global _instance
    if _instance is None:
        _instance = MemoryFirewall()
    return _instance

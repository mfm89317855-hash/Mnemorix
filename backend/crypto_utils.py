"""
MNEMORIX Sentinel — Crypto utilities (Python)
Mirrors crypto.ts exactly so block hashes produced by the backend
agree with hashes computed by the React frontend's Web Crypto API.
"""

import hashlib
import math


def sha256(message: str) -> str:
    """Real SHA-256 — identical output to WebCrypto subtle.digest('SHA-256', ...)."""
    return hashlib.sha256(message.encode("utf-8")).hexdigest()


def compute_merkle_root(hashes: list[str]) -> str:
    """Iterative Merkle tree reduction, matches computeMerkleRoot() in crypto.ts."""
    if not hashes:
        return sha256("EMPTY_MERKLE_TREE_ROOT")
    if len(hashes) == 1:
        return hashes[0]

    current = list(hashes)
    while len(current) > 1:
        next_level: list[str] = []
        for i in range(0, len(current), 2):
            if i + 1 < len(current):
                combined = sha256(current[i] + current[i + 1])
            else:
                combined = sha256(current[i] + current[i])   # duplicate odd leaf
            next_level.append(combined)
        current = next_level
    return current[0]


def generate_block_signature(block_number: int, block_hash: str, agent_id: str) -> str:
    """Ed25519-style mock signature — matches generateBlockSignature() in crypto.ts."""
    prefix = "ed25519:sig:"
    seed = f"{agent_id}:{block_number}:{block_hash[:16]}"
    # Replicate the JS djb2-xor hash exactly
    hash_val = 5381
    for ch in seed:
        hash_val = ((hash_val * 33) ^ ord(ch)) & 0xFFFFFFFF
    hex_part = format(hash_val, "08x")
    return f"{prefix}{hex_part}{block_hash[-24:]}"


def truncate_hash(h: str, start: int = 6, end: int = 6) -> str:
    if not h:
        return ""
    if len(h) <= start + end:
        return h
    return f"{h[:start]}...{h[-end:]}"


def build_memory_hash(block_number: int, prev_hash: str, agent_id: str,
                      content: str, timestamp: str) -> str:
    """Canonical hash input: '{blockNumber}:{prevHash}:{agentId}:{content}:{timestamp}'"""
    return sha256(f"{block_number}:{prev_hash}:{agent_id}:{content}:{timestamp}")


GENESIS_PREV_HASH = "0" * 64
GENESIS_CONTENT   = (
    "GENESIS BLOCK: Zero-Trust AI Memory Sentinel initialized. "
    "SHA-256 Merkle DAG root anchors verified."
)
GENESIS_TIMESTAMP = "2026-09-19T08:00:00Z"
GENESIS_AGENT_ID  = "SYSTEM_GENESIS"

export type MemoryPartition = 'episodic' | 'semantic' | 'procedural' | 'working';

export type MemoryStatus = 'verified' | 'quarantined' | 'flagged' | 'tampered';

export interface MemoryItem {
  id: string;
  agentId: string;
  agentName: string;
  partition: MemoryPartition;
  content: string;
  category: string;
  timestamp: string;
  hash: string;
  parentHash: string;
  status: MemoryStatus;
  piiRedacted: boolean;
  confidenceScore: number;
  tags: string[];
  author: string;
  vectorDriftDelta: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface MerkleBlock {
  blockNumber: number;
  timestamp: string;
  agentId: string;
  agentName: string;
  memoryId: string;
  content: string;
  originalContent?: string;
  prevHash: string;
  hash: string;
  merkleRoot: string;
  signature: string;
  isTampered?: boolean;
  tamperReason?: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  codeName: string;
  role: string;
  avatar: string;
  model: string;
  status: 'active' | 'quarantined' | 'shielded' | 'analyzing';
  memoryCount: number;
  verifiedCount: number;
  quarantinedCount: number;
  integrityScore: number;
  vectorDriftAvg: number;
  lastActive: string;
  partitions: {
    episodic: number;
    semantic: number;
    procedural: number;
    working: number;
  };
  threatLevel: 'low' | 'elevated' | 'severe' | 'critical';
}

export type ThreatType =
  | 'indirect_prompt_injection'
  | 'memory_backdoor'
  | 'privilege_escalation'
  | 'semantic_drift'
  | 'exfiltration_beacon'
  | 'unauthorized_write';

export interface ThreatEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  type: ThreatType;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  rawPayload: string;
  layerTriggered: 'L1: Heuristic Pattern Sentinel' | 'L2: Vector Cosine Anomaly' | 'L3: Gemini Neural Semantic';
  actionTaken: 'blocked' | 'quarantined' | 'redacted' | 'audited';
  explanation: string;
  threatScore: number; // 0 - 100
  mitigationApplied: string;
  sanitizedContent?: string;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category: 'Zero-Trust' | 'Drift Control' | 'Privacy & PII' | 'Canary Defense' | 'Merkle Sealing';
  enabled: boolean;
  ruleType: 'drift_threshold' | 'pii_redaction' | 'merkle_strict' | 'canary_trap' | 'regex_guard';
  threshold?: number;
  pattern?: string;
  action: 'quarantine' | 'block' | 'sanitize' | 'alert_only';
  enforcedCount: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  source: string;
  targetId: string;
  status: 'SUCCESS' | 'BLOCKED' | 'TAMPER_ALERT' | 'RESTORED' | 'QUARANTINED';
  hash: string;
  details: string;
}

export interface AttackPreset {
  id: string;
  name: string;
  type: ThreatType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  targetAgentId: string;
  targetPartition: MemoryPartition;
  payload: string;
  expectedL1Match: boolean;
  expectedL2DriftScore: number;
  expectedL3Verdict: string;
}

export interface InspectionStep {
  layer: string;
  name: string;
  status: 'pending' | 'scanning' | 'passed' | 'flagged';
  score: number;
  details: string;
  latencyMs: number;
}

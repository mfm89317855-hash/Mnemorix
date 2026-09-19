/**
 * MNEMORIX Sentinel — Backend API Client
 * All fetch helpers pointing to the FastAPI backend at VITE_API_URL.
 * Falls back gracefully when the backend is unreachable (offline / demo mode).
 */

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8000';

// ─── Generic helpers ──────────────────────────────────────────────────────────

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

async function apiPost<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

async function apiPatch<T>(path: string, body?: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

async function apiDelete(path: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Health / Connectivity ────────────────────────────────────────────────────

export async function checkBackendHealth(): Promise<boolean> {
  const res = await apiGet<{ status: string }>('/health');
  return res?.status === 'OPERATIONAL';
}

// ─── KPIs ────────────────────────────────────────────────────────────────────

export async function fetchKPIs() {
  return apiGet<{
    totalMemories: number;
    injectionsBlocked: number;
    quarantinedCount: number;
    integrityScore: number;
    avgLatencyMs: number;
    totalAgents: number;
    totalBlocks: number;
    activePolicies: number;
  }>('/api/kpis');
}

// ─── Sentinel Inspect ─────────────────────────────────────────────────────────

export interface SentinelInspectRequest {
  agentId: string;
  agentName: string;
  partition: string;
  content: string;
}

export interface SentinelInspectResponse {
  allowed: boolean;
  threatDetected: boolean;
  threatType: string;
  threatScore: number;
  severity: string;
  confidence: number;
  verdict: string;
  sha256Hash: string;
  merkleRoot: string;
  sanitizedContent: string;
  identifiedTokens: string[];
  recommendedAction: string;
  mitigationPlaybook: string;
  layers: Array<{
    layer: string;
    name: string;
    status: 'passed' | 'flagged';
    score: number;
    details: string;
    latencyMs: number;
  }>;
  timestamp: string;
}

export async function sentinelInspect(
  payload: SentinelInspectRequest
): Promise<SentinelInspectResponse | null> {
  return apiPost<SentinelInspectResponse>('/api/sentinel/inspect', payload);
}

// ─── Agents ──────────────────────────────────────────────────────────────────

export async function fetchAgents() {
  return apiGet<any[]>('/api/agents');
}

export async function fetchAgent(agentId: string) {
  return apiGet<any>(`/api/agents/${agentId}`);
}

export async function createAgent(data: {
  name: string; codeName: string; role: string;
  avatar: string; model: string; status: string;
}) {
  return apiPost<any>('/api/agents', data);
}

// ─── Memories ────────────────────────────────────────────────────────────────

export async function fetchMemories(agentId?: string, partition?: string) {
  const params = new URLSearchParams();
  if (agentId)   params.set('agentId', agentId);
  if (partition) params.set('partition', partition);
  const qs = params.toString();
  return apiGet<any[]>(`/api/memories${qs ? '?' + qs : ''}`);
}

export async function addMemory(data: {
  agentId: string; agentName: string; partition: string;
  content: string; category: string; piiRedacted?: boolean;
  confidenceScore?: number; tags?: string[]; author?: string;
  vectorDriftDelta?: number; metadata?: Record<string, any>;
}) {
  return apiPost<any>('/api/memories', data);
}

export async function quarantineMemory(memoryId: string) {
  return apiPatch<any>(`/api/memories/${memoryId}/quarantine`);
}

export async function restoreMemory(memoryId: string) {
  return apiPatch<any>(`/api/memories/${memoryId}/restore`);
}

// ─── Merkle Blocks ───────────────────────────────────────────────────────────

export async function fetchBlocks() {
  return apiGet<any[]>('/api/blocks');
}

export async function tamperBlock(blockNumber: number, newContent: string) {
  return apiPost<any>('/api/blocks/tamper', { blockNumber, newContent });
}

export async function selfHealChain() {
  return apiPost<any>('/api/blocks/self-heal', {});
}

export async function auditChainIntegrity() {
  return apiPost<{
    isValid: boolean;
    brokenBlockIndex: number | null;
    reason: string | null;
    totalBlocks: number;
  }>('/api/blocks/audit-integrity', {});
}

export async function resetToEmptyLedger() {
  return apiPost<any>('/api/blocks/reset-empty', {});
}

export async function resetToBaselineLedger() {
  return apiPost<any>('/api/blocks/reset-baseline', {});
}

// ─── Threats ─────────────────────────────────────────────────────────────────

export async function fetchThreats() {
  return apiGet<any[]>('/api/threats');
}

export async function addThreat(data: {
  agentId: string; agentName: string; type: string; title: string;
  severity: string; rawPayload: string; layerTriggered: string;
  actionTaken: string; explanation: string; threatScore: number;
  mitigationApplied: string; sanitizedContent?: string;
}) {
  return apiPost<any>('/api/threats', data);
}

// ─── Audit Logs ──────────────────────────────────────────────────────────────

export async function fetchAuditLogs(status?: string, search?: string) {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  if (search) params.set('search', search);
  const qs = params.toString();
  return apiGet<any[]>(`/api/audit-logs${qs ? '?' + qs : ''}`);
}

export async function addAuditLog(data: {
  action: string; source: string; targetId: string;
  status: string; details: string; hash?: string;
}) {
  return apiPost<any>('/api/audit-logs', data);
}

export async function clearAuditLogs() {
  return apiDelete('/api/audit-logs');
}

export function getAuditExportUrl(): string {
  return `${BASE_URL}/api/audit-logs/export`;
}

// ─── Policies ────────────────────────────────────────────────────────────────

export async function fetchPolicies(category?: string) {
  const qs = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
  return apiGet<any[]>(`/api/policies${qs}`);
}

export async function createPolicy(data: {
  name: string; description: string; category: string;
  enabled?: boolean; ruleType?: string; action: string;
  threshold?: number; pattern?: string;
}) {
  return apiPost<any>('/api/policies', data);
}

export async function togglePolicy(policyId: string) {
  return apiPatch<any>(`/api/policies/${policyId}/toggle`);
}

export async function evaluatePolicy(payload: string) {
  return apiPost<{
    passed: boolean;
    violatedPolicies: string[];
    result: string;
  }>('/api/policies/evaluate', { payload });
}

// ─── Copilot ─────────────────────────────────────────────────────────────────

export async function sendCopilotMessage(
  message: string,
  systemContext?: string
): Promise<{ reply: string; timestamp: string } | null> {
  return apiPost('/api/copilot/chat', { message, systemContext });
}

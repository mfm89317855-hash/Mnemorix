/**
 * Fastn AI Platform Integration Utility for MNEMORIX Sentinel
 * Connects MNEMORIX Zero-Trust Memory Firewall with Fastn API Gateway & AI Orchestrator
 */

export interface FastnWebhookPayload {
  eventId: string;
  agentId: string;
  agentName: string;
  action: 'memory_read' | 'memory_write' | 'tool_call';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface FastnInspectionResponse {
  allowed: boolean;
  threatDetected: boolean;
  threatType: string;
  threatScore: number;
  verdict: string;
  sha256Hash: string;
  merkleRoot: string;
  sanitizedContent: string;
  timestamp: string;
}

/**
 * Fastn OpenAPI Specification Schema for MNEMORIX Memory Firewall
 */
export const FASTN_OPENAPI_SPEC = {
  openapi: '3.0.3',
  info: {
    title: 'MNEMORIX Zero-Trust AI Memory Sentinel Firewall API for Fastn',
    version: '2.5.0',
    description: 'Pre-Ingestion & Post-Retrieval Security Middleware for Fastn AI Agents',
  },
  paths: {
    '/api/sentinel/inspect': {
      post: {
        summary: 'Inspect and Validate Fastn AI Memory Payload',
        description: 'Runs L1 Heuristic, L2 Vector Drift, and L3 Gemini 2.5 Neural Semantic analysis before persisting into Fastn memory vault.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['agentId', 'agentName', 'partition', 'content'],
                properties: {
                  agentId: { type: 'string', example: 'agent_sentinel_alpha' },
                  agentName: { type: 'string', example: 'SENTINEL-ALPHA' },
                  partition: { type: 'string', example: 'procedural' },
                  content: { type: 'string', example: 'Authorized server configuration...' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Inspection Verdict',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    allowed: { type: 'boolean', example: true },
                    threatDetected: { type: 'boolean', example: false },
                    threatScore: { type: 'number', example: 12 },
                    verdict: { type: 'string', example: 'ALL CLEAR: Clean Memory Sealed' },
                    sha256Hash: { type: 'string', example: 'a3f18e9d0b8c4f729e11...' },
                    merkleRoot: { type: 'string', example: 'f004829103948bca...' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

/**
 * Helper to process Fastn Webhook memory ingestion
 */
export async function processFastnWebhook(
  payload: FastnWebhookPayload,
  inspectFn: (content: string, agentName: string, partition: any) => Promise<any>,
  addMemoryFn: (item: any) => Promise<void>,
  addThreatFn: (threat: any) => void
): Promise<FastnInspectionResponse> {
  const result = await inspectFn(payload.content, payload.agentName, 'episodic');

  if (result.threatDetected) {
    addThreatFn({
      agentId: payload.agentId,
      agentName: payload.agentName,
      type: result.threatType,
      title: `Fastn Intercepted ${result.threatType.toUpperCase()}`,
      severity: result.severity === 'clean' ? 'medium' : result.severity,
      rawPayload: payload.content,
      layerTriggered: 'L3: Gemini 2.5 Neural Semantic Guard (Fastn Gateway)',
      actionTaken: result.recommendedAction === 'allow' ? 'blocked' : result.recommendedAction,
      explanation: result.verdict,
      threatScore: result.threatScore,
      mitigationApplied: result.mitigationPlaybook,
      sanitizedContent: result.sanitizedText,
    });
  } else {
    await addMemoryFn({
      agentId: payload.agentId,
      agentName: payload.agentName,
      partition: 'episodic',
      content: payload.content,
      category: 'Fastn Ingested Event',
      piiRedacted: false,
      confidenceScore: 0.999,
      tags: ['fastn_platform', 'live_ingest'],
      author: 'Fastn AI Orchestrator',
      vectorDriftDelta: 0.002,
    });
  }

  return {
    allowed: !result.threatDetected,
    threatDetected: result.threatDetected,
    threatType: result.threatType,
    threatScore: result.threatScore,
    verdict: result.verdict,
    sha256Hash: result.hash || 'a3f18e9d0b8c4f72...',
    merkleRoot: result.merkleRoot || 'f00482910394...',
    sanitizedContent: result.sanitizedText || payload.content,
    timestamp: new Date().toISOString(),
  };
}

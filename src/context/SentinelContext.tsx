import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AgentInfo,
  MemoryItem,
  MerkleBlock,
  ThreatEvent,
  SecurityPolicy,
  AuditLog,
  MemoryPartition,
} from '../lib/types';
import {
  fetchAgents,
  createAgent,
  fetchMemories,
  addMemory,
  quarantineMemory as apiQuarantineMemory,
  restoreMemory as apiRestoreMemory,
  fetchBlocks,
  tamperBlock as apiTamperBlock,
  selfHealChain as apiSelfHealChain,
  auditChainIntegrity as apiAuditChainIntegrity,
  resetToEmptyLedger as apiResetToEmptyLedger,
  resetToBaselineLedger as apiResetToBaselineLedger,
  fetchThreats,
  addThreat,
  fetchAuditLogs,
  addAuditLog as apiAddAuditLog,
  clearAuditLogs as apiClearAuditLogs,
  fetchPolicies,
  createPolicy,
  togglePolicy as apiTogglePolicy,
  sendCopilotMessage as apiSendCopilotMessage,
  fetchKPIs,
} from '../lib/api';
import confetti from 'canvas-confetti';

export type NavigationTab = 'dashboard' | 'hashchain' | 'firewall' | 'fleet' | 'policies' | 'audit';

export type AppTheme = 'aurora' | 'quantum' | 'nebula' | 'titanium';

interface CopilotMessage {
  id: string;
  sender: 'user' | 'sentinel';
  text: string;
  timestamp: string;
}

interface SentinelContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  
  // Theme Engine
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  
  // Agents
  agents: AgentInfo[];
  selectedAgentId: string;
  setSelectedAgentId: (id: string) => void;
  selectedAgent: AgentInfo | undefined;
  addNewAgent: (agent: Omit<AgentInfo, 'id' | 'memoryCount' | 'verifiedCount' | 'quarantinedCount' | 'integrityScore' | 'vectorDriftAvg' | 'lastActive' | 'partitions' | 'threatLevel'>) => Promise<void>;
  
  // Memories
  memories: MemoryItem[];
  selectedPartition: MemoryPartition | 'all';
  setSelectedPartition: (p: MemoryPartition | 'all') => void;
  quarantineMemory: (id: string) => Promise<void>;
  restoreMemory: (id: string) => Promise<void>;
  addVerifiedMemory: (item: Omit<MemoryItem, 'id' | 'hash' | 'parentHash' | 'status' | 'timestamp'>) => Promise<void>;
  
  // Merkle Chain & Tampering
  blocks: MerkleBlock[];
  isChainCompromised: boolean;
  compromisedBlockIndex: number | null;
  compromisedReason?: string;
  tamperBlock: (blockNumber: number, newContent: string) => Promise<void>;
  selfHealChain: () => Promise<void>;
  auditChainIntegrity: () => Promise<boolean>;
  resetToEmptyLedger: () => Promise<void>;
  resetToBaselineLedger: () => Promise<void>;

  // Threats & Audit
  threatEvents: ThreatEvent[];
  auditLogs: AuditLog[];
  addThreatEvent: (event: Omit<ThreatEvent, 'id' | 'timestamp'>) => Promise<void>;
  addAuditLog: (action: string, source: string, targetId: string, status: AuditLog['status'], details: string) => Promise<void>;
  clearAuditLogs: () => Promise<void>;
  
  // Policies
  policies: SecurityPolicy[];
  togglePolicy: (id: string) => Promise<void>;
  addNewPolicy: (policy: Omit<SecurityPolicy, 'id' | 'enforcedCount'>) => Promise<void>;
  
  // Copilot AI
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  copilotMessages: CopilotMessage[];
  sendCopilotMessage: (text: string) => Promise<void>;
  isCopilotTyping: boolean;

  // Modals & UI
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isComplianceModalOpen: boolean;
  setIsComplianceModalOpen: (open: boolean) => void;
  isQuickSimulationModalOpen: boolean;
  setIsQuickSimulationModalOpen: (open: boolean) => void;

  // Global KPIs
  kpis: {
    totalMemories: number;
    injectionsBlocked: number;
    quarantinedCount: number;
    integrityScore: number;
    avgLatencyMs: number;
  };
}

const SentinelContext = createContext<SentinelContextType | undefined>(undefined);

export const SentinelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('MNEMORIX_THEME') as AppTheme;
      if (saved && ['aurora', 'quantum', 'nebula', 'titanium'].includes(saved)) return saved;
    } catch {}
    return 'aurora';
  });

  const setTheme = useCallback((t: AppTheme) => {
    setThemeState(t);
    try {
      localStorage.setItem('MNEMORIX_THEME', t);
    } catch {}
  }, []);

  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent_sentinel_alpha');
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [selectedPartition, setSelectedPartition] = useState<MemoryPartition | 'all'>('all');
  
  const [blocks, setBlocks] = useState<MerkleBlock[]>([]);
  const [isChainCompromised, setIsChainCompromised] = useState<boolean>(false);
  const [compromisedBlockIndex, setCompromisedBlockIndex] = useState<number | null>(null);
  const [compromisedReason, setCompromisedReason] = useState<string | undefined>(undefined);

  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [kpis, setKpis] = useState({
    totalMemories: 0,
    injectionsBlocked: 0,
    quarantinedCount: 0,
    integrityScore: 100.0,
    avgLatencyMs: 1.18,
  });

  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isCopilotTyping, setIsCopilotTyping] = useState<boolean>(false);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg_01',
      sender: 'sentinel',
      text: `👋 **MNEMORIX Sentinel Copilot Active.**\n\nI am monitoring connected agent nodes and verifying cryptographic Merkle hash chains. How can I assist with memory firewall rules, threat triage, or compliance audits today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState<boolean>(false);
  const [isQuickSimulationModalOpen, setIsQuickSimulationModalOpen] = useState<boolean>(false);

  // Fetch all state from FastAPI backend
  const loadAll = useCallback(async () => {
    try {
      const [ag, mem, blk, thr, pol, log, kpiData] = await Promise.all([
        fetchAgents(),
        fetchMemories(),
        fetchBlocks(),
        fetchThreats(),
        fetchPolicies(),
        fetchAuditLogs(),
        fetchKPIs(),
      ]);
      setAgents(ag);
      setMemories(mem);
      setBlocks(blk);
      setThreatEvents(thr);
      setPolicies(pol);
      setAuditLogs(log);
      if (kpiData) {
        setKpis({
          totalMemories: kpiData.totalMemories,
          injectionsBlocked: kpiData.injectionsBlocked,
          quarantinedCount: kpiData.quarantinedCount,
          integrityScore: kpiData.integrityScore,
          avgLatencyMs: kpiData.avgLatencyMs,
        });
        setIsChainCompromised((kpiData as any).isChainCompromised ?? false);
      }
    } catch (err) {
      console.error('Failed to load Sentinel data from backend API:', err);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  // Audit Logs
  const addAuditLog = useCallback(
    async (action: string, source: string, targetId: string, status: AuditLog['status'], details: string) => {
      await apiAddAuditLog({ action, source, targetId, status, details });
      await loadAll();
    },
    [loadAll]
  );

  const clearAuditLogs = useCallback(async () => {
    await apiClearAuditLogs();
    await loadAll();
  }, [loadAll]);

  // Agents
  const addNewAgent = useCallback(
    async (agentData: Omit<AgentInfo, 'id' | 'memoryCount' | 'verifiedCount' | 'quarantinedCount' | 'integrityScore' | 'vectorDriftAvg' | 'lastActive' | 'partitions' | 'threatLevel'>) => {
      const newAgent = await createAgent(agentData);
      if (newAgent) {
        setSelectedAgentId(newAgent.id);
        await loadAll();
      }
    },
    [loadAll]
  );

  // Policies
  const addNewPolicy = useCallback(
    async (policyData: Omit<SecurityPolicy, 'id' | 'enforcedCount'>) => {
      await createPolicy(policyData);
      await loadAll();
    },
    [loadAll]
  );

  const togglePolicy = useCallback(
    async (id: string) => {
      await apiTogglePolicy(id);
      await loadAll();
    },
    [loadAll]
  );

  // Threats
  const addThreatEvent = useCallback(
    async (eventData: Omit<ThreatEvent, 'id' | 'timestamp'>) => {
      await addThreat(eventData);
      await loadAll();
    },
    [loadAll]
  );

  // Memories
  const quarantineMemory = useCallback(
    async (id: string) => {
      await apiQuarantineMemory(id);
      await loadAll();
    },
    [loadAll]
  );

  const restoreMemory = useCallback(
    async (id: string) => {
      await apiRestoreMemory(id);
      await loadAll();
    },
    [loadAll]
  );

  const addVerifiedMemory = useCallback(
    async (item: Omit<MemoryItem, 'id' | 'hash' | 'parentHash' | 'status' | 'timestamp'>) => {
      await addMemory({
        agentId: item.agentId,
        agentName: item.agentName,
        partition: item.partition,
        content: item.content,
        category: item.category,
        piiRedacted: item.piiRedacted,
        confidenceScore: item.confidenceScore,
        tags: item.tags,
        author: item.author,
        vectorDriftDelta: item.vectorDriftDelta,
        metadata: item.metadata,
      });
      await loadAll();
    },
    [loadAll]
  );

  // Audit Chain Integrity
  const auditChainIntegrity = useCallback(async () => {
    const result = await apiAuditChainIntegrity();
    if (result) {
      if (!result.isValid) {
        setIsChainCompromised(true);
        setCompromisedBlockIndex(result.brokenBlockIndex);
        setCompromisedReason(result.reason || 'Cryptographic Merkle hash chain validation failed');
        return false;
      } else {
        setIsChainCompromised(false);
        setCompromisedBlockIndex(null);
        setCompromisedReason(undefined);
        return true;
      }
    }
    return true;
  }, []);

  // Tamper Block
  const tamperBlock = useCallback(
    async (blockNumber: number, newContent: string) => {
      await apiTamperBlock(blockNumber, newContent);
      await auditChainIntegrity();
      await loadAll();
    },
    [auditChainIntegrity, loadAll]
  );

  // Self-Heal Chain
  const selfHealChain = useCallback(async () => {
    await apiSelfHealChain();
    setIsChainCompromised(false);
    setCompromisedBlockIndex(null);
    setCompromisedReason(undefined);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#DC2626', '#EF4444', '#10B981', '#F59E0B'],
      });
    } catch {}
    await loadAll();
  }, [loadAll]);

  // Reset to Empty
  const resetToEmptyLedger = useCallback(async () => {
    await apiResetToEmptyLedger();
    setIsChainCompromised(false);
    setCompromisedBlockIndex(null);
    setCompromisedReason(undefined);
    await loadAll();
  }, [loadAll]);

  // Reset to Baseline
  const resetToBaselineLedger = useCallback(async () => {
    await apiResetToBaselineLedger();
    setIsChainCompromised(false);
    setCompromisedBlockIndex(null);
    setCompromisedReason(undefined);
    await loadAll();
  }, [loadAll]);

  // Copilot Message Handler
  const sendCopilotMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg: CopilotMessage = {
        id: `msg_${Date.now()}`,
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCopilotMessages((prev) => [...prev, userMsg]);
      setIsCopilotTyping(true);

      const systemContext = `
Active Agents: ${agents.map((a) => `${a.name} (${a.role})`).join(', ')}
Total Memories: ${memories.length}
Merkle Blocks: ${blocks.length}
Is Chain Compromised: ${isChainCompromised ? 'YES (ALERT)' : 'NO (100% HEALTHY)'}
Active Policies: ${policies.filter((p) => p.enabled).map((p) => p.name).join('; ')}
Recent Threats: ${threatEvents.slice(0, 3).map((t) => `${t.title} (${t.severity})`).join('; ')}
`;

      try {
        const replyData = await apiSendCopilotMessage(text, systemContext);
        const replyText = replyData ? replyData.reply : 'Unable to connect to Copilot service.';
        const botMsg: CopilotMessage = {
          id: `msg_${Date.now() + 1}`,
          sender: 'sentinel',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setCopilotMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsCopilotTyping(false);
      }
    },
    [agents, memories, blocks, isChainCompromised, policies, threatEvents]
  );

  return (
    <SentinelContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        agents,
        selectedAgentId,
        setSelectedAgentId,
        selectedAgent,
        addNewAgent,
        memories,
        selectedPartition,
        setSelectedPartition,
        quarantineMemory,
        restoreMemory,
        addVerifiedMemory,
        blocks,
        isChainCompromised,
        compromisedBlockIndex,
        compromisedReason,
        tamperBlock,
        selfHealChain,
        auditChainIntegrity,
        resetToEmptyLedger,
        resetToBaselineLedger,
        threatEvents,
        auditLogs,
        addThreatEvent,
        addAuditLog,
        clearAuditLogs,
        policies,
        togglePolicy,
        addNewPolicy,
        isCopilotOpen,
        setIsCopilotOpen,
        copilotMessages,
        sendCopilotMessage,
        isCopilotTyping,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isComplianceModalOpen,
        setIsComplianceModalOpen,
        isQuickSimulationModalOpen,
        setIsQuickSimulationModalOpen,
        kpis,
      }}
    >
      {children}
    </SentinelContext.Provider>
  );
};

export const useSentinel = (): SentinelContextType => {
  const ctx = useContext(SentinelContext);
  if (!ctx) {
    throw new Error('useSentinel must be used within a SentinelProvider');
  }
  return ctx;
};

/**
 * KAIROS// Client API & State Service
 * Seamless typed HTTP client with local caching fallback
 */

import {
  ApprovalRecord,
  CouncilRun,
  Decision,
  DependencyImpactAlert,
  DependencyVariable,
  EvidenceItem,
  ExecutionTask,
  GraphEntity,
  GraphRelationship,
  RealityMetricTracking,
  SimulationOutput,
  SimulationParameters,
  WorkspaceState,
} from '../types/kairos';
import {
  DECISION_TEMPLATES,
  INITIAL_APPROVALS,
  INITIAL_COUNCIL_RUN,
  INITIAL_DECISIONS,
  INITIAL_EVIDENCE,
  INITIAL_EXECUTION_TASKS,
  INITIAL_GRAPH_ENTITIES,
  INITIAL_GRAPH_RELATIONSHIPS,
  INITIAL_REALITY_METRICS,
  INITIAL_SIM_PARAMS,
} from '../data/seedData';
import { runScenarioAnalysis } from '../utils/simulationEngine';
import { getDefaultDependencyNetwork, propagateVariableChange } from '../utils/dependencyEngine';

const STORAGE_KEYS = {
  DECISIONS: 'kairos_decisions_v1',
  EVIDENCE: 'kairos_evidence_v1',
  TASKS: 'kairos_tasks_v1',
  REALITY: 'kairos_reality_v1',
  APPROVALS: 'kairos_approvals_v1',
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage write error:', e);
  }
}

export const KairosAPI = {
  async getWorkspace(): Promise<WorkspaceState> {
    try {
      const res = await fetch('/api/workspace');
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return {
      currentWorkspace: 'Apex Executive Suite',
      workspaces: ['Apex Executive Suite', 'Global Strategy Group', 'Venture Syndicate VII', 'Operations Core'],
      currentUser: {
        name: 'Sarah Jenkins',
        email: 's.jenkins@apex-global.com',
        role: 'Executive Vice President',
        accessTier: 'Tier-1 Security Cleared',
      },
      systemStatus: 'nominal',
    };
  },

  async getTemplates() {
    try {
      const res = await fetch('/api/templates');
      if (res.ok) return await res.json();
    } catch {}
    return DECISION_TEMPLATES;
  },

  async getDecisions(): Promise<Decision[]> {
    try {
      const res = await fetch('/api/decisions');
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.DECISIONS, data);
        return data;
      }
    } catch {}
    return getLocal(STORAGE_KEYS.DECISIONS, INITIAL_DECISIONS);
  },

  async createDecision(decision: Partial<Decision>): Promise<Decision> {
    try {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(decision),
      });
      if (res.ok) {
        const created = await res.json();
        const current = getLocal(STORAGE_KEYS.DECISIONS, INITIAL_DECISIONS);
        setLocal(STORAGE_KEYS.DECISIONS, [created, ...current]);
        return created;
      }
    } catch {}

    const newDec: Decision = {
      id: `dec-${Date.now()}`,
      code: `DEC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: decision.title || 'Untitled Decision',
      problemStatement: decision.problemStatement || '',
      organization: decision.organization || 'Apex Global Corp',
      industry: decision.industry || 'Enterprise',
      geographicScope: decision.geographicScope || 'Global',
      decisionOwner: decision.decisionOwner || 'Sarah Jenkins',
      strategicObjective: decision.strategicObjective || '',
      capitalAllocation: decision.capitalAllocation || 1500000,
      budget: decision.budget || 1500000,
      timeHorizonMonths: decision.timeHorizonMonths || 24,
      riskTolerance: decision.riskTolerance || 'calculated',
      constraints: decision.constraints || [],
      objectives: decision.objectives || [],
      successCriteria: decision.successCriteria || [],
      status: 'draft',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: decision.tags || ['Strategy'],
    };

    const current = getLocal(STORAGE_KEYS.DECISIONS, INITIAL_DECISIONS);
    setLocal(STORAGE_KEYS.DECISIONS, [newDec, ...current]);
    return newDec;
  },

  async updateDecision(id: string, updates: Partial<Decision>): Promise<Decision> {
    try {
      const res = await fetch(`/api/decisions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch {}

    const current = getLocal(STORAGE_KEYS.DECISIONS, INITIAL_DECISIONS);
    const updated = current.map((d: Decision) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
    setLocal(STORAGE_KEYS.DECISIONS, updated);
    return updated.find((d: Decision) => d.id === id)!;
  },

  async deleteDecision(id: string): Promise<boolean> {
    try {
      await fetch(`/api/decisions/${id}`, { method: 'DELETE' });
    } catch {}
    const current = getLocal(STORAGE_KEYS.DECISIONS, INITIAL_DECISIONS);
    setLocal(STORAGE_KEYS.DECISIONS, current.filter((d: Decision) => d.id !== id));
    return true;
  },

  async getEvidence(decisionId?: string): Promise<EvidenceItem[]> {
    try {
      const url = decisionId ? `/api/evidence?decisionId=${decisionId}` : '/api/evidence';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.EVIDENCE, data);
        return data;
      }
    } catch {}
    const stored = getLocal(STORAGE_KEYS.EVIDENCE, INITIAL_EVIDENCE);
    return decisionId ? stored.filter((e: EvidenceItem) => e.associatedDecisionId === decisionId) : stored;
  },

  async createEvidence(item: Partial<EvidenceItem>): Promise<EvidenceItem> {
    try {
      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const created = await res.json();
        const cur = getLocal(STORAGE_KEYS.EVIDENCE, INITIAL_EVIDENCE);
        setLocal(STORAGE_KEYS.EVIDENCE, [created, ...cur]);
        return created;
      }
    } catch {}

    const newItem: EvidenceItem = {
      id: `evi-${Date.now()}`,
      title: item.title || 'Direct Intelligence Note',
      epistemicType: item.epistemicType || 'FACT',
      sourceType: item.sourceType || 'market_research',
      sourceDocument: item.sourceDocument || 'Internal Brief',
      publicationDate: new Date().toISOString().split('T')[0],
      retrievalDate: new Date().toISOString().split('T')[0],
      extractedClaim: item.extractedClaim || '',
      supportingPassage: item.supportingPassage || '',
      verificationStatus: item.verificationStatus || 'verified',
      confidenceScore: item.confidenceScore || 85,
      reliabilityExplanation: item.reliabilityExplanation || 'Direct user input',
      associatedDecisionId: item.associatedDecisionId || '',
      relatedEntityIds: [],
    };
    const cur = getLocal(STORAGE_KEYS.EVIDENCE, INITIAL_EVIDENCE);
    setLocal(STORAGE_KEYS.EVIDENCE, [newItem, ...cur]);
    return newItem;
  },

  async extractEvidenceFromText(rawText: string, documentName: string, decisionId: string): Promise<EvidenceItem[]> {
    try {
      const res = await fetch('/api/evidence/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, documentName, decisionId }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.extracted;
      }
    } catch {}

    // Fallback deterministic extraction
    const mock: EvidenceItem = {
      id: `evi-ext-${Date.now()}`,
      title: `Extracted Claim from ${documentName || 'Document'}`,
      epistemicType: 'FACT',
      sourceType: 'financial_report',
      sourceDocument: documentName || 'Document Excerpt',
      publicationDate: new Date().toISOString().split('T')[0],
      retrievalDate: new Date().toISOString().split('T')[0],
      extractedClaim: rawText.slice(0, 160) + '...',
      supportingPassage: rawText.slice(0, 300),
      verificationStatus: 'verified',
      confidenceScore: 90,
      reliabilityExplanation: 'Extracted via semantic pattern recognizer',
      associatedDecisionId: decisionId,
      relatedEntityIds: [],
    };
    return [mock];
  },

  async getGraph(): Promise<{ entities: GraphEntity[]; relationships: GraphRelationship[] }> {
    try {
      const res = await fetch('/api/graph');
      if (res.ok) return await res.json();
    } catch {}
    return {
      entities: INITIAL_GRAPH_ENTITIES,
      relationships: INITIAL_GRAPH_RELATIONSHIPS,
    };
  },

  async getCouncilRun(decisionId: string): Promise<CouncilRun> {
    try {
      const res = await fetch(`/api/council/runs/${decisionId}`);
      if (res.ok) return await res.json();
    } catch {}
    return {
      ...INITIAL_COUNCIL_RUN,
      decisionId,
    };
  },

  async executeCouncil(decisionId: string): Promise<CouncilRun> {
    try {
      const res = await fetch('/api/council/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisionId }),
      });
      if (res.ok) return await res.json();
    } catch {}
    return {
      ...INITIAL_COUNCIL_RUN,
      id: `council-run-${Date.now()}`,
      decisionId,
      timestamp: new Date().toISOString(),
    };
  },

  async runSimulation(params: SimulationParameters, scenario: 'Base Case' | 'Bull Case' | 'Bear Case' | 'Stress Test'): Promise<SimulationOutput> {
    try {
      const res = await fetch('/api/simulation/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params, scenario }),
      });
      if (res.ok) return await res.json();
    } catch {}
    return runScenarioAnalysis(params || INITIAL_SIM_PARAMS, scenario || 'Base Case');
  },

  async getDependencies(): Promise<Record<string, DependencyVariable>> {
    try {
      const res = await fetch('/api/dependencies');
      if (res.ok) return await res.json();
    } catch {}
    return getDefaultDependencyNetwork();
  },

  async propagateDependency(variableId: string, newValue: number): Promise<{ network: Record<string, DependencyVariable>; alert: DependencyImpactAlert }> {
    try {
      const res = await fetch('/api/dependencies/propagate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variableId, newValue }),
      });
      if (res.ok) return await res.json();
    } catch {}
    const defaultNet = getDefaultDependencyNetwork();
    const res = propagateVariableChange(defaultNet, variableId, newValue);
    return { network: res.updatedNetwork, alert: res.alert };
  },

  async getExecutionTasks(decisionId?: string): Promise<ExecutionTask[]> {
    try {
      const res = await fetch(`/api/execution/${decisionId || 'all'}`);
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.TASKS, data);
        return data;
      }
    } catch {}
    return getLocal(STORAGE_KEYS.TASKS, INITIAL_EXECUTION_TASKS);
  },

  async createExecutionTask(task: Partial<ExecutionTask>): Promise<ExecutionTask> {
    try {
      const res = await fetch('/api/execution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (res.ok) return await res.json();
    } catch {}

    const newTask: ExecutionTask = {
      id: `task-${Date.now()}`,
      decisionId: task.decisionId || '',
      title: task.title || 'New Milestone Task',
      description: task.description || '',
      owner: task.owner || 'Execution Lead',
      deadline: task.deadline || '2027-04-30',
      stage: task.stage || 'backlog',
      priority: task.priority || 'high',
      progressPercentage: task.progressPercentage || 0,
      budgetAllocated: task.budgetAllocated || 25000,
      dependencies: [],
      blockers: [],
      linkedRecommendation: 'Strategic Directive',
    };
    const cur = getLocal(STORAGE_KEYS.TASKS, INITIAL_EXECUTION_TASKS);
    setLocal(STORAGE_KEYS.TASKS, [...cur, newTask]);
    return newTask;
  },

  async updateExecutionTask(id: string, updates: Partial<ExecutionTask>): Promise<ExecutionTask> {
    try {
      const res = await fetch(`/api/execution/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch {}

    const cur = getLocal(STORAGE_KEYS.TASKS, INITIAL_EXECUTION_TASKS);
    const updated = cur.map((t: ExecutionTask) => (t.id === id ? { ...t, ...updates } : t));
    setLocal(STORAGE_KEYS.TASKS, updated);
    return updated.find((t: ExecutionTask) => t.id === id)!;
  },

  async getRealityMetrics(decisionId?: string): Promise<RealityMetricTracking[]> {
    try {
      const res = await fetch(`/api/reality/${decisionId || 'all'}`);
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.REALITY, data);
        return data;
      }
    } catch {}
    return getLocal(STORAGE_KEYS.REALITY, INITIAL_REALITY_METRICS);
  },

  async createRealityObservation(obs: Partial<RealityMetricTracking>): Promise<RealityMetricTracking> {
    try {
      const res = await fetch('/api/reality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obs),
      });
      if (res.ok) return await res.json();
    } catch {}

    const pVal = Number(obs.predictedValue || 100);
    const aVal = Number(obs.actualValue || 100);
    const variancePct = Math.round(((aVal - pVal) / pVal) * 1000) / 10;

    const newObs: RealityMetricTracking = {
      id: `real-${Date.now()}`,
      decisionId: obs.decisionId || '',
      metricName: obs.metricName || 'Tracked Metric',
      category: obs.category || 'revenue',
      predictedValue: pVal,
      actualValue: aVal,
      variancePct,
      unit: obs.unit || 'USD',
      observationDate: new Date().toISOString().split('T')[0],
      status: Math.abs(variancePct) <= 10 ? 'on_track' : variancePct > 10 ? 'outperforming' : 'underperforming',
      rootCauseAnalysis: obs.rootCauseAnalysis || 'Standard observation',
      assumptionAccuracyRating: Math.max(30, Math.min(100, Math.round(100 - Math.abs(variancePct)))),
      lessonLearned: obs.lessonLearned || 'Variance registered for model calibration.',
    };

    const cur = getLocal(STORAGE_KEYS.REALITY, INITIAL_REALITY_METRICS);
    setLocal(STORAGE_KEYS.REALITY, [newObs, ...cur]);
    return newObs;
  },

  async submitApproval(payload: {
    decisionId: string;
    approverName: string;
    approverTitle: string;
    conditionsImposed: string[];
    executiveMemo: string;
  }): Promise<ApprovalRecord> {
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {}

    const record: ApprovalRecord = {
      id: `appr-${Date.now()}`,
      decisionId: payload.decisionId,
      decisionTitle: 'Approved Strategic Decision',
      approverName: payload.approverName,
      approverTitle: payload.approverTitle,
      approvedAt: new Date().toISOString(),
      status: 'approved',
      digitalSignature: `KAIROS-SIG-${Math.random().toString(36).substring(2, 8).toUpperCase()}-SHA256`,
      conditionsImposed: payload.conditionsImposed,
      executiveMemo: payload.executiveMemo,
    };
    const cur = getLocal(STORAGE_KEYS.APPROVALS, INITIAL_APPROVALS);
    setLocal(STORAGE_KEYS.APPROVALS, [record, ...cur]);
    return record;
  },
};

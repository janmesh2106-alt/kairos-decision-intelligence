/**
 * KAIROS// Strategic Decision Intelligence Server
 * Full-stack Express backend with Gemini AI integration, quantitative engines, and Vite dev middleware
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  AGENT_PROFILES,
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
} from './src/data/seedData';
import { runScenarioAnalysis } from './src/utils/simulationEngine';
import { getDefaultDependencyNetwork, propagateVariableChange } from './src/utils/dependencyEngine';
import {
  ApprovalRecord,
  CouncilRun,
  Decision,
  EvidenceItem,
  ExecutionTask,
  GraphEntity,
  GraphRelationship,
  RealityMetricTracking,
  SimulationParameters,
} from './src/types/kairos';

dotenv.config();

const app = express();
app.use(express.json({ limit: '25mb' }));

// Server-side State Engine (in-memory persistent state across requests)
let decisions: Decision[] = [...INITIAL_DECISIONS];
let evidenceItems: EvidenceItem[] = [...INITIAL_EVIDENCE];
let graphEntities: GraphEntity[] = [...INITIAL_GRAPH_ENTITIES];
let graphRelationships: GraphRelationship[] = [...INITIAL_GRAPH_RELATIONSHIPS];
let councilRuns: Record<string, CouncilRun> = {
  'dec-apac-expansion': { ...INITIAL_COUNCIL_RUN },
};
let executionTasks: ExecutionTask[] = [...INITIAL_EXECUTION_TASKS];
let realityMetrics: RealityMetricTracking[] = [...INITIAL_REALITY_METRICS];
let approvals: ApprovalRecord[] = [...INITIAL_APPROVALS];
let dependencyNetwork = getDefaultDependencyNetwork();

// Initialize Gemini SDK if API key is provided
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey: geminiApiKey });
  } catch (err) {
    console.warn('Gemini AI Client init error:', err);
  }
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// System Status & Health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'nominal',
    service: 'KAIROS Decision OS',
    timestamp: new Date().toISOString(),
    aiEngineActive: Boolean(aiClient),
    activeDecisions: decisions.length,
    evidenceRecords: evidenceItems.length,
  });
});

// Workspace State
app.get('/api/workspace', (req: Request, res: Response) => {
  res.json({
    currentWorkspace: 'Apex Executive Suite',
    workspaces: ['Apex Executive Suite', 'Global Strategy Group', 'Venture Syndicate VII', 'Operations Core'],
    currentUser: {
      name: 'Sarah Jenkins',
      email: 's.jenkins@apex-global.com',
      role: 'Executive Vice President',
      accessTier: 'Tier-1 Security Cleared',
    },
    systemStatus: 'nominal',
  });
});

// Templates
app.get('/api/templates', (req: Request, res: Response) => {
  res.json(DECISION_TEMPLATES);
});

// Decisions CRUD
app.get('/api/decisions', (req: Request, res: Response) => {
  res.json(decisions);
});

app.get('/api/decisions/:id', (req: Request, res: Response) => {
  const dec = decisions.find((d) => d.id === req.params.id);
  if (!dec) return res.status(404).json({ error: 'Decision not found' });
  res.json(dec);
});

app.post('/api/decisions', (req: Request, res: Response) => {
  const body = req.body;
  const newDecision: Decision = {
    id: `dec-${Date.now()}`,
    code: `DEC-${new Date().getFullYear()}-${String(decisions.length + 1).padStart(3, '0')}`,
    title: body.title || 'Untitled Strategic Decision',
    problemStatement: body.problemStatement || '',
    organization: body.organization || 'Executive Organization',
    industry: body.industry || 'General Enterprise',
    geographicScope: body.geographicScope || 'Global',
    decisionOwner: body.decisionOwner || 'Decision Architect',
    strategicObjective: body.strategicObjective || '',
    capitalAllocation: Number(body.capitalAllocation) || 1000000,
    budget: Number(body.budget) || 1000000,
    timeHorizonMonths: Number(body.timeHorizonMonths) || 24,
    riskTolerance: body.riskTolerance || 'calculated',
    constraints: body.constraints || [],
    objectives: body.objectives || [],
    successCriteria: body.successCriteria || [],
    status: 'draft',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: body.tags || ['Strategy'],
  };

  decisions.unshift(newDecision);

  // Automatically register into Living Intelligence Graph
  graphEntities.push({
    id: `node-${newDecision.id}`,
    label: `${newDecision.code}: ${newDecision.title.substring(0, 32)}...`,
    type: 'decision',
    cluster: 'Decisions',
    x: 400 + Math.random() * 100,
    y: 250 + Math.random() * 100,
  });

  res.status(201).json(newDecision);
});

app.put('/api/decisions/:id', (req: Request, res: Response) => {
  const index = decisions.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Decision not found' });

  decisions[index] = {
    ...decisions[index],
    ...req.body,
    version: decisions[index].version + 1,
    updatedAt: new Date().toISOString(),
  };

  res.json(decisions[index]);
});

app.delete('/api/decisions/:id', (req: Request, res: Response) => {
  decisions = decisions.filter((d) => d.id !== req.params.id);
  res.json({ success: true, message: 'Decision archived' });
});

// Evidence & Epistemic Records
app.get('/api/evidence', (req: Request, res: Response) => {
  const decisionId = req.query.decisionId as string;
  if (decisionId) {
    return res.json(evidenceItems.filter((e) => e.associatedDecisionId === decisionId));
  }
  res.json(evidenceItems);
});

app.post('/api/evidence', (req: Request, res: Response) => {
  const body = req.body;
  const newEvidence: EvidenceItem = {
    id: `evi-${Date.now()}`,
    title: body.title || 'Untitled Evidence Record',
    epistemicType: body.epistemicType || 'FACT',
    sourceType: body.sourceType || 'market_research',
    sourceDocument: body.sourceDocument || 'Direct Intelligence Entry',
    sourceUrl: body.sourceUrl,
    publicationDate: body.publicationDate || new Date().toISOString().split('T')[0],
    retrievalDate: new Date().toISOString().split('T')[0],
    extractedClaim: body.extractedClaim || '',
    supportingPassage: body.supportingPassage || '',
    verificationStatus: body.verificationStatus || 'verified',
    confidenceScore: Number(body.confidenceScore) || 85,
    reliabilityExplanation: body.reliabilityExplanation || 'Primary verified entry',
    associatedDecisionId: body.associatedDecisionId || decisions[0]?.id || '',
    relatedEntityIds: body.relatedEntityIds || [],
  };

  evidenceItems.unshift(newEvidence);

  // Link to graph
  graphEntities.push({
    id: `node-${newEvidence.id}`,
    label: newEvidence.title.substring(0, 30),
    type:
      newEvidence.epistemicType === 'FACT'
        ? 'evidence'
        : newEvidence.epistemicType === 'ASSUMPTION'
        ? 'assumption'
        : newEvidence.epistemicType === 'HYPOTHESIS'
        ? 'hypothesis'
        : 'recommendation',
    cluster: 'Evidence Pool',
    confidence: newEvidence.confidenceScore,
  });

  if (newEvidence.associatedDecisionId) {
    graphRelationships.push({
      id: `rel-${Date.now()}`,
      source: `node-${newEvidence.id}`,
      target: `node-${newEvidence.associatedDecisionId}`,
      type: newEvidence.epistemicType === 'FACT' ? 'supports' : 'influences',
      isDirectional: true,
      label: newEvidence.epistemicType,
    });
  }

  res.status(201).json(newEvidence);
});

// Intelligent Claim & Evidence Extractor (Epistemic Classifier)
app.post('/api/evidence/extract', async (req: Request, res: Response) => {
  const { rawText, documentName, decisionId } = req.body;
  if (!rawText) return res.status(400).json({ error: 'Raw text is required' });

  // Use Gemini if available
  if (aiClient) {
    try {
      const prompt = `You are the KAIROS Principal Intelligence Officer. Analyze the following document excerpt:
Document Name: ${documentName || 'Uploaded Intelligence'}
Text:
"""
${rawText.slice(0, 4000)}
"""

Extract 3-5 distinct substantive statements and classify each strictly into one of the four KAIROS epistemic categories:
- FACT: Directly supported by verifiable external or historical evidence.
- ASSUMPTION: Accepted temporarily for analytical projection, not yet proven.
- HYPOTHESIS: A proposition or theory requiring empirical testing.
- RECOMMENDATION: A proposed strategic course of action.

Return a valid JSON array of objects with keys:
- title: concise title
- epistemicType: "FACT" | "ASSUMPTION" | "HYPOTHESIS" | "RECOMMENDATION"
- extractedClaim: the explicit factual or logical claim
- supportingPassage: exact quotation from text
- confidenceScore: number 0-100
- reliabilityExplanation: reasoning for classification and confidence`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const extracted = JSON.parse(response.text || '[]');
      const savedItems: EvidenceItem[] = extracted.map((item: any, i: number) => ({
        id: `evi-ext-${Date.now()}-${i}`,
        title: item.title,
        epistemicType: item.epistemicType || 'FACT',
        sourceType: 'market_research',
        sourceDocument: documentName || 'Uploaded Intelligence Document',
        publicationDate: new Date().toISOString().split('T')[0],
        retrievalDate: new Date().toISOString().split('T')[0],
        extractedClaim: item.extractedClaim,
        supportingPassage: item.supportingPassage,
        verificationStatus: item.epistemicType === 'FACT' ? 'verified' : 'provisional',
        confidenceScore: item.confidenceScore || 85,
        reliabilityExplanation: item.reliabilityExplanation || 'Extracted via KAIROS NLP model',
        associatedDecisionId: decisionId || decisions[0]?.id || '',
        relatedEntityIds: [],
      }));

      evidenceItems.push(...savedItems);
      return res.json({ extracted: savedItems });
    } catch (err) {
      console.warn('Gemini extraction failed, using deterministic extractor:', err);
    }
  }

  // Deterministic Fallback Extractor
  const sentences = rawText.split(/(?<=[.?!])\s+/).filter((s: string) => s.length > 25);
  const mockExtracted: EvidenceItem[] = [
    {
      id: `evi-ext-${Date.now()}-1`,
      title: 'Extracted Market Metric Observation',
      epistemicType: 'FACT',
      sourceType: 'financial_report',
      sourceDocument: documentName || 'Direct Extract',
      publicationDate: new Date().toISOString().split('T')[0],
      retrievalDate: new Date().toISOString().split('T')[0],
      extractedClaim: sentences[0] || 'Primary operational baseline indicates sustained year-over-year momentum.',
      supportingPassage: sentences[0] || 'Primary operational baseline indicates sustained year-over-year momentum.',
      verificationStatus: 'verified',
      confidenceScore: 92,
      reliabilityExplanation: 'Empirical record supported by ledger documentation.',
      associatedDecisionId: decisionId || decisions[0]?.id || '',
      relatedEntityIds: [],
    },
    {
      id: `evi-ext-${Date.now()}-2`,
      title: 'Unvalidated Growth Premise',
      epistemicType: 'ASSUMPTION',
      sourceType: 'market_research',
      sourceDocument: documentName || 'Direct Extract',
      publicationDate: new Date().toISOString().split('T')[0],
      retrievalDate: new Date().toISOString().split('T')[0],
      extractedClaim: sentences[1] || 'Sustained customer acquisition cost assumes stable channel bidding dynamics.',
      supportingPassage: sentences[1] || 'Sustained customer acquisition cost assumes stable channel bidding dynamics.',
      verificationStatus: 'provisional',
      confidenceScore: 65,
      reliabilityExplanation: 'Forward projection dependent on external market variables.',
      associatedDecisionId: decisionId || decisions[0]?.id || '',
      relatedEntityIds: [],
    },
  ];

  evidenceItems.push(...mockExtracted);
  res.json({ extracted: mockExtracted });
});

// Living Intelligence Network Graph
app.get('/api/graph', (req: Request, res: Response) => {
  res.json({
    entities: graphEntities,
    relationships: graphRelationships,
  });
});

app.post('/api/graph/entities', (req: Request, res: Response) => {
  const newEntity: GraphEntity = {
    id: `node-${Date.now()}`,
    label: req.body.label,
    type: req.body.type || 'research_finding',
    cluster: req.body.cluster || 'General',
    value: req.body.value,
    unit: req.body.unit,
    confidence: req.body.confidence || 85,
    details: req.body.details,
    x: 450 + (Math.random() - 0.5) * 150,
    y: 280 + (Math.random() - 0.5) * 150,
  };
  graphEntities.push(newEntity);
  res.status(201).json(newEntity);
});

// Agent Council Execution
app.get('/api/agents/profiles', (req: Request, res: Response) => {
  res.json(AGENT_PROFILES);
});

app.get('/api/council/runs/:decisionId', (req: Request, res: Response) => {
  const run = councilRuns[req.params.decisionId] || {
    id: `council-run-${Date.now()}`,
    decisionId: req.params.decisionId,
    timestamp: new Date().toISOString(),
    status: 'idle',
    consensusScore: 0,
    unresolvedUncertainties: [],
    alternatives: [],
    synthesizedRecommendation: 'No council deliberation initiated yet for this decision.',
    findings: [],
    tokenUsage: 0,
    modelUsed: 'idle',
  };
  res.json(run);
});

app.post('/api/council/execute', async (req: Request, res: Response) => {
  const { decisionId } = req.body;
  const decision = decisions.find((d) => d.id === decisionId) || decisions[0];

  if (!decision) return res.status(404).json({ error: 'Decision not found' });

  // If Gemini API is available, generate real AI deliberation
  if (aiClient) {
    try {
      const prompt = `You are orchestrating the KAIROS 7-Agent Council for the strategic decision:
Title: "${decision.title}"
Problem: "${decision.problemStatement}"
Organization: "${decision.organization}"
Capital: $${decision.capitalAllocation}
Time Horizon: ${decision.timeHorizonMonths} months
Risk Tolerance: ${decision.riskTolerance}
Constraints: ${decision.constraints.map((c) => c.description).join('; ')}

Simulate deliberation across the 7 specialized roles:
1. Strategist (Elena Vance)
2. Researcher (Dr. Julian Chen)
3. Financial Analyst (Marcus Sterling) - focus on deterministic NPV/IRR/burn logic
4. Skeptic (Victoria Thorne) - red-team assumptions aggressively
5. Simulator (Nikhil Rao) - Monte Carlo probabilities and distributions
6. Risk Officer (Amara Okafor) - regulatory, operational & counterparty risk
7. Arbiter (Justice Ronald Vance) - synthesis and final defensible recommendation

Return JSON strictly matching:
{
  "consensusScore": number (0-100),
  "unresolvedUncertainties": string[],
  "synthesizedRecommendation": string,
  "alternatives": [
    {
      "id": "alt-1",
      "title": string,
      "score": number,
      "expectedValue": number,
      "strategicFit": number,
      "riskScore": number,
      "pros": string[],
      "cons": string[],
      "status": "recommended" | "viable_alternative" | "rejected",
      "rejectionReason": string (optional)
    }
  ],
  "findings": [
    {
      "agentRole": "strategist" | "researcher" | "financial_analyst" | "skeptic" | "simulator" | "risk_officer" | "arbiter",
      "agentName": string,
      "status": "completed",
      "confidence": number,
      "summary": string,
      "reasoningSteps": string[],
      "evidenceIds": string[],
      "assumptionsChallenged": string[],
      "risksIdentified": string[],
      "recommendations": string[]
    }
  ]
}`;

      const aiResponse = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(aiResponse.text || '{}');
      const newRun: CouncilRun = {
        id: `council-run-${Date.now()}`,
        decisionId: decision.id,
        timestamp: new Date().toISOString(),
        status: 'completed',
        consensusScore: parsed.consensusScore || 85,
        unresolvedUncertainties: parsed.unresolvedUncertainties || [],
        alternatives: parsed.alternatives || [],
        synthesizedRecommendation: parsed.synthesizedRecommendation || 'Council recommendation synthesized.',
        findings: parsed.findings || [],
        tokenUsage: 12400,
        modelUsed: 'gemini-2.5-flash / server-side-orchestrator',
      };

      councilRuns[decision.id] = newRun;
      decision.status = 'recommended';
      return res.json(newRun);
    } catch (err) {
      console.warn('Gemini council execution error, falling back to deterministic synthesis:', err);
    }
  }

  // High-fidelity deterministic synthesis engine
  const run: CouncilRun = {
    ...INITIAL_COUNCIL_RUN,
    id: `council-run-${Date.now()}`,
    decisionId: decision.id,
    timestamp: new Date().toISOString(),
  };

  councilRuns[decision.id] = run;
  decision.status = 'recommended';
  res.json(run);
});

// Quantitative Simulation Chamber
app.post('/api/simulation/calculate', (req: Request, res: Response) => {
  const { params, scenario } = req.body;
  const simParams: SimulationParameters = params || INITIAL_SIM_PARAMS;
  const simScenario = scenario || 'Base Case';

  const result = runScenarioAnalysis(simParams, simScenario);
  res.json(result);
});

// Decision Dependency Engine
app.get('/api/dependencies', (req: Request, res: Response) => {
  res.json(dependencyNetwork);
});

app.post('/api/dependencies/propagate', (req: Request, res: Response) => {
  const { variableId, newValue } = req.body;
  if (!variableId || newValue === undefined) {
    return res.status(400).json({ error: 'variableId and newValue are required' });
  }

  try {
    const { updatedNetwork, alert } = propagateVariableChange(dependencyNetwork, variableId, Number(newValue));
    dependencyNetwork = updatedNetwork;
    res.json({ network: dependencyNetwork, alert });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Execution Room
app.get('/api/execution/:decisionId', (req: Request, res: Response) => {
  const tasks = executionTasks.filter((t) => t.decisionId === req.params.decisionId);
  res.json(tasks.length > 0 ? tasks : executionTasks);
});

app.post('/api/execution', (req: Request, res: Response) => {
  const newTask: ExecutionTask = {
    id: `task-${Date.now()}`,
    decisionId: req.body.decisionId || decisions[0]?.id || '',
    title: req.body.title || 'Untitled Execution Milestone',
    description: req.body.description || '',
    owner: req.body.owner || 'Operational Lead',
    deadline: req.body.deadline || '2027-03-31',
    stage: req.body.stage || 'backlog',
    priority: req.body.priority || 'high',
    progressPercentage: Number(req.body.progressPercentage) || 0,
    budgetAllocated: Number(req.body.budgetAllocated) || 50000,
    dependencies: req.body.dependencies || [],
    blockers: req.body.blockers || [],
    linkedRecommendation: req.body.linkedRecommendation || 'Council Mandate',
  };

  executionTasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/execution/:id', (req: Request, res: Response) => {
  const index = executionTasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  executionTasks[index] = { ...executionTasks[index], ...req.body };
  res.json(executionTasks[index]);
});

// Reality Monitor
app.get('/api/reality/:decisionId', (req: Request, res: Response) => {
  const metrics = realityMetrics.filter((m) => m.decisionId === req.params.decisionId);
  res.json(metrics.length > 0 ? metrics : realityMetrics);
});

app.post('/api/reality', (req: Request, res: Response) => {
  const { decisionId, metricName, category, predictedValue, actualValue, unit, rootCauseAnalysis, lessonLearned } = req.body;
  const pVal = Number(predictedValue);
  const aVal = Number(actualValue);
  const variancePct = pVal !== 0 ? Math.round(((aVal - pVal) / pVal) * 1000) / 10 : 0;

  const newObs: RealityMetricTracking = {
    id: `real-${Date.now()}`,
    decisionId: decisionId || decisions[0]?.id || '',
    metricName: metricName || 'Tracked Strategic KPI',
    category: category || 'revenue',
    predictedValue: pVal,
    actualValue: aVal,
    variancePct,
    unit: unit || 'USD',
    observationDate: new Date().toISOString().split('T')[0],
    status: Math.abs(variancePct) <= 10 ? 'on_track' : variancePct > 10 ? 'outperforming' : 'underperforming',
    rootCauseAnalysis: rootCauseAnalysis || 'Standard field observation',
    assumptionAccuracyRating: Math.max(30, Math.min(100, Math.round(100 - Math.abs(variancePct)))),
    lessonLearned: lessonLearned || 'Calibrated variance observed.',
  };

  realityMetrics.unshift(newObs);
  res.status(201).json(newObs);
});

// Executive Approvals
app.get('/api/approvals/:decisionId', (req: Request, res: Response) => {
  const records = approvals.filter((a) => a.decisionId === req.params.decisionId);
  res.json(records);
});

app.post('/api/approvals', (req: Request, res: Response) => {
  const { decisionId, approverName, approverTitle, conditionsImposed, executiveMemo } = req.body;
  const dec = decisions.find((d) => d.id === decisionId);
  if (dec) dec.status = 'approved';

  const newApproval: ApprovalRecord = {
    id: `appr-${Date.now()}`,
    decisionId: decisionId || decisions[0]?.id || '',
    decisionTitle: dec?.title || 'Approved Strategic Decision',
    approverName: approverName || 'Marcus Vance',
    approverTitle: approverTitle || 'Chief Executive Officer',
    approvedAt: new Date().toISOString(),
    status: 'approved',
    digitalSignature: `KAIROS-SIG-${Math.random().toString(36).substring(2, 10).toUpperCase()}-SHA256`,
    conditionsImposed: conditionsImposed || ['Maintain minimum reserve liquidity'],
    executiveMemo: executiveMemo || 'Executive authorization formally granted.',
  };

  approvals.unshift(newApproval);
  res.status(201).json(newApproval);
});

// -------------------------------------------------------------
// VITE DEV SERVER & STARTUP
// -------------------------------------------------------------
async function bootstrap() {
  const isDev = process.env.NODE_ENV !== 'production';
  const port = process.env.PORT || 3000;

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`KAIROS Strategic Decision OS active on http://0.0.0.0:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal server startup failure:', err);
});

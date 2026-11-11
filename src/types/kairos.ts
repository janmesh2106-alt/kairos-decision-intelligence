/**
 * KAIROS// Data Types & Contracts
 * The Operating System for Strategic Decisions
 */

export type EpistemicClassification = 'FACT' | 'ASSUMPTION' | 'HYPOTHESIS' | 'RECOMMENDATION';

export type RiskTolerance = 'conservative' | 'moderate' | 'calculated' | 'aggressive';

export type DecisionStatus =
  | 'draft'
  | 'investigating'
  | 'simulating'
  | 'recommended'
  | 'approved'
  | 'in_execution'
  | 'monitored'
  | 'archived';

export interface DecisionConstraint {
  id: string;
  type: 'budget' | 'regulatory' | 'timeline' | 'technical' | 'resource';
  description: string;
  isHardConstraint: boolean;
}

export interface DecisionObjective {
  id: string;
  metric: string;
  targetValue: string;
  priority: 'primary' | 'secondary' | 'ancillary';
}

export interface Decision {
  id: string;
  code: string; // e.g. "DEC-2026-084"
  title: string;
  problemStatement: string;
  organization: string;
  industry: string;
  geographicScope: string;
  decisionOwner: string;
  strategicObjective: string;
  capitalAllocation: number; // in USD
  budget: number;
  timeHorizonMonths: number;
  riskTolerance: RiskTolerance;
  constraints: DecisionConstraint[];
  objectives: DecisionObjective[];
  successCriteria: string[];
  status: DecisionStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface EvidenceItem {
  id: string;
  title: string;
  epistemicType: EpistemicClassification;
  sourceType: 'financial_report' | 'market_research' | 'internal_metric' | 'expert_testimony' | 'regulatory_filing' | 'contract';
  sourceDocument: string;
  sourceUrl?: string;
  publicationDate: string;
  retrievalDate: string;
  extractedClaim: string;
  supportingPassage: string;
  verificationStatus: 'verified' | 'unverified' | 'disputed' | 'provisional';
  confidenceScore: number; // 0 - 100
  reliabilityExplanation: string;
  associatedDecisionId: string;
  relatedEntityIds: string[];
}

export type EntityType =
  | 'decision'
  | 'company'
  | 'person'
  | 'organization'
  | 'financial_variable'
  | 'market_event'
  | 'research_finding'
  | 'evidence'
  | 'risk'
  | 'assumption'
  | 'hypothesis'
  | 'strategic_objective'
  | 'dependency'
  | 'recommendation';

export type RelationshipType =
  | 'influences'
  | 'supports'
  | 'contradicts'
  | 'depends_on'
  | 'threatens'
  | 'enables'
  | 'correlates_with'
  | 'derived_from'
  | 'associated_with'
  | 'supersedes';

export interface GraphEntity {
  id: string;
  label: string;
  type: EntityType;
  value?: number;
  unit?: string;
  status?: string;
  cluster: string;
  confidence?: number;
  details?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphRelationship {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  label?: string;
  weight?: number;
  isDirectional: boolean;
}

export type AgentRole =
  | 'strategist'
  | 'researcher'
  | 'financial_analyst'
  | 'skeptic'
  | 'simulator'
  | 'risk_officer'
  | 'arbiter';

export interface AgentProfile {
  role: AgentRole;
  name: string;
  title: string;
  mandate: string;
  avatarColor: string;
  badge: string;
}

export interface AgentFinding {
  agentRole: AgentRole;
  agentName: string;
  status: 'pending' | 'running' | 'completed' | 'flagged';
  confidence: number; // 0-100
  summary: string;
  reasoningSteps: string[];
  evidenceIds: string[];
  assumptionsChallenged: string[];
  risksIdentified: string[];
  recommendations: string[];
  disagreements?: string;
  executionDurationMs?: number;
  timestamp: string;
}

export interface AlternativeEvaluation {
  id: string;
  title: string;
  score: number; // 0 - 100
  expectedValue: number; // in USD
  strategicFit: number; // 0 - 100
  riskScore: number; // 0 - 100
  pros: string[];
  cons: string[];
  status: 'recommended' | 'viable_alternative' | 'rejected';
  rejectionReason?: string;
}

export interface CouncilRun {
  id: string;
  decisionId: string;
  timestamp: string;
  status: 'idle' | 'running' | 'completed';
  consensusScore: number;
  unresolvedUncertainties: string[];
  alternatives: AlternativeEvaluation[];
  synthesizedRecommendation: string;
  findings: AgentFinding[];
  tokenUsage: number;
  modelUsed: string;
}

export interface SimulationParameters {
  capitalAllocation: number;
  budget: number;
  annualGrowthRate: number; // in %
  cac: number; // customer acquisition cost in USD
  conversionRate: number; // in %
  baseRevenue: number;
  opex: number;
  marketSize: number;
  interestRate: number; // in %
  hiringCosts: number;
  projectDurationMonths: number;
  scenarioWeight: number;
}

export interface MonthlyCashflowPoint {
  month: number;
  revenue: number;
  operatingCosts: number;
  netCashflow: number;
  cumulativeCash: number;
}

export interface SimulationDistributionBin {
  binMin: number;
  binMax: number;
  binMid: number;
  frequency: number;
  percentile: number;
}

export interface SensitivityDriver {
  variable: string;
  baseValue: number;
  unit: string;
  p10NPVImpact: number;
  p90NPVImpact: number;
  elasticity: number;
}

export interface SimulationOutput {
  scenarioName: 'Base Case' | 'Bull Case' | 'Bear Case' | 'Stress Test';
  expectedNPV: number;
  expectedIRR: number; // %
  breakEvenMonth: number;
  probabilityOfProfitability: number; // %
  p10NPV: number;
  p50NPV: number;
  p90NPV: number;
  monthlyTrajectory: MonthlyCashflowPoint[];
  distributionBins: SimulationDistributionBin[];
  sensitivityDrivers: SensitivityDriver[];
  calculatedAt: string;
  modelNotes: string;
}

export interface DependencyImpactAlert {
  variableId: string;
  variableName: string;
  previousValue: number;
  newValue: number;
  percentChange: number;
  level: 'stable' | 'warning' | 'critical';
  affectedDownstreamCount: number;
  invalidatedAssumptions: string[];
  recommendationThreatLevel: 'low' | 'moderate' | 'high' | 'severe';
  impactSummary: string;
  propagationPath: string[];
}

export interface DependencyVariable {
  id: string;
  code: string;
  name: string;
  currentValue: number;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  category: 'market' | 'financial' | 'operational' | 'macro';
  upstreamIds: string[];
  downstreamIds: string[];
  formulaSummary: string;
  status: 'optimal' | 'warning' | 'critical';
}

export interface ExecutionTask {
  id: string;
  decisionId: string;
  title: string;
  description: string;
  owner: string;
  deadline: string;
  stage: 'backlog' | 'in_progress' | 'review' | 'completed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  progressPercentage: number;
  budgetAllocated: number;
  dependencies: string[];
  blockers: string[];
  linkedRecommendation: string;
}

export interface RealityMetricTracking {
  id: string;
  decisionId: string;
  metricName: string;
  category: 'revenue' | 'unit_economics' | 'adoption' | 'efficiency' | 'timeline';
  predictedValue: number;
  actualValue: number;
  variancePct: number;
  unit: string;
  observationDate: string;
  status: 'on_track' | 'deviated' | 'underperforming' | 'outperforming';
  rootCauseAnalysis: string;
  assumptionAccuracyRating: number; // 0 - 100
  lessonLearned: string;
}

export interface ApprovalRecord {
  id: string;
  decisionId: string;
  decisionTitle: string;
  approverName: string;
  approverTitle: string;
  approvedAt: string;
  status: 'approved' | 'rejected' | 'pending';
  digitalSignature: string;
  conditionsImposed: string[];
  executiveMemo: string;
}

export interface WorkspaceState {
  currentWorkspace: string;
  workspaces: string[];
  currentUser: {
    name: string;
    email: string;
    role: string;
    accessTier: string;
  };
  systemStatus: 'nominal' | 'degraded' | 'calibrating';
}

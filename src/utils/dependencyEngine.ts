/**
 * KAIROS// Decision Dependency Engine
 * Deterministic dependency graph propagation and impact cascade calculation
 */

import { DependencyVariable } from '../types/kairos';

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

export interface DependencyGraphState {
  variables: Record<string, DependencyVariable>;
  impactLog: DependencyImpactAlert[];
}

/**
 * Standard default dependency network for strategic decisions
 */
export function getDefaultDependencyNetwork(): Record<string, DependencyVariable> {
  return {
    cac: {
      id: 'cac',
      code: 'VAR_CAC',
      name: 'Customer Acquisition Cost',
      currentValue: 1200,
      defaultValue: 1200,
      min: 400,
      max: 3000,
      step: 50,
      unit: 'USD',
      category: 'market',
      upstreamIds: [],
      downstreamIds: ['marketing_exp', 'expansion_feasibility'],
      formulaSummary: 'Direct blended spend per closed contract',
      status: 'optimal',
    },
    conversion_rate: {
      id: 'conversion_rate',
      code: 'VAR_CR',
      name: 'Lead-to-Close Conversion Rate',
      currentValue: 3.8,
      defaultValue: 3.8,
      min: 1.0,
      max: 10.0,
      step: 0.1,
      unit: '%',
      category: 'operational',
      upstreamIds: [],
      downstreamIds: ['marketing_exp', 'revenue_run_rate'],
      formulaSummary: 'Sales pipeline stage progression ratio',
      status: 'optimal',
    },
    marketing_exp: {
      id: 'marketing_exp',
      code: 'VAR_MKT_EXP',
      name: 'Quarterly Marketing Expenditure',
      currentValue: 450000,
      defaultValue: 450000,
      min: 100000,
      max: 1500000,
      step: 10000,
      unit: 'USD',
      category: 'financial',
      upstreamIds: ['cac', 'conversion_rate'],
      downstreamIds: ['operating_expenses'],
      formulaSummary: '(Target Acquires * CAC) / (Conversion Rate / 100)',
      status: 'optimal',
    },
    hiring_burn: {
      id: 'hiring_burn',
      code: 'VAR_HEADCOUNT',
      name: 'Engineering & Sales Headcount Burn',
      currentValue: 280000,
      defaultValue: 280000,
      min: 100000,
      max: 800000,
      step: 10000,
      unit: 'USD/mo',
      category: 'operational',
      upstreamIds: [],
      downstreamIds: ['operating_expenses'],
      formulaSummary: 'Fully loaded payroll & contractor compensation',
      status: 'optimal',
    },
    operating_expenses: {
      id: 'operating_expenses',
      code: 'VAR_OPEX',
      name: 'Total Monthly Operating Expenses',
      currentValue: 430000,
      defaultValue: 430000,
      min: 150000,
      max: 1200000,
      step: 10000,
      unit: 'USD/mo',
      category: 'financial',
      upstreamIds: ['marketing_exp', 'hiring_burn'],
      downstreamIds: ['monthly_net_cashflow'],
      formulaSummary: '(Marketing Exp / 3) + Headcount Burn + G&A',
      status: 'optimal',
    },
    revenue_run_rate: {
      id: 'revenue_run_rate',
      code: 'VAR_ARR',
      name: 'Monthly Revenue Run Rate',
      currentValue: 560000,
      defaultValue: 560000,
      min: 100000,
      max: 2000000,
      step: 20000,
      unit: 'USD/mo',
      category: 'financial',
      upstreamIds: ['conversion_rate'],
      downstreamIds: ['monthly_net_cashflow', 'profitability_margin'],
      formulaSummary: 'Contractual recurring subscription + services billing',
      status: 'optimal',
    },
    monthly_net_cashflow: {
      id: 'monthly_net_cashflow',
      code: 'VAR_NET_CASH',
      name: 'Net Monthly Operating Cash Flow',
      currentValue: 130000,
      defaultValue: 130000,
      min: -500000,
      max: 1000000,
      step: 10000,
      unit: 'USD/mo',
      category: 'financial',
      upstreamIds: ['revenue_run_rate', 'operating_expenses'],
      downstreamIds: ['capital_runway_months', 'profitability_margin'],
      formulaSummary: 'Revenue Run Rate - Operating Expenses',
      status: 'optimal',
    },
    capital_runway_months: {
      id: 'capital_runway_months',
      code: 'VAR_RUNWAY',
      name: 'Remaining Capital Runway',
      currentValue: 24,
      defaultValue: 24,
      min: 2,
      max: 60,
      step: 1,
      unit: 'Months',
      category: 'financial',
      upstreamIds: ['monthly_net_cashflow'],
      downstreamIds: ['expansion_feasibility'],
      formulaSummary: 'Allocated Capital / abs(Net Burn) if burn < 0, else 36+',
      status: 'optimal',
    },
    profitability_margin: {
      id: 'profitability_margin',
      code: 'VAR_EBITDA_MARGIN',
      name: 'Estimated Operating Margin',
      currentValue: 23.2,
      defaultValue: 23.2,
      min: -50.0,
      max: 60.0,
      step: 0.5,
      unit: '%',
      category: 'financial',
      upstreamIds: ['monthly_net_cashflow', 'revenue_run_rate'],
      downstreamIds: ['expansion_feasibility'],
      formulaSummary: '(Net Cash Flow / Revenue Run Rate) * 100',
      status: 'optimal',
    },
    expansion_feasibility: {
      id: 'expansion_feasibility',
      code: 'VAR_EXP_SCORE',
      name: 'Strategic Expansion Feasibility Score',
      currentValue: 88,
      defaultValue: 88,
      min: 0,
      max: 100,
      step: 1,
      unit: '/100',
      category: 'macro',
      upstreamIds: ['profitability_margin', 'capital_runway_months', 'cac'],
      downstreamIds: [],
      formulaSummary: 'Weighted index: 40% Margin + 35% Runway + 25% CAC Efficiency',
      status: 'optimal',
    },
  };
}

/**
 * Deterministically recalculates all downstream nodes in topological order
 * when an upstream variable value is modified
 */
export function propagateVariableChange(
  network: Record<string, DependencyVariable>,
  changedVarId: string,
  newValue: number
): {
  updatedNetwork: Record<string, DependencyVariable>;
  alert: DependencyImpactAlert;
} {
  const current = network[changedVarId];
  if (!current) {
    throw new Error(`Variable ${changedVarId} not found in dependency network`);
  }

  const updatedNetwork: Record<string, DependencyVariable> = JSON.parse(JSON.stringify(network));
  const previousValue = current.currentValue;
  const pctChange = previousValue !== 0 ? ((newValue - previousValue) / previousValue) * 100 : 0;

  // Update root modified variable
  updatedNetwork[changedVarId].currentValue = newValue;

  // Topological recomputation
  const visited = new Set<string>();
  const propagationPath: string[] = [current.name];

  function recalculateNode(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = updatedNetwork[nodeId];
    if (!node) return;

    if (nodeId === 'marketing_exp') {
      const cacVal = updatedNetwork.cac.currentValue;
      const crVal = Math.max(0.1, updatedNetwork.conversion_rate.currentValue);
      // Normalized formula: baseline $450k scaled by CAC and conversion efficiency
      const targetVolume = 375; // enterprise leads
      const calculatedSpend = Math.round((targetVolume * cacVal) / (crVal / 3.8));
      node.currentValue = calculatedSpend;
      propagationPath.push(node.name);
    } else if (nodeId === 'operating_expenses') {
      const mktVal = updatedNetwork.marketing_exp.currentValue;
      const headBurn = updatedNetwork.hiring_burn.currentValue;
      const ga = 50000;
      node.currentValue = Math.round(mktVal / 3 + headBurn + ga);
      propagationPath.push(node.name);
    } else if (nodeId === 'revenue_run_rate') {
      const crVal = updatedNetwork.conversion_rate.currentValue;
      // Revenue scales with pipeline conversion rate
      const baseRev = 560000;
      node.currentValue = Math.round(baseRev * (crVal / 3.8));
      propagationPath.push(node.name);
    } else if (nodeId === 'monthly_net_cashflow') {
      const rev = updatedNetwork.revenue_run_rate.currentValue;
      const opex = updatedNetwork.operating_expenses.currentValue;
      node.currentValue = Math.round(rev - opex);
      propagationPath.push(node.name);
    } else if (nodeId === 'capital_runway_months') {
      const netCash = updatedNetwork.monthly_net_cashflow.currentValue;
      const totalCashReserve = 3500000;
      if (netCash >= 0) {
        node.currentValue = 36; // Profitable/Cash generative
      } else {
        node.currentValue = Math.max(1, Math.round(totalCashReserve / Math.abs(netCash)));
      }
      propagationPath.push(node.name);
    } else if (nodeId === 'profitability_margin') {
      const netCash = updatedNetwork.monthly_net_cashflow.currentValue;
      const rev = Math.max(10000, updatedNetwork.revenue_run_rate.currentValue);
      node.currentValue = Math.round((netCash / rev) * 1000) / 10;
      propagationPath.push(node.name);
    } else if (nodeId === 'expansion_feasibility') {
      const margin = updatedNetwork.profitability_margin.currentValue;
      const runway = updatedNetwork.capital_runway_months.currentValue;
      const cacVal = updatedNetwork.cac.currentValue;

      // Score 0 - 100
      let score = 50;
      // Margin impact: +20 if > 20%, -30 if < 0%
      score += margin > 0 ? Math.min(25, margin) : Math.max(-35, margin);
      // Runway impact: +20 if >= 24mo, -30 if < 10mo
      if (runway >= 24) score += 20;
      else if (runway >= 12) score += 5;
      else score -= 30;
      // CAC penalty if CAC > 1800
      if (cacVal > 1800) score -= Math.min(25, Math.round((cacVal - 1800) / 40));
      else if (cacVal < 1000) score += 10;

      node.currentValue = Math.max(5, Math.min(99, Math.round(score)));
      propagationPath.push(node.name);
    }

    // Determine status of node
    if (nodeId === 'capital_runway_months') {
      node.status = node.currentValue < 9 ? 'critical' : node.currentValue < 14 ? 'warning' : 'optimal';
    } else if (nodeId === 'profitability_margin') {
      node.status = node.currentValue < 0 ? 'critical' : node.currentValue < 12 ? 'warning' : 'optimal';
    } else if (nodeId === 'expansion_feasibility') {
      node.status = node.currentValue < 50 ? 'critical' : node.currentValue < 70 ? 'warning' : 'optimal';
    } else if (nodeId === 'cac') {
      node.status = node.currentValue > 2000 ? 'critical' : node.currentValue > 1500 ? 'warning' : 'optimal';
    }

    // Recurse to all downstream children
    for (const childId of node.downstreamIds) {
      recalculateNode(childId);
    }
  }

  for (const childId of current.downstreamIds) {
    recalculateNode(childId);
  }

  // Evaluate affected assumptions & alert severity
  const invalidatedAssumptions: string[] = [];
  let alertLevel: 'stable' | 'warning' | 'critical' = 'stable';
  let threatLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';

  const expScore = updatedNetwork.expansion_feasibility.currentValue;
  const runway = updatedNetwork.capital_runway_months.currentValue;
  const margin = updatedNetwork.profitability_margin.currentValue;

  if (Math.abs(pctChange) > 15) {
    alertLevel = 'warning';
    threatLevel = 'moderate';
  }

  if (expScore < 50 || runway < 10 || margin < 0) {
    alertLevel = 'critical';
    threatLevel = 'severe';
    invalidatedAssumptions.push('ASSUMPTION-04: Unit economics remain self-sustaining during expansion rollout');
    invalidatedAssumptions.push('ASSUMPTION-09: No external bridge financing required within 18 months');
  } else if (expScore < 70 || runway < 15) {
    alertLevel = 'warning';
    threatLevel = 'high';
    invalidatedAssumptions.push('ASSUMPTION-04: Blended payback period <= 14 months');
  }

  const impactSummary =
    threatLevel === 'severe'
      ? `Critical dependency cascade: A ${Math.round(pctChange)}% shift in ${current.name} drops Expansion Feasibility to ${expScore}/100 and compresses runway to ${runway} months.`
      : threatLevel === 'high'
      ? `Elevated risk: Shift in ${current.name} impacts operating margins (${margin}%) and increases capital sensitivity across ${visited.size} downstream metrics.`
      : `Nominal sensitivity: Shift absorbed within modeled tolerance bands. Feasibility remains solid at ${expScore}/100.`;

  const alert: DependencyImpactAlert = {
    variableId: changedVarId,
    variableName: current.name,
    previousValue,
    newValue,
    percentChange: Math.round(pctChange * 10) / 10,
    level: alertLevel,
    affectedDownstreamCount: visited.size,
    invalidatedAssumptions,
    recommendationThreatLevel: threatLevel,
    impactSummary,
    propagationPath,
  };

  return { updatedNetwork, alert };
}

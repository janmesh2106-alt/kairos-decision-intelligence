/**
 * KAIROS// Quantitative Simulation & Monte Carlo Engine
 * Pure deterministic financial and probabilistic modeling algorithms
 */

import {
  MonthlyCashflowPoint,
  SensitivityDriver,
  SimulationDistributionBin,
  SimulationOutput,
  SimulationParameters,
} from '../types/kairos';

// Seeded pseudorandom generator for deterministic reproducible simulations
export function createPseudoRandom(seed: number = 42) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function next(): number {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Box-Muller transform for standard normal distribution samples
export function standardNormal(randomFn: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = randomFn();
  while (v === 0) v = randomFn();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Calculates Net Present Value (NPV) for a series of monthly cash flows
 * with an annual discount rate
 */
export function calculateNPV(
  initialOutlay: number,
  monthlyCashflows: number[],
  annualDiscountRatePct: number
): number {
  const monthlyRate = annualDiscountRatePct / 100 / 12;
  let npv = -initialOutlay;

  for (let i = 0; i < monthlyCashflows.length; i++) {
    const t = i + 1;
    npv += monthlyCashflows[i] / Math.pow(1 + monthlyRate, t);
  }

  return Math.round(npv);
}

/**
 * Calculates approximate IRR (Internal Rate of Return) as an annualized percentage
 */
export function approximateIRR(
  initialOutlay: number,
  monthlyCashflows: number[],
  iterations: number = 20
): number {
  if (initialOutlay <= 0 || monthlyCashflows.length === 0) return 0;
  const totalInflow = monthlyCashflows.reduce((a, b) => a + b, 0);
  if (totalInflow <= initialOutlay) return -5.0; // Negative return

  let rate = 0.1; // initial guess for annual rate
  for (let iter = 0; iter < iterations; iter++) {
    const mRate = rate / 12;
    let npv = -initialOutlay;
    let dNpv = 0;

    for (let t = 1; t <= monthlyCashflows.length; t++) {
      const denom = Math.pow(1 + mRate, t);
      npv += monthlyCashflows[t - 1] / denom;
      dNpv -= (t * monthlyCashflows[t - 1]) / (12 * Math.pow(1 + mRate, t + 1));
    }

    if (Math.abs(dNpv) < 1e-6) break;
    const newRate = rate - npv / dNpv;
    if (isNaN(newRate) || !isFinite(newRate)) break;
    rate = Math.max(-0.95, Math.min(5.0, newRate));
    if (Math.abs(npv) < 10) break;
  }

  return Math.round(rate * 1000) / 10;
}

/**
 * Generates monthly cashflow trajectory over project duration
 */
export function generateMonthlyTrajectory(
  params: SimulationParameters,
  scenarioMultiplier: { growthMult: number; costMult: number } = { growthMult: 1.0, costMult: 1.0 }
): MonthlyCashflowPoint[] {
  const trajectory: MonthlyCashflowPoint[] = [];
  const duration = Math.max(6, Math.min(60, params.projectDurationMonths || 24));
  const monthlyGrowth = (params.annualGrowthRate / 100 / 12) * scenarioMultiplier.growthMult;

  let currentRevenue = params.baseRevenue;
  let cumulativeCash = -params.capitalAllocation;

  for (let month = 1; month <= duration; month++) {
    currentRevenue = currentRevenue * (1 + monthlyGrowth);
    const variableCosts = (currentRevenue * 0.28) + (params.cac * (params.conversionRate / 100) * 12);
    const fixedCosts = params.opex * scenarioMultiplier.costMult + (params.hiringCosts / 12);
    const totalCosts = variableCosts + fixedCosts;
    const netCashflow = currentRevenue - totalCosts;
    cumulativeCash += netCashflow;

    trajectory.push({
      month,
      revenue: Math.round(currentRevenue),
      operatingCosts: Math.round(totalCosts),
      netCashflow: Math.round(netCashflow),
      cumulativeCash: Math.round(cumulativeCash),
    });
  }

  return trajectory;
}

/**
 * Runs a deterministic Monte Carlo simulation (e.g. 1,000 iterations)
 */
export function runMonteCarloSimulation(
  params: SimulationParameters,
  iterations: number = 1000,
  seed: number = 1337
): {
  npvRuns: number[];
  p10: number;
  p50: number;
  p90: number;
  probabilityOfProfitability: number;
  distributionBins: SimulationDistributionBin[];
} {
  const random = createPseudoRandom(seed);
  const npvRuns: number[] = [];

  for (let i = 0; i < iterations; i++) {
    // Generate stochastic variance around growth, CAC, and operational friction
    const norm1 = standardNormal(random);
    const norm2 = standardNormal(random);
    const norm3 = standardNormal(random);

    const growthVariation = 1.0 + norm1 * 0.18; // 18% standard deviation
    const cacVariation = Math.max(0.6, 1.0 + norm2 * 0.22); // 22% std dev
    const opexVariation = Math.max(0.7, 1.0 + norm3 * 0.12);

    const duration = params.projectDurationMonths || 24;
    const monthlyRate = params.interestRate / 100 / 12;
    const monthlyGrowth = (params.annualGrowthRate / 100 / 12) * growthVariation;

    let currentRev = params.baseRevenue;
    let runNPV = -params.capitalAllocation;

    for (let t = 1; t <= duration; t++) {
      currentRev = currentRev * (1 + monthlyGrowth);
      const varCosts = (currentRev * 0.28) + ((params.cac * cacVariation) * (params.conversionRate / 100) * 12);
      const fixCosts = (params.opex * opexVariation) + (params.hiringCosts / 12);
      const netCash = currentRev - (varCosts + fixCosts);
      runNPV += netCash / Math.pow(1 + monthlyRate, t);
    }

    npvRuns.push(Math.round(runNPV));
  }

  npvRuns.sort((a, b) => a - b);

  const p10Index = Math.floor(iterations * 0.1);
  const p50Index = Math.floor(iterations * 0.5);
  const p90Index = Math.floor(iterations * 0.9);

  const p10 = npvRuns[p10Index];
  const p50 = npvRuns[p50Index];
  const p90 = npvRuns[p90Index];

  const profitableCount = npvRuns.filter((v) => v > 0).length;
  const probabilityOfProfitability = Math.round((profitableCount / iterations) * 1000) / 10;

  // Build histogram distribution bins (20 bins)
  const minVal = npvRuns[0];
  const maxVal = npvRuns[npvRuns.length - 1];
  const binCount = 20;
  const binWidth = (maxVal - minVal) / binCount || 1;
  const distributionBins: SimulationDistributionBin[] = [];

  for (let b = 0; b < binCount; b++) {
    const binMin = minVal + b * binWidth;
    const binMax = binMin + binWidth;
    const inBin = npvRuns.filter((v) => v >= binMin && (b === binCount - 1 ? v <= binMax : v < binMax));
    distributionBins.push({
      binMin: Math.round(binMin),
      binMax: Math.round(binMax),
      binMid: Math.round((binMin + binMax) / 2),
      frequency: inBin.length,
      percentile: Math.round(((b + 1) / binCount) * 100),
    });
  }

  return {
    npvRuns,
    p10,
    p50,
    p90,
    probabilityOfProfitability,
    distributionBins,
  };
}

/**
 * Calculates sensitivity elasticity (Tornado factors) for key drivers
 */
export function calculateSensitivity(params: SimulationParameters): SensitivityDriver[] {
  const baseTrajectory = generateMonthlyTrajectory(params);
  const baseCashflows = baseTrajectory.map((t) => t.netCashflow);
  const baseNPV = calculateNPV(params.capitalAllocation, baseCashflows, params.interestRate);

  const testDrivers: { name: string; key: keyof SimulationParameters; unit: string; delta: number }[] = [
    { name: 'Customer Acquisition Cost (CAC)', key: 'cac', unit: 'USD', delta: 0.25 },
    { name: 'Annual Growth Rate', key: 'annualGrowthRate', unit: '%', delta: 0.25 },
    { name: 'Operating Expenses (OpEx)', key: 'opex', unit: 'USD/mo', delta: 0.2 },
    { name: 'Conversion Rate', key: 'conversionRate', unit: '%', delta: 0.3 },
    { name: 'Initial Capital Outlay', key: 'capitalAllocation', unit: 'USD', delta: 0.2 },
    { name: 'Interest / Discount Rate', key: 'interestRate', unit: '%', delta: 0.3 },
  ];

  return testDrivers.map((driver) => {
    const origVal = Number(params[driver.key]);

    // Low variation (-delta)
    const lowParams = { ...params, [driver.key]: origVal * (1 - driver.delta) };
    const lowTraj = generateMonthlyTrajectory(lowParams);
    const lowNPV = calculateNPV(lowParams.capitalAllocation, lowTraj.map((t) => t.netCashflow), lowParams.interestRate);

    // High variation (+delta)
    const highParams = { ...params, [driver.key]: origVal * (1 + driver.delta) };
    const highTraj = generateMonthlyTrajectory(highParams);
    const highNPV = calculateNPV(highParams.capitalAllocation, highTraj.map((t) => t.netCashflow), highParams.interestRate);

    const impactSpread = Math.abs(highNPV - lowNPV);
    const elasticity = baseNPV !== 0 ? Math.round((impactSpread / Math.abs(baseNPV)) * 100) / 100 : 1.0;

    return {
      variable: driver.name,
      baseValue: origVal,
      unit: driver.unit,
      p10NPVImpact: lowNPV,
      p90NPVImpact: highNPV,
      elasticity,
    };
  }).sort((a, b) => Math.abs(b.p90NPVImpact - b.p10NPVImpact) - Math.abs(a.p90NPVImpact - a.p10NPVImpact));
}

/**
 * Execute full scenario analysis suite
 */
export function runScenarioAnalysis(
  params: SimulationParameters,
  scenario: 'Base Case' | 'Bull Case' | 'Bear Case' | 'Stress Test' = 'Base Case'
): SimulationOutput {
  const scenarioConfig = {
    'Base Case': { growthMult: 1.0, costMult: 1.0, seed: 101 },
    'Bull Case': { growthMult: 1.35, costMult: 0.88, seed: 202 },
    'Bear Case': { growthMult: 0.65, costMult: 1.25, seed: 303 },
    'Stress Test': { growthMult: 0.35, costMult: 1.5, seed: 404 },
  }[scenario];

  const trajectory = generateMonthlyTrajectory(params, scenarioConfig);
  const cashflows = trajectory.map((t) => t.netCashflow);
  const npv = calculateNPV(params.capitalAllocation, cashflows, params.interestRate);
  const irr = approximateIRR(params.capitalAllocation, cashflows);

  // Break-even month: month where cumulativeCash >= 0
  const breakEvenPoint = trajectory.find((t) => t.cumulativeCash >= 0);
  const breakEvenMonth = breakEvenPoint ? breakEvenPoint.month : -1;

  const monteCarlo = runMonteCarloSimulation(params, 1000, scenarioConfig.seed);
  const sensitivity = calculateSensitivity(params);

  return {
    scenarioName: scenario,
    expectedNPV: npv,
    expectedIRR: irr,
    breakEvenMonth,
    probabilityOfProfitability: monteCarlo.probabilityOfProfitability,
    p10NPV: monteCarlo.p10,
    p50NPV: monteCarlo.p50,
    p90NPV: monteCarlo.p90,
    monthlyTrajectory: trajectory,
    distributionBins: monteCarlo.distributionBins,
    sensitivityDrivers: sensitivity,
    calculatedAt: new Date().toISOString(),
    modelNotes: `Deterministic Monte Carlo (1,000 runs, Seed: ${scenarioConfig.seed}) with Box-Muller normal variance across CAC, monthly growth, and OpEx.`,
  };
}

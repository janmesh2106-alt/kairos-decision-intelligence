import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNPV,
  approximateIRR,
  generateMonthlyTrajectory,
  runMonteCarloSimulation,
  calculateSensitivity,
  createPseudoRandom,
} from './simulationEngine';
import {
  getDefaultDependencyNetwork,
  propagateVariableChange,
} from './dependencyEngine';

test('simulationEngine: seeded pseudorandom produces deterministic stream', () => {
  const rand1 = createPseudoRandom(42);
  const stream1 = [rand1(), rand1(), rand1()];

  const rand2 = createPseudoRandom(42);
  const stream2 = [rand2(), rand2(), rand2()];

  assert.deepEqual(stream1, stream2);
  assert.equal(stream1[0] > 0 && stream1[0] < 1, true);
});

test('simulationEngine: calculateNPV discounts future cashflows correctly', () => {
  const initialOutlay = 100000;
  const cashflows = [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000]; // 12 * $10k = $120k
  const discountRate = 10; // 10%
  const npv = calculateNPV(initialOutlay, cashflows, discountRate);

  // Discounted $120k at 10% is > $100k outlay, so NPV must be positive
  assert.equal(npv > 0, true);
  assert.equal(npv < 20000, true); // Less than nominal $20,000 profit due to time value of money
});

test('simulationEngine: generateMonthlyTrajectory calculates cumulative cash accurately', () => {
  const params = {
    capitalAllocation: 500000,
    budget: 500000,
    annualGrowthRate: 20,
    cac: 1200,
    conversionRate: 3.5,
    baseRevenue: 100000,
    opex: 80000,
    marketSize: 50000000,
    interestRate: 8,
    hiringCosts: 60000,
    projectDurationMonths: 12,
    scenarioWeight: 1,
  };

  const trajectory = generateMonthlyTrajectory(params);
  assert.equal(trajectory.length, 12);
  assert.equal(trajectory[0].month, 1);
  assert.equal(trajectory[11].month, 12);
  // Revenue should grow over time with 20% annual growth
  assert.equal(trajectory[11].revenue > trajectory[0].revenue, true);
});

test('simulationEngine: runMonteCarloSimulation computes percentile distributions', () => {
  const params = {
    capitalAllocation: 300000,
    budget: 300000,
    annualGrowthRate: 25,
    cac: 1100,
    conversionRate: 4.0,
    baseRevenue: 80000,
    opex: 60000,
    marketSize: 20000000,
    interestRate: 7,
    hiringCosts: 40000,
    projectDurationMonths: 18,
    scenarioWeight: 1,
  };

  const result = runMonteCarloSimulation(params, 200, 999);
  assert.equal(result.npvRuns.length, 200);
  assert.equal(result.p10 <= result.p50, true);
  assert.equal(result.p50 <= result.p90, true);
  assert.equal(result.probabilityOfProfitability >= 0 && result.probabilityOfProfitability <= 100, true);
  assert.equal(result.distributionBins.length, 20);
});

test('dependencyEngine: default network contains valid topological linkages', () => {
  const network = getDefaultDependencyNetwork();
  assert.equal(Boolean(network.cac), true);
  assert.equal(Boolean(network.expansion_feasibility), true);
  assert.equal(network.cac.downstreamIds.includes('marketing_exp'), true);
  assert.equal(network.operating_expenses.downstreamIds.includes('monthly_net_cashflow'), true);
});

test('dependencyEngine: CAC increase propagates to marketing expense and compresses feasibility', () => {
  const network = getDefaultDependencyNetwork();
  const initialFeasibility = network.expansion_feasibility.currentValue;

  // Hike CAC from 1200 to 2400 (+100%)
  const { updatedNetwork, alert } = propagateVariableChange(network, 'cac', 2400);

  assert.equal(updatedNetwork.cac.currentValue, 2400);
  assert.equal(updatedNetwork.marketing_exp.currentValue > network.marketing_exp.currentValue, true);
  assert.equal(updatedNetwork.operating_expenses.currentValue > network.operating_expenses.currentValue, true);
  // Feasibility score should drop
  assert.equal(updatedNetwork.expansion_feasibility.currentValue < initialFeasibility, true);
  assert.equal(alert.level === 'warning' || alert.level === 'critical', true);
  assert.equal(alert.propagationPath.length >= 3, true);
});

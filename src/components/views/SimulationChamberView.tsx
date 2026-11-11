/**
 * KAIROS// Simulation Chamber
 * Quantitative Financial Laboratory: 1,000-run Monte Carlo, Cashflow Trajectories & Tornado Sensitivity
 */

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  TrendingUp,
  BarChart3,
  Sliders,
  RotateCcw,
  Sparkles,
  Info,
  DollarSign,
  Percent,
  Calendar,
} from 'lucide-react';
import { SimulationOutput, SimulationParameters } from '../../types/kairos';
import { INITIAL_SIM_PARAMS } from '../../data/seedData';
import { runScenarioAnalysis } from '../../utils/simulationEngine';

interface SimulationChamberViewProps {
  initialParams?: SimulationParameters;
}

export const SimulationChamberView: React.FC<SimulationChamberViewProps> = ({
  initialParams = INITIAL_SIM_PARAMS,
}) => {
  const [params, setParams] = useState<SimulationParameters>(initialParams);
  const [scenario, setScenario] = useState<'Base Case' | 'Bull Case' | 'Bear Case' | 'Stress Test'>(
    'Base Case'
  );
  const [output, setOutput] = useState<SimulationOutput>(() =>
    runScenarioAnalysis(initialParams, 'Base Case')
  );

  // Deterministically recalculate when params or scenario change
  useEffect(() => {
    const res = runScenarioAnalysis(params, scenario);
    setOutput(res);
  }, [params, scenario]);

  const handleParamChange = (key: keyof SimulationParameters, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetParams = () => {
    setParams(INITIAL_SIM_PARAMS);
    setScenario('Base Case');
  };

  // Trajectory dimensions
  const trajectory = output.monthlyTrajectory;
  const maxRevenue = Math.max(...trajectory.map((t) => t.revenue), 1000);
  const maxCosts = Math.max(...trajectory.map((t) => t.operatingCosts), 1000);
  const chartMaxY = Math.max(maxRevenue, maxCosts) * 1.15;

  // Histogram dimensions
  const bins = output.distributionBins;
  const maxFreq = Math.max(...bins.map((b) => b.frequency), 1);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Scenario Switcher */}
      <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="mono text-xs font-bold text-[#c0a477] bg-[#c0a477]/15 px-2 py-0.5 rounded border border-[#c0a477]/30">
              SIMULATION CHAMBER // QUANTITATIVE ENGINE
            </span>
            <span className="mono text-xs text-[#777e80]">1,000 MONTE CARLO ITERATIONS</span>
            <span className="mono text-xs text-[#667f72]">DETERMINISTIC KERNEL</span>
          </div>
          <h1 className="text-xl font-bold text-[#e7e2d9] tracking-tight">
            Stochastic Scenario Modeling & Sensitivity Laboratory
          </h1>
          <p className="text-xs text-[#777e80] max-w-3xl leading-relaxed">
            Simulate alternative future trajectories, probabilistic cash-flow paths, and break-even horizons. Adjust input levers with real-time feedback.
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center space-x-2 shrink-0">
          {(['Base Case', 'Bull Case', 'Bear Case', 'Stress Test'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`px-3 py-1.5 rounded text-xs mono font-semibold transition-all ${
                scenario === s
                  ? 'bg-[#c0a477] text-[#111315]'
                  : 'bg-[#111315] text-[#777e80] hover:text-[#e7e2d9] border border-[#e7e2d9]/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Top Output KPI Scorecard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded bg-[#202326] border border-[#e7e2d9]/10">
          <div className="text-[10px] mono text-[#777e80] uppercase">Expected Net Present Value (NPV)</div>
          <div
            className={`text-2xl font-bold mono mt-1 ${
              output.expectedNPV >= 0 ? 'text-[#667f72]' : 'text-[#c85a5a]'
            }`}
          >
            {output.expectedNPV >= 0
              ? `+$${(output.expectedNPV / 1000000).toFixed(2)}M`
              : `-$${(Math.abs(output.expectedNPV) / 1000000).toFixed(2)}M`}
          </div>
          <div className="text-[10px] text-[#777e80] mt-0.5 mono">
            P10: ${(output.p10NPV / 1000000).toFixed(2)}M | P90: ${(output.p90NPV / 1000000).toFixed(2)}M
          </div>
        </div>

        <div className="p-4 rounded bg-[#202326] border border-[#e7e2d9]/10">
          <div className="text-[10px] mono text-[#777e80] uppercase">Expected IRR (Annualized)</div>
          <div className="text-2xl font-bold mono text-[#c0a477] mt-1">
            {output.expectedIRR > 0 ? `${output.expectedIRR}%` : 'Sub-zero'}
          </div>
          <div className="text-[10px] text-[#777e80] mt-0.5 mono">Internal Rate of Return</div>
        </div>

        <div className="p-4 rounded bg-[#202326] border border-[#e7e2d9]/10">
          <div className="text-[10px] mono text-[#777e80] uppercase">Break-Even Horizon</div>
          <div className="text-2xl font-bold mono text-[#e7e2d9] mt-1">
            {output.breakEvenMonth > 0 ? `Month ${output.breakEvenMonth}` : 'Beyond Horizon'}
          </div>
          <div className="text-[10px] text-[#667f72] mt-0.5 mono">Cumulative Cash Positive</div>
        </div>

        <div className="p-4 rounded bg-[#202326] border border-[#e7e2d9]/10">
          <div className="text-[10px] mono text-[#777e80] uppercase">Probability of Profitability</div>
          <div className="text-2xl font-bold mono text-[#667f72] mt-1">
            {output.probabilityOfProfitability}%
          </div>
          <div className="text-[10px] text-[#777e80] mt-0.5 mono">
            {Math.round(output.probabilityOfProfitability * 10)} / 1,000 Runs Profitable
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Visualization Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart 1: Cashflow Trajectory */}
          <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d9]/10">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                  MONTHLY CASH-FLOW TRAJECTORY & RUNWAY ABSORPTION
                </h3>
                <p className="text-[11px] text-[#777e80]">
                  Green: Monthly Revenue | Red: Operating Costs | Gold: Cumulative Cash Balance
                </p>
              </div>
              <div className="flex items-center space-x-3 text-xs mono">
                <span className="flex items-center space-x-1 text-[#667f72]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#667f72]" />
                  <span>Revenue</span>
                </span>
                <span className="flex items-center space-x-1 text-[#c85a5a]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c85a5a]" />
                  <span>Total Costs</span>
                </span>
                <span className="flex items-center space-x-1 text-[#c0a477]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c0a477]" />
                  <span>Cumulative</span>
                </span>
              </div>
            </div>

            {/* SVG Trajectory Chart */}
            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                {/* Horizontal Gridlines */}
                {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => (
                  <line
                    key={idx}
                    x1="40"
                    y1={200 - frac * 180}
                    x2="590"
                    y2={200 - frac * 180}
                    stroke="#e7e2d9"
                    strokeOpacity="0.05"
                    strokeDasharray="2 2"
                  />
                ))}

                {/* Revenue Polyline (Green) */}
                <polyline
                  fill="none"
                  stroke="#667f72"
                  strokeWidth="2.5"
                  points={trajectory
                    .map((t, idx) => {
                      const x = 50 + (idx / (trajectory.length - 1)) * 530;
                      const y = 200 - (t.revenue / chartMaxY) * 180;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Operating Costs Polyline (Red) */}
                <polyline
                  fill="none"
                  stroke="#c85a5a"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                  points={trajectory
                    .map((t, idx) => {
                      const x = 50 + (idx / (trajectory.length - 1)) * 530;
                      const y = 200 - (t.operatingCosts / chartMaxY) * 180;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Cumulative Cash (Gold) */}
                <polyline
                  fill="none"
                  stroke="#c0a477"
                  strokeWidth="2"
                  points={trajectory
                    .map((t, idx) => {
                      const x = 50 + (idx / (trajectory.length - 1)) * 530;
                      // Normalize cumulative cash from -capitalAllocation to +capitalAllocation
                      const normCash = (t.cumulativeCash + params.capitalAllocation) / (params.capitalAllocation * 2.5);
                      const y = 200 - Math.max(0, Math.min(1, normCash)) * 180;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Break-Even Marker */}
                {output.breakEvenMonth > 0 && (
                  <g>
                    <line
                      x1={50 + ((output.breakEvenMonth - 1) / (trajectory.length - 1)) * 530}
                      y1="20"
                      x2={50 + ((output.breakEvenMonth - 1) / (trajectory.length - 1)) * 530}
                      y2="200"
                      stroke="#c0a477"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={50 + ((output.breakEvenMonth - 1) / (trajectory.length - 1)) * 530}
                      y="15"
                      textAnchor="middle"
                      fill="#c0a477"
                      fontSize="9"
                      fontFamily="IBM Plex Mono"
                      fontWeight="bold"
                    >
                      BREAK-EVEN (M{output.breakEvenMonth})
                    </text>
                  </g>
                )}
              </svg>

              {/* Month X-Axis Labels */}
              <div className="flex justify-between text-[10px] mono text-[#777e80] px-4 pt-1">
                <span>Month 1</span>
                <span>Month 6</span>
                <span>Month 12</span>
                <span>Month 18</span>
                <span>Month {params.projectDurationMonths}</span>
              </div>
            </div>
          </div>

          {/* Chart 2: Monte Carlo Probability Density & Bins */}
          <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d9]/10">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                  MONTE CARLO PROBABILITY DENSITY (1,000 RUN HISTOGRAM)
                </h3>
                <p className="text-[11px] text-[#777e80]">
                  Frequency distribution of calculated NPV outcomes with 18% volatility.
                </p>
              </div>
              <div className="mono text-xs text-[#667f72]">
                P50 Median: ${(output.p50NPV / 1000000).toFixed(2)}M
              </div>
            </div>

            {/* Histogram Bars */}
            <div className="h-44 w-full flex items-end space-x-1.5 pt-4">
              {bins.map((bin, i) => {
                const heightPct = (bin.frequency / maxFreq) * 100;
                const isPositive = bin.binMid >= 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all ${
                        isPositive ? 'bg-[#667f72] group-hover:bg-[#88a394]' : 'bg-[#c85a5a] group-hover:bg-[#e06868]'
                      }`}
                    />
                    {/* Tooltip on hover */}
                    <div className="hidden group-hover:block absolute -top-10 bg-[#111315] border border-[#e7e2d9]/20 p-1 rounded text-[9px] mono text-[#e7e2d9] whitespace-nowrap z-20">
                      ${(bin.binMid / 1000000).toFixed(2)}M: {bin.frequency} runs
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[10px] mono text-[#777e80] border-t border-[#e7e2d9]/5 pt-2">
              <span>Bearish Tail (${(bins[0]?.binMin / 1000000).toFixed(1)}M)</span>
              <span className="text-[#c0a477] font-semibold">$0.0M Break-Even Threshold</span>
              <span>Bullish Tail (${(bins[bins.length - 1]?.binMax / 1000000).toFixed(1)}M)</span>
            </div>
          </div>

          {/* Chart 3: Sensitivity Analysis (Tornado Factors) */}
          <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d9]/10">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                  TORNADO SENSITIVITY FACTORS // KEY OUTCOME DRIVERS
                </h3>
                <p className="text-[11px] text-[#777e80]">
                  Elasticity ranking: shows which assumption shifts drive greatest NPV swing.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {output.sensitivityDrivers.map((driver) => {
                const spread = Math.abs(driver.p90NPVImpact - driver.p10NPVImpact);
                const maxSpread = Math.abs(
                  output.sensitivityDrivers[0].p90NPVImpact - output.sensitivityDrivers[0].p10NPVImpact
                );
                const widthPct = Math.max(15, Math.min(100, (spread / maxSpread) * 100));

                return (
                  <div key={driver.variable} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#e7e2d9] font-medium">{driver.variable}</span>
                      <div className="mono text-[11px] text-[#c0a477]">
                        Elasticity: {driver.elasticity.toFixed(2)}x
                      </div>
                    </div>
                    <div className="h-4 bg-[#111315] rounded overflow-hidden flex items-center px-1">
                      <div
                        style={{ width: `${widthPct}%` }}
                        className="h-2 rounded bg-gradient-to-r from-[#c85a5a] via-[#c0a477] to-[#667f72]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Control Sliders */}
        <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d9]/10">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#c0a477]" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                INTERACTIVE LEVERS
              </h3>
            </div>
            <button
              onClick={handleResetParams}
              className="text-xs mono text-[#777e80] hover:text-[#c0a477] flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Capital Allocation */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#777e80]">Capital Allocation ($)</span>
                <span className="mono text-[#c0a477] font-semibold">
                  ${(params.capitalAllocation / 1000000).toFixed(2)}M
                </span>
              </div>
              <input
                type="range"
                min={500000}
                max={15000000}
                step={250000}
                value={params.capitalAllocation}
                onChange={(e) => handleParamChange('capitalAllocation', Number(e.target.value))}
                className="w-full accent-[#c0a477]"
              />
            </div>

            {/* Annual Growth Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#777e80]">Annual Growth Rate (%)</span>
                <span className="mono text-[#e7e2d9] font-semibold">{params.annualGrowthRate}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={1}
                value={params.annualGrowthRate}
                onChange={(e) => handleParamChange('annualGrowthRate', Number(e.target.value))}
                className="w-full accent-[#c0a477]"
              />
            </div>

            {/* Customer Acquisition Cost (CAC) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#777e80]">Blended CAC ($ USD)</span>
                <span className="mono text-[#c0a477] font-semibold">${params.cac}</span>
              </div>
              <input
                type="range"
                min={400}
                max={3500}
                step={50}
                value={params.cac}
                onChange={(e) => handleParamChange('cac', Number(e.target.value))}
                className="w-full accent-[#c0a477]"
              />
            </div>

            {/* Conversion Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#777e80]">Lead-to-Close Conversion</span>
                <span className="mono text-[#e7e2d9] font-semibold">{params.conversionRate}%</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={12.0}
                step={0.1}
                value={params.conversionRate}
                onChange={(e) => handleParamChange('conversionRate', Number(e.target.value))}
                className="w-full accent-[#c0a477]"
              />
            </div>

            {/* Monthly OpEx */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#777e80]">Monthly OpEx ($/mo)</span>
                <span className="mono text-[#e7e2d9] font-semibold">
                  ${(params.opex / 1000).toFixed(0)}k/mo
                </span>
              </div>
              <input
                type="range"
                min={20000}
                max={300000}
                step={5000}
                value={params.opex}
                onChange={(e) => handleParamChange('opex', Number(e.target.value))}
                className="w-full accent-[#c0a477]"
              />
            </div>

            {/* Project Duration */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#777e80]">Horizon Duration (Months)</span>
                <span className="mono text-[#e7e2d9] font-semibold">{params.projectDurationMonths} Months</span>
              </div>
              <input
                type="range"
                min={6}
                max={48}
                step={6}
                value={params.projectDurationMonths}
                onChange={(e) => handleParamChange('projectDurationMonths', Number(e.target.value))}
                className="w-full accent-[#c0a477]"
              />
            </div>

            {/* Discount Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#777e80]">Annual Discount Rate / WACC</span>
                <span className="mono text-[#c0a477] font-semibold">{params.interestRate}%</span>
              </div>
              <input
                type="range"
                min={4.0}
                max={20.0}
                step={0.5}
                value={params.interestRate}
                onChange={(e) => handleParamChange('interestRate', Number(e.target.value))}
                className="w-full accent-[#c0a477]"
              />
            </div>
          </div>

          <div className="p-3 rounded bg-[#111315] border border-[#e7e2d9]/10 text-[11px] text-[#777e80] space-y-1 leading-relaxed">
            <div className="flex items-center space-x-1 text-[#c0a477] font-mono font-semibold uppercase">
              <Info className="w-3.5 h-3.5" />
              <span>Model Reproducibility Note</span>
            </div>
            <div>{output.modelNotes}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

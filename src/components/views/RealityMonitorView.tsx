/**
 * KAIROS// Reality Monitor
 * Prediction versus Reality Calibration Loop & Assumption Scorecard
 */

import React, { useState } from 'react';
import {
  Compass,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import { Decision, RealityMetricTracking } from '../../types/kairos';

interface RealityMonitorViewProps {
  decision: Decision | null;
  realityMetrics: RealityMetricTracking[];
  onAddRealityObservation: (obs: Partial<RealityMetricTracking>) => Promise<void>;
}

export const RealityMonitorView: React.FC<RealityMonitorViewProps> = ({
  decision,
  realityMetrics,
  onAddRealityObservation,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [metricName, setMetricName] = useState<string>('');
  const [category, setCategory] = useState<RealityMetricTracking['category']>('revenue');
  const [predictedVal, setPredictedVal] = useState<number>(100000);
  const [actualVal, setActualVal] = useState<number>(115000);
  const [unit, setUnit] = useState<string>('USD/mo');
  const [rootCause, setRootCause] = useState<string>('');
  const [lessonLearned, setLessonLearned] = useState<string>('');

  const handleCreateObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricName.trim()) return;

    await onAddRealityObservation({
      decisionId: decision?.id || '',
      metricName: metricName.trim(),
      category,
      predictedValue: predictedVal,
      actualValue: actualVal,
      unit,
      rootCauseAnalysis: rootCause.trim() || 'Observed operational outcome recorded.',
      lessonLearned: lessonLearned.trim() || 'Model parameters calibrated against real-world variance.',
    });

    setMetricName('');
    setRootCause('');
    setLessonLearned('');
    setIsAdding(false);
  };

  const avgAssumptionAccuracy =
    realityMetrics.length > 0
      ? Math.round(
          realityMetrics.reduce((sum, m) => sum + m.assumptionAccuracyRating, 0) / realityMetrics.length
        )
      : 85;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="mono text-xs font-bold text-[#c0a477] bg-[#c0a477]/15 px-2 py-0.5 rounded border border-[#c0a477]/30">
              REALITY MONITOR // CALIBRATION ENGINE
            </span>
            <span className="mono text-xs text-[#777e80]">
              DECISION: {decision?.code || 'DEC-2026-084'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#e7e2d9] tracking-tight">
            Prediction versus Reality Variance & Assumption Calibration
          </h1>
          <p className="text-xs text-[#777e80] max-w-3xl leading-relaxed">
            Continuous empirical verification. Compare original quantitative projections against real field metrics to expose forecasting errors and calibrate subsequent strategic decisions.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 rounded bg-[#c0a477] hover:bg-[#d6be99] text-[#111315] font-semibold text-xs tracking-wider transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Reality Observation</span>
        </button>
      </div>

      {/* Accuracy Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded bg-[#202326] border border-[#e7e2d9]/10">
          <div className="text-[10px] mono uppercase text-[#777e80]">Overall Assumption Accuracy</div>
          <div className="text-2xl font-bold mono text-[#667f72] mt-1">{avgAssumptionAccuracy}%</div>
          <div className="text-[10px] text-[#777e80] mt-0.5">Empirical fidelity rating</div>
        </div>

        <div className="p-4 rounded bg-[#202326] border border-[#e7e2d9]/10">
          <div className="text-[10px] mono uppercase text-[#777e80]">Observed Metrics Tracked</div>
          <div className="text-2xl font-bold mono text-[#c0a477] mt-1">{realityMetrics.length}</div>
          <div className="text-[10px] text-[#777e80] mt-0.5">Audited telemetry points</div>
        </div>

        <div className="p-4 rounded bg-[#202326] border border-[#e7e2d9]/10">
          <div className="text-[10px] mono uppercase text-[#777e80]">Calibration Feedback Loop</div>
          <div className="text-2xl font-bold mono text-[#e7e2d9] mt-1">ACTIVE</div>
          <div className="text-[10px] text-[#667f72] mt-0.5">Continuous learning updated</div>
        </div>
      </div>

      {/* New Observation Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateObservation}
          className="p-5 rounded bg-[#202326] border border-[#c0a477]/40 space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#e7e2d9]/10">
            <span className="text-xs font-mono uppercase text-[#c0a477]">
              RECORD NEW POST-DECISION FIELD OBSERVATION
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-[#777e80] hover:text-[#e7e2d9]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              placeholder="Metric Name (e.g. Month-6 Customer Payback)"
              className="bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
            />
            <input
              type="number"
              value={predictedVal}
              onChange={(e) => setPredictedVal(Number(e.target.value))}
              placeholder="Predicted Value"
              className="bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs mono text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
            />
            <input
              type="number"
              value={actualVal}
              onChange={(e) => setActualVal(Number(e.target.value))}
              placeholder="Actual Measured Value"
              className="bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs mono text-[#c0a477] focus:outline-none focus:border-[#c0a477]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="Root Cause for Deviation (e.g. Channel partner closed 2 weeks early)"
              className="bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
            />
            <input
              type="text"
              value={lessonLearned}
              onChange={(e) => setLessonLearned(e.target.value)}
              placeholder="Lesson Learned for Subsequent Strategic Modeling"
              className="bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#c0a477] text-[#111315] text-xs font-semibold"
            >
              Commit Reality Point
            </button>
          </div>
        </form>
      )}

      {/* Reality Observations Cards */}
      <div className="space-y-4">
        {realityMetrics.map((item) => {
          const isPositive = item.variancePct > 0;
          const isUnder = item.status === 'underperforming';

          return (
            <div key={item.id} className="p-5 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="mono text-[10px] uppercase text-[#777e80] bg-[#111315] px-1.5 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="mono text-[10px] text-[#777e80]">{item.observationDate}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#e7e2d9] mt-1">{item.metricName}</h3>
                </div>

                {/* Variance Badge & Comparison */}
                <div className="flex items-center space-x-4">
                  <div className="text-right mono text-xs">
                    <div className="text-[#777e80]">
                      Pred: {item.predictedValue.toLocaleString()} {item.unit}
                    </div>
                    <div className="text-[#e7e2d9] font-bold">
                      Actual: {item.actualValue.toLocaleString()} {item.unit}
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1.5 rounded font-mono text-xs font-bold flex items-center space-x-1.5 ${
                      item.status === 'outperforming'
                        ? 'bg-[#667f72]/20 text-[#667f72] border border-[#667f72]/30'
                        : item.status === 'underperforming'
                        ? 'bg-[#c85a5a]/20 text-[#c85a5a] border border-[#c85a5a]/30'
                        : 'bg-[#c0a477]/20 text-[#c0a477] border border-[#c0a477]/30'
                    }`}
                  >
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{item.variancePct > 0 ? `+${item.variancePct}%` : `${item.variancePct}%`}</span>
                  </div>
                </div>
              </div>

              {/* Visual Variance Delta Bar */}
              <div className="space-y-1">
                <div className="h-2 rounded bg-[#111315] overflow-hidden flex items-center">
                  <div
                    style={{ width: `${Math.min(100, Math.max(10, (item.actualValue / (item.predictedValue * 1.5)) * 100))}%` }}
                    className={`h-full rounded ${
                      item.status === 'underperforming' ? 'bg-[#c85a5a]' : 'bg-[#667f72]'
                    }`}
                  />
                </div>
              </div>

              {/* Root Cause & Lesson Learned */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#e7e2d9]/5 text-xs">
                <div>
                  <span className="mono text-[10px] text-[#777e80] uppercase block">Root Cause Investigation</span>
                  <p className="text-[#e7e2d9] mt-0.5 leading-snug">{item.rootCauseAnalysis}</p>
                </div>
                <div>
                  <span className="mono text-[10px] text-[#c0a477] uppercase block">
                    Strategic Lesson Learned
                  </span>
                  <p className="text-[#e7e2d9] mt-0.5 leading-snug">{item.lessonLearned}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

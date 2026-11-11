/**
 * KAIROS// Decision Dependency Engine View
 * Real-time topological variable propagation, downstream cascade, and assumption invalidation
 */

import React, { useState, useEffect } from 'react';
import {
  GitFork,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sliders,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { DependencyImpactAlert, DependencyVariable } from '../../types/kairos';
import { getDefaultDependencyNetwork, propagateVariableChange } from '../../utils/dependencyEngine';

export const DependencyEngineView: React.FC = () => {
  const [network, setNetwork] = useState<Record<string, DependencyVariable>>(getDefaultDependencyNetwork());
  const [selectedVarId, setSelectedVarId] = useState<string>('cac');
  const [lastAlert, setLastAlert] = useState<DependencyImpactAlert | null>(null);
  const [alertHistory, setAlertHistory] = useState<DependencyImpactAlert[]>([]);

  const selectedVar = network[selectedVarId] || network.cac;

  const handleSliderChange = (newVal: number) => {
    const { updatedNetwork, alert } = propagateVariableChange(network, selectedVarId, newVal);
    setNetwork(updatedNetwork);
    setLastAlert(alert);
    setAlertHistory((prev) => [alert, ...prev.slice(0, 7)]);
  };

  const handleReset = () => {
    const fresh = getDefaultDependencyNetwork();
    setNetwork(fresh);
    setLastAlert(null);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="mono text-xs font-bold text-[#c0a477] bg-[#c0a477]/15 px-2 py-0.5 rounded border border-[#c0a477]/30">
              DECISION DEPENDENCY ENGINE
            </span>
            <span className="mono text-xs text-[#777e80]">TOPOLOGICAL GRAPH PROPAGATION</span>
          </div>
          <h1 className="text-xl font-bold text-[#e7e2d9] tracking-tight">
            Deterministic Variable Sensitivity & Assumption Cascades
          </h1>
          <p className="text-xs text-[#777e80] max-w-3xl leading-relaxed">
            Modify any upstream strategic variable to observe immediate deterministic recomputation across marketing expenditure, operating burn, cash runway, and expansion feasibility.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded bg-[#111315] hover:bg-[#292d30] border border-[#e7e2d9]/10 text-xs mono text-[#777e80] hover:text-[#c0a477] flex items-center space-x-1.5 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Variables</span>
        </button>
      </div>

      {/* Main Cascade Alert Banner */}
      {lastAlert && (
        <div
          className={`p-4 rounded border flex items-start space-x-3 transition-all ${
            lastAlert.level === 'critical'
              ? 'bg-[#c85a5a]/15 border-[#c85a5a] text-[#e7e2d9]'
              : lastAlert.level === 'warning'
              ? 'bg-[#c0a477]/15 border-[#c0a477] text-[#e7e2d9]'
              : 'bg-[#667f72]/15 border-[#667f72] text-[#e7e2d9]'
          }`}
        >
          {lastAlert.level === 'critical' ? (
            <ShieldAlert className="w-5 h-5 text-[#c85a5a] shrink-0 mt-0.5" />
          ) : lastAlert.level === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-[#c0a477] shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#667f72] shrink-0 mt-0.5" />
          )}

          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold">
              <span>{lastAlert.variableName} Adjusted ({lastAlert.percentChange > 0 ? `+${lastAlert.percentChange}%` : `${lastAlert.percentChange}%`})</span>
              <span className="mono uppercase text-[10px] px-1.5 py-0.2 rounded bg-[#111315]">
                THREAT LEVEL: {lastAlert.recommendationThreatLevel}
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">{lastAlert.impactSummary}</p>

            {lastAlert.invalidatedAssumptions.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] mono uppercase font-bold text-[#c85a5a] block mb-1">
                  Potentially Invalidated Strategic Assumptions:
                </span>
                <ul className="space-y-0.5 text-xs text-[#c85a5a]">
                  {lastAlert.invalidatedAssumptions.map((assump: string, i: number) => (
                    <li key={i}>• {assump}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Variable Selector & Live Slider */}
        <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#e7e2d9]/10">
            <Sliders className="w-4 h-4 text-[#c0a477]" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
              PRIMARY UPSTREAM LEVER
            </h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-[#777e80] mono uppercase">Select Variable to Shift</label>
              <select
                value={selectedVarId}
                onChange={(e) => setSelectedVarId(e.target.value)}
                className="w-full bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-2 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
              >
                <option value="cac">Customer Acquisition Cost (CAC)</option>
                <option value="conversion_rate">Lead-to-Close Conversion Rate (%)</option>
                <option value="hiring_burn">Headcount Payroll Burn ($/mo)</option>
              </select>
            </div>

            <div className="p-4 rounded bg-[#111315] border border-[#e7e2d9]/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#e7e2d9]">{selectedVar.name}</span>
                <span className="text-lg font-bold mono text-[#c0a477]">
                  {selectedVar.currentValue.toLocaleString()} {selectedVar.unit}
                </span>
              </div>

              <input
                type="range"
                min={selectedVar.min}
                max={selectedVar.max}
                step={selectedVar.step}
                value={selectedVar.currentValue}
                onInput={(e: React.FormEvent<HTMLInputElement>) => handleSliderChange(Number(e.currentTarget.value))}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="w-full accent-[#c0a477] cursor-pointer"
              />

              <div className="flex justify-between text-[10px] mono text-[#777e80]">
                <span>Min: {selectedVar.min}</span>
                <span>Baseline: {selectedVar.defaultValue}</span>
                <span>Max: {selectedVar.max}</span>
              </div>

              {/* Stress Test Scenario Shortcuts */}
              <div className="pt-2 flex items-center space-x-2 border-t border-[#e7e2d9]/5">
                <span className="text-[10px] mono text-[#777e80] uppercase">Quick Shock:</span>
                <button
                  type="button"
                  onClick={() => handleSliderChange(Math.round(selectedVar.defaultValue * 1.25))}
                  className="px-2 py-0.5 rounded bg-[#202326] hover:bg-[#292d30] text-[10px] mono text-[#c0a477] border border-[#e7e2d9]/10"
                >
                  +25% Shift
                </button>
                <button
                  type="button"
                  onClick={() => handleSliderChange(Math.round(selectedVar.defaultValue * 1.75))}
                  className="px-2 py-0.5 rounded bg-[#202326] hover:bg-[#292d30] text-[10px] mono text-[#c85a5a] border border-[#c85a5a]/30"
                >
                  +75% Severe
                </button>
                <button
                  type="button"
                  onClick={() => handleSliderChange(Math.round(selectedVar.defaultValue * 0.75))}
                  className="px-2 py-0.5 rounded bg-[#202326] hover:bg-[#292d30] text-[10px] mono text-[#667f72] border border-[#667f72]/30"
                >
                  -25% Favorable
                </button>
              </div>
            </div>

            <div className="text-[11px] text-[#777e80] leading-snug">
              <span className="mono uppercase font-semibold text-[#c0a477] block mb-0.5">Formula: </span>
              {selectedVar.formulaSummary}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Downstream Dependency Impact Chain */}
        <div className="lg:col-span-2 p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d9]/10">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                TOPOLOGICAL DOWNSTREAM CASCADE CHAIN
              </h3>
              <p className="text-[11px] text-[#777e80]">
                Sequential propagation order: Upstream Shift → Operating Burn → Cash Flow → Runway → Feasibility.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.values(network)
              .filter((v) => v.id !== selectedVarId)
              .map((v) => {
                const isWarning = v.status === 'warning';
                const isCritical = v.status === 'critical';

                return (
                  <div
                    key={v.id}
                    className={`p-3.5 rounded border transition-all ${
                      isCritical
                        ? 'bg-[#c85a5a]/10 border-[#c85a5a]'
                        : isWarning
                        ? 'bg-[#c0a477]/10 border-[#c0a477]'
                        : 'bg-[#111315] border-[#e7e2d9]/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] mono uppercase text-[#777e80]">{v.code}</span>
                      <span
                        className={`text-[9px] mono uppercase font-bold px-1.5 py-0.2 rounded ${
                          isCritical
                            ? 'bg-[#c85a5a] text-[#111315]'
                            : isWarning
                            ? 'bg-[#c0a477] text-[#111315]'
                            : 'bg-[#202326] text-[#667f72]'
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-[#e7e2d9]">{v.name}</div>
                    <div className="text-xl font-bold mono text-[#c0a477] mt-1">
                      {v.currentValue.toLocaleString()} {v.unit}
                    </div>

                    <div className="text-[10px] text-[#777e80] mt-1 pt-1 border-t border-[#e7e2d9]/5 truncate">
                      {v.formulaSummary}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

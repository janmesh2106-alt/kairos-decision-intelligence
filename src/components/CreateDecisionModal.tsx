/**
 * KAIROS// Create Strategic Decision Modal
 * Form with 10 templates and deep structural formulation
 */

import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Decision, DecisionConstraint, DecisionObjective, RiskTolerance } from '../types/kairos';
import { DECISION_TEMPLATES } from '../data/seedData';

interface CreateDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDecision: (decision: Partial<Decision>) => Promise<void>;
}

export const CreateDecisionModal: React.FC<CreateDecisionModalProps> = ({
  isOpen,
  onClose,
  onCreateDecision,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [problemStatement, setProblemStatement] = useState<string>('');
  const [organization, setOrganization] = useState<string>('Apex Synthetics Corp');
  const [industry, setIndustry] = useState<string>('Enterprise Technology');
  const [geographicScope, setGeographicScope] = useState<string>('Global / North America');
  const [decisionOwner, setDecisionOwner] = useState<string>('Sarah Jenkins (EVP)');
  const [strategicObjective, setStrategicObjective] = useState<string>('');
  const [capitalAllocation, setCapitalAllocation] = useState<number>(2500000);
  const [timeHorizonMonths, setTimeHorizonMonths] = useState<number>(24);
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('calculated');

  const [constraints, setConstraints] = useState<DecisionConstraint[]>([
    { id: 'c-init', type: 'budget', description: 'CapEx outlay capped at approved capital allocation', isHardConstraint: true },
  ]);
  const [newConstraintText, setNewConstraintText] = useState<string>('');

  const [objectives, setObjectives] = useState<DecisionObjective[]>([
    { id: 'o-init', metric: 'Target Net Present Value', targetValue: '> $3.0M at 10% WACC', priority: 'primary' },
  ]);
  const [newObjMetric, setNewObjMetric] = useState<string>('');
  const [newObjTarget, setNewObjTarget] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tpl = DECISION_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;

    setTitle(tpl.name);
    setProblemStatement(tpl.description);
    setCapitalAllocation(tpl.defaultCapital);
    setTimeHorizonMonths(tpl.timeHorizonMonths);
    setRiskTolerance(tpl.riskTolerance);
    setConstraints(
      tpl.defaultConstraints.map((c, i) => ({
        id: `c-tpl-${i}`,
        type: c.type,
        description: c.description,
        isHardConstraint: c.isHardConstraint,
      }))
    );
    setObjectives(
      tpl.defaultObjectives.map((o, i) => ({
        id: `o-tpl-${i}`,
        metric: o.metric,
        targetValue: o.targetValue,
        priority: o.priority,
      }))
    );
  };

  const handleAddConstraint = () => {
    if (!newConstraintText.trim()) return;
    setConstraints([
      ...constraints,
      {
        id: `c-${Date.now()}`,
        type: 'regulatory',
        description: newConstraintText.trim(),
        isHardConstraint: true,
      },
    ]);
    setNewConstraintText('');
  };

  const handleRemoveConstraint = (id: string) => {
    setConstraints(constraints.filter((c) => c.id !== id));
  };

  const handleAddObjective = () => {
    if (!newObjMetric.trim() || !newObjTarget.trim()) return;
    setObjectives([
      ...objectives,
      {
        id: `o-${Date.now()}`,
        metric: newObjMetric.trim(),
        targetValue: newObjTarget.trim(),
        priority: 'primary',
      },
    ]);
    setNewObjMetric('');
    setNewObjTarget('');
  };

  const handleRemoveObjective = (id: string) => {
    setObjectives(objectives.filter((o) => o.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateDecision({
        title,
        problemStatement,
        organization,
        industry,
        geographicScope,
        decisionOwner,
        strategicObjective,
        capitalAllocation,
        budget: capitalAllocation,
        timeHorizonMonths,
        riskTolerance,
        constraints,
        objectives,
        successCriteria: [
          `Achieve target objectives within ${timeHorizonMonths} months`,
          'Zero violation of hard boundary constraints',
          'Satisfy Council Arbiter risk-adjusted hurdle rate',
        ],
        tags: [industry, geographicScope],
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#111315] border border-[#e7e2d9]/15 rounded-lg w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#e7e2d9]/10 flex items-center justify-between bg-[#202326]">
          <div className="flex items-center space-x-2">
            <span className="mono text-xs font-bold text-[#c0a477] bg-[#c0a477]/10 px-2 py-0.5 rounded border border-[#c0a477]/30">
              NEW DECISION ARCHITECTURE
            </span>
            <h2 className="text-sm font-semibold text-[#e7e2d9]">Formulate Strategic Decision</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#777e80] hover:text-[#e7e2d9] transition-colors p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Templates Strip */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#777e80] mb-2 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c0a477]" />
              <span>Accelerate with Strategic Decision Templates (10 Available)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {DECISION_TEMPLATES.slice(0, 5).map((tpl) => (
                <button
                  type="button"
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl.id)}
                  className={`p-2 rounded text-left text-xs border transition-all ${
                    selectedTemplateId === tpl.id
                      ? 'bg-[#292d30] border-[#c0a477] text-[#c0a477]'
                      : 'bg-[#202326] border-[#e7e2d9]/10 text-[#777e80] hover:text-[#e7e2d9] hover:border-[#e7e2d9]/25'
                  }`}
                >
                  <div className="font-semibold truncate">{tpl.name.split('(')[0]}</div>
                  <div className="text-[10px] mono text-[#777e80]">${(tpl.defaultCapital / 1000000).toFixed(1)}M | {tpl.timeHorizonMonths}mo</div>
                </button>
              ))}
            </div>
          </div>

          {/* Core Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-mono uppercase text-[#777e80]">Decision Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sovereign AI Compute Pod Deployment vs Hyperscaler Multi-Cloud"
                className="w-full bg-[#202326] border border-[#e7e2d9]/15 rounded px-3 py-2 text-sm text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-mono uppercase text-[#777e80]">Strategic Problem Statement *</label>
              <textarea
                required
                rows={3}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="Describe the trade-offs, consequences, and context of the decision..."
                className="w-full bg-[#202326] border border-[#e7e2d9]/15 rounded px-3 py-2 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-[#777e80]">Organization / Business Unit</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-[#202326] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-[#777e80]">Industry & Domain</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-[#202326] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-[#777e80]">Capital Allocation ($ USD)</label>
              <input
                type="number"
                min={0}
                step={50000}
                value={capitalAllocation}
                onChange={(e) => setCapitalAllocation(Number(e.target.value))}
                className="w-full bg-[#202326] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs mono text-[#c0a477] focus:outline-none focus:border-[#c0a477]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-[#777e80]">Time Horizon (Months)</label>
              <input
                type="number"
                min={3}
                max={120}
                value={timeHorizonMonths}
                onChange={(e) => setTimeHorizonMonths(Number(e.target.value))}
                className="w-full bg-[#202326] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs mono text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-[#777e80]">Risk Tolerance Profile</label>
              <select
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value as RiskTolerance)}
                className="w-full bg-[#202326] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
              >
                <option value="conservative">Conservative (Preserve Capital & Strict Compliance)</option>
                <option value="moderate">Moderate (Standard Enterprise Benchmark)</option>
                <option value="calculated">Calculated (Aggressive Growth with Hedged Tail Risks)</option>
                <option value="aggressive">Aggressive (High-Beta Venture Model)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-[#777e80]">Executive Decision Owner</label>
              <input
                type="text"
                value={decisionOwner}
                onChange={(e) => setDecisionOwner(e.target.value)}
                className="w-full bg-[#202326] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
              />
            </div>
          </div>

          {/* Hard & Soft Constraints */}
          <div className="space-y-2 pt-2 border-t border-[#e7e2d9]/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-[#777e80]">
                Boundary Constraints ({constraints.length})
              </label>
            </div>
            <div className="space-y-1.5">
              {constraints.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-3 py-1.5 rounded bg-[#202326] text-xs">
                  <span className="text-[#e7e2d9]">{c.description}</span>
                  <div className="flex items-center space-x-2">
                    <span className="mono text-[10px] text-[#c85a5a] bg-[#c85a5a]/10 px-1.5 py-0.5 rounded">
                      HARD CONSTRAINT
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveConstraint(c.id)}
                      className="text-[#777e80] hover:text-[#c85a5a]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newConstraintText}
                onChange={(e) => setNewConstraintText(e.target.value)}
                placeholder="Add boundary constraint (e.g. Regulatory certification before launch)"
                className="flex-1 bg-[#202326] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
              />
              <button
                type="button"
                onClick={handleAddConstraint}
                className="px-3 py-1.5 rounded bg-[#292d30] hover:bg-[#343a3e] text-xs text-[#c0a477] flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Objectives & Target Metrics */}
          <div className="space-y-2 pt-2 border-t border-[#e7e2d9]/10">
            <label className="text-xs font-mono uppercase text-[#777e80]">Strategic Objectives & Target Metrics</label>
            <div className="space-y-1.5">
              {objectives.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-3 py-1.5 rounded bg-[#202326] text-xs">
                  <div>
                    <span className="text-[#e7e2d9] font-medium">{o.metric}: </span>
                    <span className="text-[#c0a477] mono">{o.targetValue}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(o.id)}
                    className="text-[#777e80] hover:text-[#c85a5a]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newObjMetric}
                onChange={(e) => setNewObjMetric(e.target.value)}
                placeholder="Metric (e.g. Year-2 ARR)"
                className="bg-[#202326] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
              />
              <input
                type="text"
                value={newObjTarget}
                onChange={(e) => setNewObjTarget(e.target.value)}
                placeholder="Target (e.g. > $4.5M)"
                className="bg-[#202326] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
              />
              <button
                type="button"
                onClick={handleAddObjective}
                className="px-3 py-1.5 rounded bg-[#292d30] hover:bg-[#343a3e] text-xs text-[#c0a477] flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Objective</span>
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#e7e2d9]/10 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs text-[#777e80] hover:text-[#e7e2d9] hover:bg-[#202326] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-2 rounded bg-[#c0a477] hover:bg-[#d6be99] text-[#111315] font-semibold text-xs tracking-wider transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              <span>{isSubmitting ? 'INITIALIZING ARCHITECTURE...' : 'LAUNCH DECISION LAB'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

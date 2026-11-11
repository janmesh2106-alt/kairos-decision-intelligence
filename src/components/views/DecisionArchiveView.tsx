/**
 * KAIROS// Decision Archive
 * Historical repository with retrospective comparison, post-mortems, and audit exports
 */

import React, { useState } from 'react';
import {
  Archive,
  Search,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Decision } from '../../types/kairos';

interface DecisionArchiveViewProps {
  decisions: Decision[];
  onSelectDecision: (d: Decision) => void;
  onNavigateToDecisionLab: () => void;
}

export const DecisionArchiveView: React.FC<DecisionArchiveViewProps> = ({
  decisions,
  onSelectDecision,
  onNavigateToDecisionLab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDecisions = decisions.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="mono text-xs font-bold text-[#c0a477] bg-[#c0a477]/15 px-2 py-0.5 rounded border border-[#c0a477]/30">
              DECISION ARCHIVE // IMMUTABLE LEDGER
            </span>
            <span className="mono text-xs text-[#777e80]">{decisions.length} HISTORICAL RECORDS</span>
          </div>
          <h1 className="text-xl font-bold text-[#e7e2d9] tracking-tight">
            Historical Strategic Decisions & Post-Mortem Comparison
          </h1>
          <p className="text-xs text-[#777e80] max-w-3xl leading-relaxed">
            Preserve complete lineage: original evidence at time of judgment, agent deliberation transcripts, financial sensitivity models, and eventual actual outcomes.
          </p>
        </div>

        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(decisions, null, 2)], {
              type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `KAIROS_Strategic_Decision_Archive_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }}
          className="px-4 py-2 rounded bg-[#202326] hover:bg-[#292d30] border border-[#e7e2d9]/10 text-[#c0a477] font-semibold text-xs tracking-wider transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Complete Archive</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#777e80]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter archived decisions by title, code, or domain..."
          className="w-full bg-[#202326] border border-[#e7e2d9]/15 rounded pl-9 pr-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
        />
      </div>

      {/* Historical Decision Cards */}
      <div className="space-y-4">
        {filteredDecisions.map((dec) => (
          <div
            key={dec.id}
            onClick={() => {
              onSelectDecision(dec);
              onNavigateToDecisionLab();
            }}
            className="p-5 rounded bg-[#202326] border border-[#e7e2d9]/10 hover:border-[#c0a477]/40 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="mono text-xs font-bold text-[#c0a477]">{dec.code}</span>
                  <span className="mono text-xs text-[#777e80]">•</span>
                  <span className="text-xs text-[#777e80]">{dec.organization}</span>
                  <span className="mono text-xs text-[#777e80]">•</span>
                  <span className="mono text-[10px] text-[#667f72] bg-[#667f72]/15 px-1.5 py-0.5 rounded">
                    RATIFIED v{dec.version}.0
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#e7e2d9] group-hover:text-[#c0a477] transition-colors">
                  {dec.title}
                </h3>
              </div>

              <div className="flex items-center space-x-4 text-xs">
                <div className="text-right mono">
                  <div className="text-[#c0a477] font-bold">
                    ${(dec.capitalAllocation / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-[10px] text-[#777e80]">{dec.timeHorizonMonths} Mo Horizon</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#777e80] group-hover:text-[#c0a477] group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            <p className="text-xs text-[#777e80] leading-relaxed line-clamp-2">
              {dec.problemStatement}
            </p>

            <div className="flex items-center justify-between text-[11px] text-[#777e80] pt-2 border-t border-[#e7e2d9]/5">
              <span className="mono">OWNER: {dec.decisionOwner}</span>
              <span className="mono">INITIALIZED: {dec.createdAt.split('T')[0]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

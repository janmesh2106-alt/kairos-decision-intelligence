/**
 * KAIROS// Research & Evidence Library
 * Document ingestion, claim extraction, and mandatory epistemic classification
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Upload,
  FileText,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { Decision, EpistemicClassification, EvidenceItem } from '../../types/kairos';

interface ResearchLibraryViewProps {
  decision: Decision | null;
  evidence: EvidenceItem[];
  onAddEvidence: (item: Partial<EvidenceItem>) => Promise<void>;
  onExtractFromText: (rawText: string, docName: string) => Promise<void>;
}

export const ResearchLibraryView: React.FC<ResearchLibraryViewProps> = ({
  decision,
  evidence,
  onAddEvidence,
  onExtractFromText,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEpistemic, setSelectedEpistemic] = useState<string>('all');
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [rawText, setRawText] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const filteredEvidence = evidence.filter((item) => {
    const matchesEpistemic = selectedEpistemic === 'all' || item.epistemicType === selectedEpistemic;
    const matchesQuery =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.extractedClaim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceDocument.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEpistemic && matchesQuery;
  });

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIsProcessing(true);
    try {
      await onExtractFromText(rawText.trim(), documentName.trim() || 'Uploaded Research Brief');
      setRawText('');
      setDocumentName('');
      setIsIngesting(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="mono text-xs font-bold text-[#c0a477] bg-[#c0a477]/15 px-2 py-0.5 rounded border border-[#c0a477]/30">
              EPISTEMIC INTELLIGENCE LIBRARY
            </span>
            <span className="mono text-xs text-[#777e80]">VERIFIABILITY MANDATE</span>
          </div>
          <h1 className="text-xl font-bold text-[#e7e2d9] tracking-tight">
            Evidence Repository & Epistemic Classifier
          </h1>
          <p className="text-xs text-[#777e80] max-w-3xl leading-relaxed">
            Every substantive claim is strictly classified as FACT, ASSUMPTION, HYPOTHESIS, or RECOMMENDATION. Ground strategic decisions in verified primary evidence with zero hallucination.
          </p>
        </div>

        <button
          onClick={() => setIsIngesting(!isIngesting)}
          className="px-4 py-2 rounded bg-[#c0a477] hover:bg-[#d6be99] text-[#111315] font-semibold text-xs tracking-wider transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Ingest Document or Notes</span>
        </button>
      </div>

      {/* Document Ingestion Drawer */}
      {isIngesting && (
        <form onSubmit={handleIngest} className="p-5 rounded bg-[#202326] border border-[#c0a477]/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#c0a477]" />
              <span className="text-xs font-mono uppercase text-[#c0a477]">
                NLP CLAIM EXTRACTION & EPISTEMIC TAGGER
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsIngesting(false)}
              className="text-xs text-[#777e80] hover:text-[#e7e2d9]"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Source Document Name (e.g. Bain_APAC_Fintech_Report_2026.pdf)"
              className="w-full bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
            />
            <textarea
              required
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste research excerpt, interview transcript, earnings filing notes, or market statistics..."
              className="w-full bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-2 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477] resize-none"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              disabled={isProcessing || !rawText.trim()}
              className="px-4 py-1.5 rounded bg-[#c0a477] text-[#111315] text-xs font-semibold flex items-center space-x-1.5 disabled:opacity-50"
            >
              <span>{isProcessing ? 'CLASSIFYING CLAIMS...' : 'Extract & Classify Claims'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded bg-[#202326] border border-[#e7e2d9]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#777e80]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claims, documents, or reliable sources..."
            className="w-full bg-[#111315] border border-[#e7e2d9]/15 rounded pl-9 pr-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
          />
        </div>

        {/* Epistemic Badges */}
        <div className="flex items-center space-x-1 text-xs">
          {['all', 'FACT', 'ASSUMPTION', 'HYPOTHESIS', 'RECOMMENDATION'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedEpistemic(cat)}
              className={`px-3 py-1 rounded mono text-[10px] uppercase transition-colors ${
                selectedEpistemic === cat
                  ? 'bg-[#c0a477] text-[#111315] font-semibold'
                  : 'bg-[#111315] text-[#777e80] hover:text-[#e7e2d9] border border-[#e7e2d9]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvidence.map((item) => (
          <div key={item.id} className="p-5 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-3">
            <div className="flex items-center justify-between">
              <span
                className={`mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  item.epistemicType === 'FACT'
                    ? 'bg-[#667f72]/20 text-[#667f72] border border-[#667f72]/30'
                    : item.epistemicType === 'ASSUMPTION'
                    ? 'bg-[#c0a477]/20 text-[#c0a477] border border-[#c0a477]/30'
                    : item.epistemicType === 'HYPOTHESIS'
                    ? 'bg-[#777e80]/20 text-[#777e80] border border-[#777e80]/30'
                    : 'bg-[#e7e2d9]/20 text-[#e7e2d9] border border-[#e7e2d9]/30'
                }`}
              >
                {item.epistemicType}
              </span>

              <div className="flex items-center space-x-2 text-[10px] mono text-[#777e80]">
                <span>CONFIDENCE: {item.confidenceScore}%</span>
                <span>•</span>
                <span className="uppercase text-[#667f72]">{item.verificationStatus}</span>
              </div>
            </div>

            <h3 className="text-xs font-bold text-[#e7e2d9]">{item.title}</h3>

            <div className="text-xs text-[#e7e2d9] bg-[#111315] p-3 rounded border border-[#e7e2d9]/5 leading-relaxed">
              "{item.extractedClaim}"
            </div>

            <div className="text-[11px] text-[#777e80] space-y-1 pt-1 border-t border-[#e7e2d9]/5">
              <div>
                <span className="mono uppercase text-[10px]">Source: </span>
                <span className="text-[#e7e2d9] font-medium">{item.sourceDocument}</span>
              </div>
              <div>
                <span className="mono uppercase text-[10px]">Reliability: </span>
                <span>{item.reliabilityExplanation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

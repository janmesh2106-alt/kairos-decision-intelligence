/**
 * KAIROS// Command Palette
 * Executive quick-switcher and action trigger (Cmd+K)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Layers, Activity, Users, Cpu, GitFork, Compass, BookOpen, ArrowRight } from 'lucide-react';
import { Decision } from '../types/kairos';
import { NavViewId } from './NavigationSidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  decisions: Decision[];
  onSelectDecision: (decision: Decision) => void;
  onSelectView: (view: NavViewId) => void;
  onOpenCreateModal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  decisions,
  onSelectDecision,
  onSelectView,
  onOpenCreateModal,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredDecisions = decisions.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.code.toLowerCase().includes(query.toLowerCase()) ||
      d.industry.toLowerCase().includes(query.toLowerCase())
  );

  const environments: { id: NavViewId; label: string; icon: any }[] = ([
    { id: 'command_centre' as NavViewId, label: 'Executive Command Centre', icon: Activity },
    { id: 'decision_lab' as NavViewId, label: 'Decision Lab Workspace', icon: Layers },
    { id: 'intelligence_network' as NavViewId, label: 'Living Intelligence Network Graph', icon: Layers },
    { id: 'agent_council' as NavViewId, label: '7-Agent Deliberation Council', icon: Users },
    { id: 'simulation_chamber' as NavViewId, label: 'Quantitative Simulation Chamber', icon: Cpu },
    { id: 'dependency_engine' as NavViewId, label: 'Decision Dependency Engine', icon: GitFork },
    { id: 'reality_monitor' as NavViewId, label: 'Prediction vs Reality Monitor', icon: Compass },
    { id: 'research_library' as NavViewId, label: 'Epistemic Research & Evidence Library', icon: BookOpen },
  ] as { id: NavViewId; label: string; icon: any }[]).filter((env) => env.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111315] border border-[#c0a477]/40 rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-[#e7e2d9]/10 flex items-center space-x-3 bg-[#202326]">
          <Search className="w-4 h-4 text-[#c0a477]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search decisions, or jump to environment..."
            className="flex-1 bg-transparent text-sm text-[#e7e2d9] placeholder-[#777e80] focus:outline-none"
          />
          <kbd className="mono text-[10px] text-[#777e80] bg-[#111315] px-1.5 py-0.5 rounded border border-[#e7e2d9]/10">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="p-2 max-h-96 overflow-y-auto space-y-4">
          {/* Quick Actions */}
          <div>
            <div className="px-2 py-1 text-[10px] mono text-[#777e80] uppercase tracking-wider">
              QUICK COMMANDS
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenCreateModal();
              }}
              className="w-full text-left px-3 py-2 rounded text-xs text-[#e7e2d9] hover:bg-[#202326] flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <span className="mono text-[#c0a477] font-semibold">+</span>
                <span>Formulate New Strategic Decision</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#777e80]" />
            </button>
          </div>

          {/* Decisions */}
          {filteredDecisions.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] mono text-[#777e80] uppercase tracking-wider">
                STRATEGIC DECISIONS ({filteredDecisions.length})
              </div>
              {filteredDecisions.map((dec) => (
                <button
                  key={dec.id}
                  onClick={() => {
                    onSelectDecision(dec);
                    onSelectView('decision_lab');
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded text-xs text-[#e7e2d9] hover:bg-[#202326] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="mono text-[#c0a477] font-semibold">{dec.code}</span>
                    <span className="truncate max-w-[380px]">{dec.title}</span>
                  </div>
                  <span className="mono text-[10px] text-[#777e80] uppercase border border-[#e7e2d9]/10 px-1 rounded">
                    {dec.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Environments */}
          {environments.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] mono text-[#777e80] uppercase tracking-wider">
                ENVIRONMENTS
              </div>
              {environments.map((env) => {
                const Icon = env.icon;
                return (
                  <button
                    key={env.id}
                    onClick={() => {
                      onSelectView(env.id);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded text-xs text-[#e7e2d9] hover:bg-[#202326] flex items-center space-x-2.5 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#c0a477]" />
                    <span>{env.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

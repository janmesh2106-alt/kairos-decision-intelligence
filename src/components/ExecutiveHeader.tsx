/**
 * KAIROS// Executive Command Bar & Header
 * High-density command bar with workspace selector, decision switcher, live clock, and actions
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  ChevronDown,
  Building2,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Decision, WorkspaceState } from '../types/kairos';

interface ExecutiveHeaderProps {
  workspace: WorkspaceState;
  decisions: Decision[];
  activeDecision: Decision | null;
  onSelectDecision: (decision: Decision) => void;
  onOpenCreateModal: () => void;
  onOpenCommandPalette: () => void;
  onSelectView?: (view: any) => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  workspace,
  decisions,
  activeDecision,
  onSelectDecision,
  onOpenCreateModal,
  onOpenCommandPalette,
  onSelectView,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showDecisionMenu, setShowDecisionMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Contradictory Evidence Flagged',
      desc: 'Competitor CloudNexus 22% discounting directly contradicts assumed 7.5mo Tokyo sales velocity.',
      type: 'warning',
      time: '12m ago',
    },
    {
      id: 'notif-2',
      title: 'Phase-1 Tranche Ready for Board Signature',
      desc: 'Alternative B approved by Council Arbiter. $1.8M Singapore beachhead authorization ready.',
      type: 'success',
      time: '1h ago',
    },
    {
      id: 'notif-3',
      title: 'Reality Variance Alert: Sales Pipeline',
      desc: 'Tokyo pipeline qualification velocity is 37.5% below initial forecast.',
      type: 'alert',
      time: '3h ago',
    },
  ];

  return (
    <header className="h-16 bg-[#111315] border-b border-[#e7e2d9]/10 px-6 flex items-center justify-between z-20 relative select-none">
      {/* Left: Workspace & Active Decision Switcher */}
      <div className="flex items-center space-x-4">
        {/* Workspace Pill */}
        <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded bg-[#202326] border border-[#e7e2d9]/10 text-xs">
          <Building2 className="w-3.5 h-3.5 text-[#c0a477]" />
          <span className="font-medium text-[#e7e2d9]">{workspace.currentWorkspace}</span>
        </div>

        <span className="text-[#777e80]/50">/</span>

        {/* Active Decision Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDecisionMenu(!showDecisionMenu)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded bg-[#202326] hover:bg-[#292d30] border border-[#c0a477]/30 hover:border-[#c0a477] transition-all text-xs"
          >
            <span className="mono text-[#c0a477] font-semibold">
              {activeDecision ? activeDecision.code : 'SELECT DECISION'}
            </span>
            <span className="max-w-[220px] truncate text-[#e7e2d9]">
              {activeDecision ? activeDecision.title : 'No active decision'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#777e80]" />
          </button>

          {showDecisionMenu && (
            <div className="absolute left-0 mt-1 w-96 rounded-md bg-[#202326] border border-[#e7e2d9]/15 shadow-2xl py-1 z-50">
              <div className="px-3 py-1.5 border-b border-[#e7e2d9]/10 text-[10px] font-mono uppercase tracking-wider text-[#777e80]">
                ACTIVE STRATEGIC DECISIONS ({decisions.length})
              </div>
              <div className="max-h-72 overflow-y-auto">
                {decisions.map((dec) => (
                  <button
                    key={dec.id}
                    onClick={() => {
                      onSelectDecision(dec);
                      setShowDecisionMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#292d30] transition-colors ${
                      activeDecision?.id === dec.id ? 'bg-[#292d30] text-[#c0a477]' : 'text-[#e7e2d9]'
                    }`}
                  >
                    <div>
                      <div className="mono font-semibold text-[11px] text-[#c0a477]">{dec.code}</div>
                      <div className="font-medium truncate max-w-[280px] text-xs">{dec.title}</div>
                    </div>
                    <span className="mono text-[10px] px-1.5 py-0.5 rounded uppercase border border-[#e7e2d9]/10 text-[#777e80]">
                      {dec.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Live Terminal Clock & Engine Telemetry */}
      <div className="hidden lg:flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-xs mono text-[#777e80] bg-[#111315] px-3 py-1 rounded border border-[#e7e2d9]/5">
          <Clock className="w-3.5 h-3.5 text-[#c0a477]" />
          <span>{currentTime || 'CALIBRATING CLOCK...'}</span>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] mono text-[#667f72] px-2.5 py-1 rounded bg-[#667f72]/10 border border-[#667f72]/20">
          <Sparkles className="w-3 h-3 text-[#667f72]" />
          <span>AI ENGINE ONLINE</span>
        </div>
      </div>

      {/* Right: Search, Notifications, Create Decision */}
      <div className="flex items-center space-x-3">
        {/* Global Search Button (Cmd+K) */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center space-x-2 px-3 py-1.5 rounded bg-[#202326] hover:bg-[#292d30] border border-[#e7e2d9]/10 text-[#777e80] hover:text-[#e7e2d9] transition-all text-xs"
          title="Search Decisions, Evidence, Agents (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search Terminal</span>
          <kbd className="mono text-[10px] bg-[#111315] text-[#777e80] px-1.5 py-0.5 rounded border border-[#e7e2d9]/10">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded bg-[#202326] hover:bg-[#292d30] border border-[#e7e2d9]/10 text-[#777e80] hover:text-[#e7e2d9] transition-colors relative"
            title="Executive Attention Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#c85a5a]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-md bg-[#202326] border border-[#e7e2d9]/15 shadow-2xl py-2 z-50">
              <div className="px-3 py-1 border-b border-[#e7e2d9]/10 flex items-center justify-between">
                <span className="mono text-[10px] uppercase tracking-wider text-[#777e80]">
                  EXECUTIVE ATTENTION FEED
                </span>
                <span className="mono text-[10px] text-[#c0a477]">3 UNRESOLVED</span>
              </div>
              <div className="divide-y divide-[#e7e2d9]/5 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-[#292d30] transition-colors">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="font-semibold text-[#e7e2d9] flex items-center space-x-1.5">
                        {n.type === 'alert' && <AlertTriangle className="w-3.5 h-3.5 text-[#c85a5a]" />}
                        {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-[#c0a477]" />}
                        {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-[#667f72]" />}
                        <span>{n.title}</span>
                      </div>
                      <span className="mono text-[10px] text-[#777e80]">{n.time}</span>
                    </div>
                    <div className="text-[11px] text-[#777e80] leading-snug">{n.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create Decision Primary CTA */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded bg-[#c0a477] hover:bg-[#d6be99] text-[#111315] font-semibold text-xs tracking-wide transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>CREATE DECISION</span>
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded bg-[#292d30] border border-[#c0a477]/40 flex items-center justify-center text-xs font-bold text-[#c0a477]">
          SJ
        </div>
      </div>
    </header>
  );
};

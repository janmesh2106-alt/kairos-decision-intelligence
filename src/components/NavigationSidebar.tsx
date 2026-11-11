/**
 * KAIROS// Navigation Sidebar
 * Executive terminal styling with icons and status indicators
 */

import React from 'react';
import {
  Activity,
  Layers,
  Share2,
  Users,
  Cpu,
  GitFork,
  CheckSquare,
  Compass,
  BookOpen,
  Archive,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export type NavViewId =
  | 'command_centre'
  | 'decision_lab'
  | 'intelligence_network'
  | 'agent_council'
  | 'simulation_chamber'
  | 'dependency_engine'
  | 'execution_room'
  | 'reality_monitor'
  | 'research_library'
  | 'decision_archive'
  | 'settings';

interface NavigationSidebarProps {
  currentView: NavViewId;
  onSelectView: (view: NavViewId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeAttentionCount?: number;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  activeAttentionCount = 4,
}) => {
  const navItems: { id: NavViewId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'command_centre', label: 'Command Centre', icon: <Activity className="w-4 h-4" /> },
    { id: 'decision_lab', label: 'Decision Lab', icon: <Layers className="w-4 h-4" /> },
    { id: 'intelligence_network', label: 'Intelligence Network', icon: <Share2 className="w-4 h-4" /> },
    { id: 'agent_council', label: 'Agent Council', icon: <Users className="w-4 h-4" />, badge: '7 Agents' },
    { id: 'simulation_chamber', label: 'Simulation Chamber', icon: <Cpu className="w-4 h-4" /> },
    { id: 'dependency_engine', label: 'Dependency Engine', icon: <GitFork className="w-4 h-4" /> },
    { id: 'execution_room', label: 'Execution Room', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'reality_monitor', label: 'Reality Monitor', icon: <Compass className="w-4 h-4" /> },
    { id: 'research_library', label: 'Research Library', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'decision_archive', label: 'Decision Archive', icon: <Archive className="w-4 h-4" /> },
  ];

  return (
    <aside
      className={`h-screen bg-[#111315] border-r border-[#e7e2d9]/10 flex flex-col transition-all duration-200 z-30 select-none shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#e7e2d9]/10">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#c0a477]/15 border border-[#c0a477]/40 flex items-center justify-center">
              <span className="mono text-[#c0a477] font-bold text-xs tracking-tighter">K//</span>
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wider text-[#e7e2d9] flex items-center space-x-1">
                <span>KAIROS</span>
                <span className="text-[#c0a477] font-mono text-xs">//OS</span>
              </div>
              <div className="text-[10px] text-[#777e80] tracking-widest uppercase">Decision Intelligence</div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="w-8 h-8 mx-auto rounded bg-[#c0a477]/15 border border-[#c0a477]/40 flex items-center justify-center">
            <span className="mono text-[#c0a477] font-bold text-xs">K</span>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded text-[#777e80] hover:text-[#e7e2d9] hover:bg-[#202326] transition-colors"
          title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-2 py-1 text-[10px] font-mono tracking-widest text-[#777e80] uppercase">
            OPERATIONAL ENVIRONMENTS
          </div>
        )}

        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
              } py-2 rounded text-xs transition-all ${
                isActive
                  ? 'bg-[#202326] text-[#c0a477] border-l-2 border-[#c0a477] font-medium shadow-inner'
                  : 'text-[#777e80] hover:text-[#e7e2d9] hover:bg-[#202326]/50'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="flex items-center space-x-3">
                <span className={isActive ? 'text-[#c0a477]' : 'text-[#777e80]'}>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span className="mono text-[10px] px-1.5 py-0.5 rounded bg-[#292d30] text-[#c0a477] border border-[#c0a477]/20">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="p-3 border-t border-[#e7e2d9]/10 space-y-2">
        <button
          onClick={() => onSelectView('settings')}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center' : 'space-x-3 px-3'
          } py-2 rounded text-xs text-[#777e80] hover:text-[#e7e2d9] hover:bg-[#202326] transition-colors ${
            currentView === 'settings' ? 'text-[#c0a477] bg-[#202326]' : ''
          }`}
          title="System Settings & Admin"
        >
          <Settings className="w-4 h-4" />
          {!isCollapsed && <span>System & Model Admin</span>}
        </button>

        {!isCollapsed && (
          <div className="p-2.5 rounded bg-[#202326]/60 border border-[#e7e2d9]/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#667f72] animate-pulse" />
              <span className="mono text-[11px] text-[#777e80]">SYSTEM NOMINAL</span>
            </div>
            {activeAttentionCount > 0 && (
              <div className="flex items-center space-x-1 text-[10px] mono text-[#c85a5a] bg-[#c85a5a]/10 px-1.5 py-0.5 rounded border border-[#c85a5a]/20">
                <ShieldAlert className="w-3 h-3" />
                <span>{activeAttentionCount} ALERTS</span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

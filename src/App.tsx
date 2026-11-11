/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  NavigationSidebar,
  NavViewId,
} from './components/NavigationSidebar';
import { ExecutiveHeader } from './components/ExecutiveHeader';
import { CreateDecisionModal } from './components/CreateDecisionModal';
import { CommandPalette } from './components/CommandPalette';

import { CommandCentreView } from './components/views/CommandCentreView';
import { DecisionLabView } from './components/views/DecisionLabView';
import { IntelligenceNetworkView } from './components/views/IntelligenceNetworkView';
import { AgentCouncilView } from './components/views/AgentCouncilView';
import { SimulationChamberView } from './components/views/SimulationChamberView';
import { DependencyEngineView } from './components/views/DependencyEngineView';
import { ExecutionRoomView } from './components/views/ExecutionRoomView';
import { RealityMonitorView } from './components/views/RealityMonitorView';
import { ResearchLibraryView } from './components/views/ResearchLibraryView';
import { DecisionArchiveView } from './components/views/DecisionArchiveView';
import { SettingsView } from './components/views/SettingsView';

import { KairosAPI } from './services/api';
import {
  CouncilRun,
  Decision,
  EvidenceItem,
  ExecutionTask,
  GraphEntity,
  GraphRelationship,
  RealityMetricTracking,
  WorkspaceState,
} from './types/kairos';

export default function App() {
  const [currentView, setCurrentView] = useState<NavViewId>('command_centre');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Core Global State
  const [workspace, setWorkspace] = useState<WorkspaceState>({
    currentWorkspace: 'Apex Executive Suite',
    workspaces: ['Apex Executive Suite', 'Global Strategy Group', 'Venture Syndicate VII', 'Operations Core'],
    currentUser: {
      name: 'Sarah Jenkins',
      email: 's.jenkins@apex-global.com',
      role: 'Executive Vice President',
      accessTier: 'Tier-1 Security Cleared',
    },
    systemStatus: 'nominal',
  });

  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [activeDecision, setActiveDecision] = useState<Decision | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [graphData, setGraphData] = useState<{ entities: GraphEntity[]; relationships: GraphRelationship[] }>({
    entities: [],
    relationships: [],
  });
  const [councilRun, setCouncilRun] = useState<CouncilRun | null>(null);
  const [tasks, setTasks] = useState<ExecutionTask[]>([]);
  const [realityMetrics, setRealityMetrics] = useState<RealityMetricTracking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial load
  useEffect(() => {
    async function loadData() {
      try {
        const [ws, decs, ev, gr, tsk, rm] = await Promise.all([
          KairosAPI.getWorkspace(),
          KairosAPI.getDecisions(),
          KairosAPI.getEvidence(),
          KairosAPI.getGraph(),
          KairosAPI.getExecutionTasks(),
          KairosAPI.getRealityMetrics(),
        ]);

        setWorkspace(ws);
        setDecisions(decs);
        if (decs.length > 0) {
          setActiveDecision(decs[0]);
          const cr = await KairosAPI.getCouncilRun(decs[0].id);
          setCouncilRun(cr);
        }
        setEvidence(ev);
        setGraphData(gr);
        setTasks(tsk);
        setRealityMetrics(rm);
      } catch (err) {
        console.error('Failed to initialize KAIROS state:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // When active decision changes, load its specific council run
  const handleSelectDecision = async (d: Decision) => {
    setActiveDecision(d);
    try {
      const cr = await KairosAPI.getCouncilRun(d.id);
      setCouncilRun(cr);
    } catch (e) {
      console.warn('Council load error:', e);
    }
  };

  // Create Decision
  const handleCreateDecision = async (newDecData: Partial<Decision>) => {
    const created = await KairosAPI.createDecision(newDecData);
    setDecisions((prev) => [created, ...prev]);
    setActiveDecision(created);
    setCurrentView('decision_lab');

    // Refresh graph
    const gr = await KairosAPI.getGraph();
    setGraphData(gr);
  };

  // Update Decision
  const handleUpdateDecision = async (id: string, updates: Partial<Decision>) => {
    const updated = await KairosAPI.updateDecision(id, updates);
    setDecisions((prev) => prev.map((d) => (d.id === id ? updated : d)));
    if (activeDecision?.id === id) {
      setActiveDecision(updated);
    }
  };

  // Add Evidence
  const handleAddEvidence = async (item: Partial<EvidenceItem>) => {
    const created = await KairosAPI.createEvidence(item);
    setEvidence((prev) => [created, ...prev]);
    const gr = await KairosAPI.getGraph();
    setGraphData(gr);
  };

  // Extract from text
  const handleExtractFromText = async (rawText: string, docName: string) => {
    if (!activeDecision) return;
    const extracted = await KairosAPI.extractEvidenceFromText(rawText, docName, activeDecision.id);
    setEvidence((prev) => [...extracted, ...prev]);
    const gr = await KairosAPI.getGraph();
    setGraphData(gr);
  };

  // Execute Council
  const handleExecuteCouncil = async (decisionId: string) => {
    const result = await KairosAPI.executeCouncil(decisionId);
    setCouncilRun(result);
    // Refresh decision status
    const updatedDecisions = await KairosAPI.getDecisions();
    setDecisions(updatedDecisions);
    const updated = updatedDecisions.find((d) => d.id === decisionId);
    if (updated) setActiveDecision(updated);
  };

  // Submit Approval
  const handleSubmitApproval = async (payload: {
    decisionId: string;
    approverName: string;
    approverTitle: string;
    conditionsImposed: string[];
    executiveMemo: string;
  }) => {
    await KairosAPI.submitApproval(payload);
    const updatedDecisions = await KairosAPI.getDecisions();
    setDecisions(updatedDecisions);
    const updated = updatedDecisions.find((d) => d.id === payload.decisionId);
    if (updated) setActiveDecision(updated);
  };

  // Add Execution Task
  const handleAddTask = async (task: Partial<ExecutionTask>) => {
    const created = await KairosAPI.createExecutionTask(task);
    setTasks((prev) => [...prev, created]);
  };

  // Update Task Stage
  const handleUpdateTaskStage = async (taskId: string, newStage: ExecutionTask['stage']) => {
    const updated = await KairosAPI.updateExecutionTask(taskId, { stage: newStage });
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
  };

  // Add Reality Observation
  const handleAddRealityObservation = async (obs: Partial<RealityMetricTracking>) => {
    const created = await KairosAPI.createRealityObservation(obs);
    setRealityMetrics((prev) => [created, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#111315] flex flex-col items-center justify-center space-y-4 select-none">
        <div className="w-10 h-10 rounded bg-[#c0a477]/15 border border-[#c0a477]/40 flex items-center justify-center animate-pulse">
          <span className="mono text-[#c0a477] font-bold text-sm">K//</span>
        </div>
        <div className="mono text-xs text-[#c0a477] tracking-widest uppercase">
          INITIALIZING KAIROS DECISION OS...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111315] text-[#e7e2d9] flex overflow-hidden">
      {/* Persistent Collapsible Navigation Sidebar */}
      <NavigationSidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeAttentionCount={3}
      />

      {/* Main Terminal Body */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Compact Executive Command Bar */}
        <ExecutiveHeader
          workspace={workspace}
          decisions={decisions}
          activeDecision={activeDecision}
          onSelectDecision={handleSelectDecision}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onSelectView={setCurrentView}
        />

        {/* Viewport Router */}
        <main className="flex-1 overflow-y-auto bg-terminal-grid">
          {currentView === 'command_centre' && (
            <CommandCentreView
              decisions={decisions}
              activeDecision={activeDecision}
              evidence={evidence}
              tasks={tasks}
              realityMetrics={realityMetrics}
              onSelectDecision={handleSelectDecision}
              onNavigate={setCurrentView}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          )}

          {currentView === 'decision_lab' && (
            <DecisionLabView
              decision={activeDecision}
              councilRun={councilRun}
              evidence={evidence.filter((e) => e.associatedDecisionId === activeDecision?.id)}
              tasks={tasks.filter((t) => t.decisionId === activeDecision?.id)}
              realityMetrics={realityMetrics.filter((r) => r.decisionId === activeDecision?.id)}
              onUpdateDecision={handleUpdateDecision}
              onSubmitApproval={handleSubmitApproval}
              onNavigate={setCurrentView}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          )}

          {currentView === 'intelligence_network' && (
            <IntelligenceNetworkView
              entities={graphData.entities}
              relationships={graphData.relationships}
              onNavigateToDecision={(id) => {
                const dec = decisions.find((d) => d.id === id);
                if (dec) handleSelectDecision(dec);
                setCurrentView('decision_lab');
              }}
            />
          )}

          {currentView === 'agent_council' && (
            <AgentCouncilView
              decision={activeDecision}
              councilRun={councilRun}
              onExecuteCouncil={handleExecuteCouncil}
            />
          )}

          {currentView === 'simulation_chamber' && (
            <SimulationChamberView />
          )}

          {currentView === 'dependency_engine' && (
            <DependencyEngineView />
          )}

          {currentView === 'execution_room' && (
            <ExecutionRoomView
              decision={activeDecision}
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTaskStage={handleUpdateTaskStage}
            />
          )}

          {currentView === 'reality_monitor' && (
            <RealityMonitorView
              decision={activeDecision}
              realityMetrics={realityMetrics}
              onAddRealityObservation={handleAddRealityObservation}
            />
          )}

          {currentView === 'research_library' && (
            <ResearchLibraryView
              decision={activeDecision}
              evidence={evidence}
              onAddEvidence={handleAddEvidence}
              onExtractFromText={handleExtractFromText}
            />
          )}

          {currentView === 'decision_archive' && (
            <DecisionArchiveView
              decisions={decisions}
              onSelectDecision={handleSelectDecision}
              onNavigateToDecisionLab={() => setCurrentView('decision_lab')}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView workspace={workspace} />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <CreateDecisionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateDecision={handleCreateDecision}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        decisions={decisions}
        onSelectDecision={handleSelectDecision}
        onSelectView={setCurrentView}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />
    </div>
  );
}

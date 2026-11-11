/**
 * KAIROS// Execution Room
 * Turn ratified decisions into action: 4-stage Kanban, Milestones, and Blocker tracking
 */

import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  User,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Decision, ExecutionTask } from '../../types/kairos';

interface ExecutionRoomViewProps {
  decision: Decision | null;
  tasks: ExecutionTask[];
  onAddTask: (task: Partial<ExecutionTask>) => Promise<void>;
  onUpdateTaskStage: (taskId: string, newStage: ExecutionTask['stage']) => Promise<void>;
}

export const ExecutionRoomView: React.FC<ExecutionRoomViewProps> = ({
  decision,
  tasks,
  onAddTask,
  onUpdateTaskStage,
}) => {
  const [selectedTask, setSelectedTask] = useState<ExecutionTask | null>(tasks[0] || null);
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newOwner, setNewOwner] = useState<string>('Sarah Jenkins (EVP)');
  const [newDeadline, setNewDeadline] = useState<string>('2027-02-28');
  const [newBudget, setNewBudget] = useState<number>(50000);
  const [newPriority, setNewPriority] = useState<ExecutionTask['priority']>('high');

  const stages: { id: ExecutionTask['stage']; label: string; color: string }[] = [
    { id: 'backlog', label: 'Backlog / Milestone Queue', color: '#777e80' },
    { id: 'in_progress', label: 'Active Execution Sprints', color: '#c0a477' },
    { id: 'review', label: 'Regulatory & Board Review', color: '#d6be99' },
    { id: 'completed', label: 'Ratified & Delivered', color: '#667f72' },
  ];

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await onAddTask({
      decisionId: decision?.id || '',
      title: newTitle.trim(),
      owner: newOwner.trim(),
      deadline: newDeadline,
      budgetAllocated: newBudget,
      priority: newPriority,
      stage: 'backlog',
      progressPercentage: 0,
    });

    setNewTitle('');
    setIsCreatingTask(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="mono text-xs font-bold text-[#c0a477] bg-[#c0a477]/15 px-2 py-0.5 rounded border border-[#c0a477]/30">
              EXECUTION ROOM // ACTION WORKSTREAMS
            </span>
            <span className="mono text-xs text-[#777e80]">
              DECISION: {decision?.code || 'DEC-2026-084'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#e7e2d9] tracking-tight">
            Workstream Kanban & Milestone Orchestration
          </h1>
          <p className="text-xs text-[#777e80] max-w-3xl leading-relaxed">
            Turn ratified decision recommendations into structured deliverables. Maintain explicit links between original strategic directives and execution progress.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingTask(true)}
          className="px-4 py-2 rounded bg-[#c0a477] hover:bg-[#d6be99] text-[#111315] font-semibold text-xs tracking-wider transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Execution Task</span>
        </button>
      </div>

      {/* Modal / Quick Form to Add Task */}
      {isCreatingTask && (
        <form
          onSubmit={handleCreateTask}
          className="p-5 rounded bg-[#202326] border border-[#c0a477]/40 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#c0a477]">NEW EXECUTION TASK</span>
            <button
              type="button"
              onClick={() => setIsCreatingTask(false)}
              className="text-xs text-[#777e80] hover:text-[#e7e2d9]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task Title (e.g. Execute Singapore Equinix peering SLA)"
              className="sm:col-span-2 bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
            />
            <input
              type="text"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              placeholder="Owner (e.g. Sarah Jenkins)"
              className="bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
            />
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-1.5 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#c0a477] text-[#111315] text-xs font-semibold"
            >
              Save Milestone Task
            </button>
          </div>
        </form>
      )}

      {/* 4-Stage Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const stageTasks = tasks.filter((t) => t.stage === stage.id);
          return (
            <div key={stage.id} className="p-4 rounded bg-[#202326] border border-[#e7e2d9]/10 flex flex-col space-y-3 min-h-[450px]">
              <div className="flex items-center justify-between pb-2 border-b border-[#e7e2d9]/10">
                <span className="mono text-xs font-semibold text-[#e7e2d9] flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                  <span>{stage.label}</span>
                </span>
                <span className="mono text-[10px] text-[#777e80] bg-[#111315] px-2 py-0.5 rounded">
                  {stageTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`p-3.5 rounded bg-[#111315] border cursor-pointer transition-all hover:border-[#c0a477]/50 space-y-2.5 ${
                      selectedTask?.id === task.id ? 'border-[#c0a477] shadow-lg' : 'border-[#e7e2d9]/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mono">
                      <span className="text-[#c0a477] font-semibold uppercase">{task.priority}</span>
                      <span className="text-[#777e80] flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{task.deadline}</span>
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-[#e7e2d9] leading-snug">{task.title}</div>

                    <div className="flex items-center justify-between text-[11px] text-[#777e80] pt-2 border-t border-[#e7e2d9]/5">
                      <span className="truncate max-w-[140px]">{task.owner}</span>
                      <span className="mono text-[#c0a477] font-semibold">
                        ${(task.budgetAllocated / 1000).toFixed(0)}k
                      </span>
                    </div>

                    {/* Stage Transition Buttons */}
                    <div className="flex items-center justify-between pt-1 text-[10px] mono text-[#777e80]">
                      {stage.id !== 'backlog' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const prevStage =
                              stage.id === 'completed' ? 'review' : stage.id === 'review' ? 'in_progress' : 'backlog';
                            onUpdateTaskStage(task.id, prevStage);
                          }}
                          className="hover:text-[#e7e2d9]"
                        >
                          ‹ Move Back
                        </button>
                      )}
                      {stage.id !== 'completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextStage =
                              stage.id === 'backlog' ? 'in_progress' : stage.id === 'in_progress' ? 'review' : 'completed';
                            onUpdateTaskStage(task.id, nextStage);
                          }}
                          className="hover:text-[#c0a477] ml-auto"
                        >
                          Advance ›
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

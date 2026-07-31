"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  UserCheck,
  Cpu,
  Lock,
  Unlock,
  BadgePercent,
  SlidersHorizontal,
  Briefcase,
} from "lucide-react";

interface MasterDataTabProps {
  trainers: string[];
  processes: string[];
  employeeTypes: string[];
  periodClosing: Record<string, boolean>;
  kpiConfig: {
    targetCompletionRate: number;
    maxTurnoverRate: number;
    targetDurationDays: number;
  };
  dashboardConfig: {
    showWorkloadChart: boolean;
    showRetentionChart: boolean;
    showKpiCards: boolean;
  };
  onUpdateData: (updatedFields: any) => void;
}

export default function MasterDataTab({
  trainers = [],
  processes = [],
  employeeTypes = [],
  periodClosing = {},
  kpiConfig = { targetCompletionRate: 90, maxTurnoverRate: 15.0, targetDurationDays: 7 },
  dashboardConfig = { showWorkloadChart: true, showRetentionChart: true, showKpiCards: true },
  onUpdateData,
}: MasterDataTabProps) {
  const [newTrainer, setNewTrainer] = useState("");
  const [newProcess, setNewProcess] = useState("");
  const [newEmpType, setNewEmpType] = useState("");

  // Period Closing toggle
  const handleTogglePeriod = (month: string) => {
    const updated = {
      ...periodClosing,
      [month]: !periodClosing[month],
    };
    onUpdateData({ periodClosing: updated });
  };

  // Trainer management
  const handleAddTrainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrainer.trim() || trainers.includes(newTrainer.trim())) return;
    onUpdateData({ trainers: [...trainers, newTrainer.trim()] });
    setNewTrainer("");
  };

  const handleRemoveTrainer = (name: string) => {
    onUpdateData({ trainers: trainers.filter((t) => t !== name) });
  };

  // Process management
  const handleAddProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProcess.trim() || processes.includes(newProcess.trim())) return;
    onUpdateData({ processes: [...processes, newProcess.trim()] });
    setNewProcess("");
  };

  const handleRemoveProcess = (name: string) => {
    onUpdateData({ processes: processes.filter((p) => p !== name) });
  };

  // Employee Types management
  const handleAddEmpType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpType.trim() || employeeTypes.includes(newEmpType.trim())) return;
    onUpdateData({ employeeTypes: [...employeeTypes, newEmpType.trim()] });
    setNewEmpType("");
  };

  const handleRemoveEmpType = (name: string) => {
    onUpdateData({ employeeTypes: employeeTypes.filter((et) => et !== name) });
  };

  // KPI Config changes
  const handleKpiChange = (field: string, val: number) => {
    onUpdateData({
      kpiConfig: {
        ...kpiConfig,
        [field]: val,
      },
    });
  };

  // Dashboard Config changes
  const handleDashConfigChange = (field: string, val: boolean) => {
    onUpdateData({
      dashboardConfig: {
        ...dashboardConfig,
        [field]: val,
      },
    });
  };

  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

  return (
    <div className="space-y-8">
      {/* SECTION 1: Period Closing & KPI Thresholds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Period Closing Master Data */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Period Closing Master Data</h3>
              <p className="text-xs text-neutral-400">Lock monthly periods to prevent unauthorized edits</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {months.map((m) => {
              const isClosed = periodClosing[m];
              return (
                <button
                  key={m}
                  onClick={() => handleTogglePeriod(m)}
                  className={`flex items-center justify-between p-3 rounded-xl text-xs font-medium border transition-all ${
                    isClosed
                      ? "bg-red-500/10 text-red-400 border-red-500/30"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  <span>{m} 2026</span>
                  {isClosed ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* KPI Configuration Target Limits */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <BadgePercent size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">KPI Targets Configuration</h3>
              <p className="text-xs text-neutral-400">Set target thresholds and benchmarks</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-neutral-300">Target Training Completion %</label>
              <input
                type="number"
                value={kpiConfig.targetCompletionRate || 90}
                onChange={(e) => handleKpiChange("targetCompletionRate", Number(e.target.value))}
                className="w-20 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-right text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs text-neutral-300">Max Allowed Turnover %</label>
              <input
                type="number"
                step="0.5"
                value={kpiConfig.maxTurnoverRate || 15.0}
                onChange={(e) => handleKpiChange("maxTurnoverRate", Number(e.target.value))}
                className="w-20 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-right text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs text-neutral-300">Target Training Duration (Days)</label>
              <input
                type="number"
                value={kpiConfig.targetDurationDays || 7}
                onChange={(e) => handleKpiChange("targetDurationDays", Number(e.target.value))}
                className="w-20 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-right text-xs text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Employee Types & Dashboard Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee Types Master Data */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <Briefcase size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Employee Types Config</h3>
              <p className="text-xs text-neutral-400">Manage employment categories (MTL, Subcontract, etc.)</p>
            </div>
          </div>

          <form onSubmit={handleAddEmpType} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. MTL (Permanent), OS (Subcontract)"
              value={newEmpType}
              onChange={(e) => setNewEmpType(e.target.value)}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Plus size={14} /> Add
            </button>
          </form>

          <div className="divide-y divide-neutral-800">
            {employeeTypes.map((et) => (
              <div key={et} className="flex justify-between items-center py-2 text-xs">
                <span className="font-medium text-white">{et}</span>
                <button
                  onClick={() => handleRemoveEmpType(et)}
                  className="p-1 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Display Options Config */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <SlidersHorizontal size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Dashboard Display Config</h3>
              <p className="text-xs text-neutral-400">Toggle dashboard widgets and visual panels</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50 border border-neutral-800 cursor-pointer">
              <span className="text-xs text-neutral-300">Show KPI Summary Cards</span>
              <input
                type="checkbox"
                checked={dashboardConfig.showKpiCards}
                onChange={(e) => handleDashConfigChange("showKpiCards", e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-neutral-900 border-neutral-700"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50 border border-neutral-800 cursor-pointer">
              <span className="text-xs text-neutral-300">Show Trainer Workload Chart</span>
              <input
                type="checkbox"
                checked={dashboardConfig.showWorkloadChart}
                onChange={(e) => handleDashConfigChange("showWorkloadChart", e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-neutral-900 border-neutral-700"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50 border border-neutral-800 cursor-pointer">
              <span className="text-xs text-neutral-300">Show Employee Retention Chart</span>
              <input
                type="checkbox"
                checked={dashboardConfig.showRetentionChart}
                onChange={(e) => handleDashConfigChange("showRetentionChart", e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-neutral-900 border-neutral-700"
              />
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 3: Trainers & Processes Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trainers Management */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Manage Trainers</h3>
              <p className="text-xs text-neutral-400">Add or remove trainer names available in dropdowns</p>
            </div>
          </div>

          <form onSubmit={handleAddTrainer} className="flex gap-2">
            <input
              type="text"
              placeholder="Trainer name (e.g. Jeerawan)"
              value={newTrainer}
              onChange={(e) => setNewTrainer(e.target.value)}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Plus size={14} /> Add
            </button>
          </form>

          <div className="divide-y divide-neutral-800">
            {trainers.map((t) => (
              <div key={t} className="flex justify-between items-center py-2 text-xs">
                <span className="font-medium text-white">{t}</span>
                <button
                  onClick={() => handleRemoveTrainer(t)}
                  className="p-1 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Processes Management */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Manage Processes</h3>
              <p className="text-xs text-neutral-400">Add or remove manufacturing/training processes</p>
            </div>
          </div>

          <form onSubmit={handleAddProcess} className="flex gap-2">
            <input
              type="text"
              placeholder="Process name (e.g. Reflow)"
              value={newProcess}
              onChange={(e) => setNewProcess(e.target.value)}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Plus size={14} /> Add
            </button>
          </form>

          <div className="divide-y divide-neutral-800">
            {processes.map((p) => (
              <div key={p} className="flex justify-between items-center py-2 text-xs">
                <span className="font-medium text-white">{p}</span>
                <button
                  onClick={() => handleRemoveProcess(p)}
                  className="p-1 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

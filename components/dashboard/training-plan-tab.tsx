"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit2, Filter, CheckCircle2, Clock } from "lucide-react";
import AddTraineeModal from "./add-trainee-modal";

interface TrainingPlanTabProps {
  trainees: any[];
  trainers: string[];
  processes: string[];
  onUpdateTrainees: (trainees: any[]) => void;
}

export default function TrainingPlanTab({
  trainees,
  trainers,
  processes,
  onUpdateTrainees,
}: TrainingPlanTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("ALL");
  const [selectedProcess, setSelectedProcess] = useState("ALL");
  const [selectedShift, setSelectedShift] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTrainee = (newTrainee: any) => {
    onUpdateTrainees([newTrainee, ...trainees]);
  };

  const handleDeleteTrainee = (id: string) => {
    onUpdateTrainees(trainees.filter((t) => t.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    onUpdateTrainees(
      trainees.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "Completed" ? "In Progress" : "Completed",
            }
          : t
      )
    );
  };

  const filteredTrainees = trainees.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.includes(searchTerm) ||
      t.process.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrainer = selectedTrainer === "ALL" || t.trainer === selectedTrainer;
    const matchesProcess = selectedProcess === "ALL" || t.process === selectedProcess;
    const matchesShift = selectedShift === "ALL" || t.shift === selectedShift;
    return matchesSearch && matchesTrainer && matchesProcess && matchesShift;
  });

  return (
    <div className="space-y-6">
      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search name, code, process..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-neutral-400" />
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Trainers</option>
              {trainers.map((tr) => (
                <option key={tr} value={tr}>
                  {tr}
                </option>
              ))}
            </select>

            <select
              value={selectedProcess}
              onChange={(e) => setSelectedProcess(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Processes</option>
              {processes.map((pr) => (
                <option key={pr} value={pr}>
                  {pr}
                </option>
              ))}
            </select>

            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Shifts</option>
              <option value="A">Shift A</option>
              <option value="B">Shift B</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Add Trainee
        </button>
      </div>

      {/* Trainees Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-400 uppercase bg-neutral-800/60 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Code & Name</th>
                <th className="px-6 py-4 font-medium">Process</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Shift</th>
                <th className="px-6 py-4 font-medium">Dates</th>
                <th className="px-6 py-4 font-medium">Trainer</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredTrainees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-neutral-500">
                    No training records found.
                  </td>
                </tr>
              ) : (
                filteredTrainees.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-neutral-800/40 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-neutral-400">ID: {t.code || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-blue-300">{t.process}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium border ${
                          t.trainType === "New OP"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {t.trainType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-300">
                      Shift {t.shift}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-400 space-y-0.5">
                      <div>Start: {t.startDate}</div>
                      <div>Eval: {t.evalDate}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-200">
                      {t.trainer}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(t.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                          t.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                        }`}
                      >
                        {t.status === "Completed" ? (
                          <>
                            <CheckCircle2 size={13} /> Completed
                          </>
                        ) : (
                          <>
                            <Clock size={13} /> In Progress
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteTrainee(t.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Trainee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddTraineeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTrainee}
        trainers={trainers}
        processes={processes}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface AddTraineeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (trainee: any) => void;
  trainers: string[];
  processes: string[];
}

export default function AddTraineeModal({
  isOpen,
  onClose,
  onAdd,
  trainers,
  processes,
}: AddTraineeModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    process: processes[0] || "Reflow",
    trainType: "New OP",
    duration: 7,
    startDate: new Date().toISOString().split("T")[0],
    evalDate: "",
    trainer: trainers[0] || "Jeerawan",
    shift: "A",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    // Calculate eval date if not set
    let evalD = formData.evalDate;
    if (!evalD && formData.startDate) {
      const d = new Date(formData.startDate);
      d.setDate(d.getDate() + (Number(formData.duration) || 7));
      evalD = d.toISOString().split("T")[0];
    }

    onAdd({
      ...formData,
      id: Date.now().toString(),
      evalDate: evalD,
      status: "In Progress",
    });

    setFormData({
      code: "",
      name: "",
      process: processes[0] || "Reflow",
      trainType: "New OP",
      duration: 7,
      startDate: new Date().toISOString().split("T")[0],
      evalDate: "",
      trainer: trainers[0] || "Jeerawan",
      shift: "A",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800">
          <h3 className="text-lg font-semibold text-white">Add New Trainee</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Employee Code (รหัส)
              </label>
              <input
                type="text"
                placeholder="e.g. 30327"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Employee Name (ชื่อ) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. UNCHALEE"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Process (กระบวนการ)
              </label>
              <select
                value={formData.process}
                onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {processes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Training Type (ประเภทการ train)
              </label>
              <select
                value={formData.trainType}
                onChange={(e) => setFormData({ ...formData, trainType: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="New OP">New OP</option>
                <option value="Up skill">Up skill</option>
                <option value="Cross skill">Cross skill</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: Number(e.target.value) })
                }
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Trainer (ผู้ฝึกสอน)
              </label>
              <select
                value={formData.trainer}
                onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {trainers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Shift (กะ)
              </label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="A">Shift A</option>
                <option value="B">Shift B</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Start Date (วันที่เริ่ม)
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Evaluation Date (วันครบประเมิน)
              </label>
              <input
                type="date"
                value={formData.evalDate}
                onChange={(e) => setFormData({ ...formData, evalDate: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Add Trainee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

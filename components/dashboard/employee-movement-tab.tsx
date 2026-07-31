"use client";

import React, { useState } from "react";
import { UserPlus, UserMinus, Plus, Trash2, TrendingDown } from "lucide-react";

interface EmployeeMovementTabProps {
  movements: any[];
  onUpdateMovements: (movements: any[]) => void;
}

export default function EmployeeMovementTab({
  movements,
  onUpdateMovements,
}: EmployeeMovementTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    dateIn: new Date().toISOString().split("T")[0],
    shift: "A",
    gender: "Male",
    group: "MTL",
    countIn: 1,
    countOut: 0,
    dateOut: "",
  });

  const totalIn = movements.reduce((acc, m) => acc + (Number(m.countIn) || 0), 0);
  const totalOut = movements.reduce((acc, m) => acc + (Number(m.countOut) || 0), 0);
  const turnoverRate = totalIn > 0 ? ((totalOut / totalIn) * 100).toFixed(1) : "0.0";

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = {
      ...formData,
      id: Date.now().toString(),
    };
    onUpdateMovements([newRecord, ...movements]);
    setIsModalOpen(false);
  };

  const handleDeleteRecord = (id: string) => {
    onUpdateMovements(movements.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <UserPlus size={24} />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Total New Joiners (เข้าสะสม)</div>
            <div className="text-3xl font-bold text-white mt-1">{totalIn}</div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
            <UserMinus size={24} />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Total Resignations (ออกสะสม)</div>
            <div className="text-3xl font-bold text-white mt-1">{totalOut}</div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
            <TrendingDown size={24} />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-medium">Turnover Rate (% ออกสะสม)</div>
            <div className="text-3xl font-bold text-amber-400 mt-1">{turnoverRate}%</div>
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
        <h3 className="text-lg font-semibold text-white">Employee Entry & Exit Log</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Record Movement
        </button>
      </div>

      {/* Movement Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-400 uppercase bg-neutral-800/60 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Date In</th>
                <th className="px-6 py-4 font-medium">Shift</th>
                <th className="px-6 py-4 font-medium">Gender</th>
                <th className="px-6 py-4 font-medium">Group</th>
                <th className="px-6 py-4 font-medium text-emerald-400">In Count</th>
                <th className="px-6 py-4 font-medium text-red-400">Out Count</th>
                <th className="px-6 py-4 font-medium">Date Out</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-neutral-500">
                    No movement records found.
                  </td>
                </tr>
              ) : (
                movements.map((m) => (
                  <tr key={m.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{m.dateIn}</td>
                    <td className="px-6 py-4 text-neutral-300">Shift {m.shift}</td>
                    <td className="px-6 py-4 text-neutral-300">{m.gender}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {m.group}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">+{m.countIn}</td>
                    <td className="px-6 py-4 font-bold text-red-400">-{m.countOut}</td>
                    <td className="px-6 py-4 text-neutral-400">{m.dateOut || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteRecord(m.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Record"
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

      {/* Add Movement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Record Employee Movement</h3>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Date In</label>
                <input
                  type="date"
                  required
                  value={formData.dateIn}
                  onChange={(e) => setFormData({ ...formData, dateIn: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Shift</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                  >
                    <option value="A">Shift A</option>
                    <option value="B">Shift B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Group</label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                  >
                    <option value="MTL">MTL</option>
                    <option value="OS">OS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">In Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.countIn}
                    onChange={(e) => setFormData({ ...formData, countIn: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Out Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.countOut}
                    onChange={(e) => setFormData({ ...formData, countOut: Number(e.target.value) })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Date Out (Optional)</label>
                  <input
                    type="date"
                    value={formData.dateOut}
                    onChange={(e) => setFormData({ ...formData, dateOut: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
                >
                  Save Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

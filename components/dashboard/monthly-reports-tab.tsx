"use client";

import React, { useState } from "react";
import { Plus, Trash2, Save, FileText } from "lucide-react";

interface MonthlyReportsTabProps {
  reports: Record<string, { title: string; items: any[] }>;
  onUpdateReports: (reports: any) => void;
}

export default function MonthlyReportsTab({
  reports,
  onUpdateReports,
}: MonthlyReportsTabProps) {
  const [activeCategory, setActiveCategory] = useState<string>("page1");
  const [newItemName, setNewItemName] = useState("");

  const categories = [
    { key: "page1", label: "1. New Comer Income" },
    { key: "page2", label: "2. Yearly Training" },
    { key: "page3", label: "3. VOE & Kaizen" },
    { key: "page4", label: "4. SOP Control" },
    { key: "page5", label: "5. OPS" },
  ];

  const currentReport = reports[activeCategory] || {
    title: "Category",
    items: [],
  };

  const handleValueChange = (itemId: string, month: string, val: number) => {
    const updatedItems = currentReport.items.map((item) => {
      if (item.id === itemId) {
        return { ...item, [month]: val };
      }
      return item;
    });

    onUpdateReports({
      ...reports,
      [activeCategory]: {
        ...currentReport,
        items: updatedItems,
      },
    });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      name: newItemName,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
    };

    onUpdateReports({
      ...reports,
      [activeCategory]: {
        ...currentReport,
        items: [...currentReport.items, newItem],
      },
    });

    setNewItemName("");
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = currentReport.items.filter((i) => i.id !== itemId);
    onUpdateReports({
      ...reports,
      [activeCategory]: {
        ...currentReport,
        items: updatedItems,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Category Sub-nav */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              activeCategory === cat.key
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
            }`}
          >
            <FileText size={16} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Add Item Form */}
      <form
        onSubmit={handleAddItem}
        className="flex gap-3 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl"
      >
        <input
          type="text"
          placeholder={`Add new item to ${currentReport.title}...`}
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Add Item
        </button>
      </form>

      {/* Report Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-400 uppercase bg-neutral-800/60 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium min-w-[200px]">Item / Topic</th>
                <th className="px-4 py-4 font-medium text-center">Apr</th>
                <th className="px-4 py-4 font-medium text-center">May</th>
                <th className="px-4 py-4 font-medium text-center">Jun</th>
                <th className="px-4 py-4 font-medium text-center">Jul</th>
                <th className="px-4 py-4 font-medium text-center">Aug</th>
                <th className="px-4 py-4 font-medium text-center">Sep</th>
                <th className="px-4 py-4 font-medium text-center text-blue-400">TOTAL</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {currentReport.items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-neutral-500">
                    No items in this category yet.
                  </td>
                </tr>
              ) : (
                currentReport.items.map((item) => {
                  const total =
                    (Number(item.apr) || 0) +
                    (Number(item.may) || 0) +
                    (Number(item.jun) || 0) +
                    (Number(item.jul) || 0) +
                    (Number(item.aug) || 0) +
                    (Number(item.sep) || 0);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {item.name}
                      </td>

                      {["apr", "may", "jun", "jul", "aug", "sep"].map((month) => (
                        <td key={month} className="px-2 py-3 text-center">
                          <input
                            type="number"
                            value={item[month] ?? 0}
                            onChange={(e) =>
                              handleValueChange(
                                item.id,
                                month,
                                Number(e.target.value)
                              )
                            }
                            className="w-16 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-center text-white text-xs focus:outline-none focus:border-blue-500"
                          />
                        </td>
                      ))}

                      <td className="px-4 py-4 font-bold text-center text-blue-400">
                        {total}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

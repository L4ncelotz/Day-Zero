"use client";

import React, { useState } from "react";
import { Milestone } from "@/lib/countdown/types";
import { Button } from "@/components/ui/button";

interface MilestoneFormProps {
  initialData?: Milestone | null;
  onSubmit: (data: Omit<Milestone, "id">) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MilestoneForm({ initialData, onSubmit, onCancel, isLoading }: MilestoneFormProps) {
  const [date, setDate] = useState(initialData?.date || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isCompleted, setIsCompleted] = useState(initialData?.isCompleted ?? false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ date, title, description, isCompleted });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">
          Date (e.g. "1 November 2025")
        </label>
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-line rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-surface border border-line rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-surface border border-line rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isCompleted"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
          className="w-4 h-4 rounded border-line bg-surface accent-accent cursor-pointer"
        />
        <label htmlFor="isCompleted" className="text-sm text-text-primary cursor-pointer select-none">
          Mark as Completed (สำเร็จแล้ว)
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-line mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          ยกเลิก
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-accent text-black hover:bg-accent/90"
        >
          {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </Button>
      </div>
    </form>
  );
}

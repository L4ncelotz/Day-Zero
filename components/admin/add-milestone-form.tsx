"use client";

import React, { useState } from "react";
import { Milestone } from "@/lib/countdown/types";
import { addMilestoneAction } from "@/app/control-room/actions";
import { MilestoneForm } from "./milestone-form";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface AddMilestoneFormProps {
  usingFallback?: boolean;
}

export function AddMilestoneForm({ usingFallback = false }: AddMilestoneFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Omit<Milestone, "id">) => {
    if (usingFallback) {
      setError("ระบบทำงานในโหมด Fallback (ไม่ได้เชื่อมต่อ Upstash Redis) ไม่อนุญาตให้แก้ไขข้อมูล");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await addMilestoneAction(data);
      if (res.success) {
        toast.success("เพิ่ม Milestone ใหม่สำเร็จ");
        setIsExpanded(false); // Close the form on success
      } else {
        setError(res.error || "บันทึกไม่สำเร็จ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        disabled={usingFallback}
        className="w-full flex items-center justify-center gap-2 py-4 mt-6 border-2 border-dashed border-line rounded-2xl text-text-secondary hover:text-text-primary hover:border-accent hover:bg-surface-elevated transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm font-medium">เพิ่ม Milestone ใหม่</span>
      </button>
    );
  }

  return (
    <div className="mt-6 p-6 bg-surface border border-line rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Plus className="h-4 w-4 text-accent" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary">ฟอร์มเพิ่ม Milestone</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg">
          {error}
        </div>
      )}

      <MilestoneForm
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsExpanded(false);
          setError(null);
        }}
        isLoading={isSubmitting}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Milestone } from "@/lib/countdown/types";
import { editMilestoneAction } from "@/app/control-room/actions";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MilestoneForm } from "./milestone-form";
import { toast } from "sonner";

interface EditMilestoneDialogProps {
  milestone: Milestone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usingFallback?: boolean;
}

export function EditMilestoneDialog({
  milestone,
  open,
  onOpenChange,
  usingFallback,
}: EditMilestoneDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Omit<Milestone, "id">) => {
    if (!milestone) return;

    if (usingFallback) {
      setError("ระบบทำงานในโหมด Fallback (ไม่ได้เชื่อมต่อ Upstash Redis) ไม่อนุญาตให้แก้ไขข้อมูล");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await editMilestoneAction({ ...data, id: milestone.id });
      if (res.success) {
        toast.success("อัปเดต Milestone สำเร็จ");
        onOpenChange(false);
      } else {
        setError(res.error || "บันทึกไม่สำเร็จ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>แก้ไข Milestone</DialogTitle>
      </DialogHeader>

      {error && (
        <div className="p-3 mb-4 text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg">
          {error}
        </div>
      )}

      {milestone && (
        <MilestoneForm
          initialData={milestone}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isSubmitting}
        />
      )}
    </Dialog>
  );
}

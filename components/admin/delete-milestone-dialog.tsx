"use client";

import React, { useState } from "react";
import { Milestone } from "@/lib/countdown/types";
import { deleteMilestoneAction } from "@/app/control-room/actions";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

interface DeleteMilestoneDialogProps {
  milestone: Milestone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usingFallback?: boolean;
}

export function DeleteMilestoneDialog({
  milestone,
  open,
  onOpenChange,
  usingFallback,
}: DeleteMilestoneDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!milestone) return;

    if (usingFallback) {
      setError("ระบบทำงานในโหมด Fallback ไม่อนุญาตให้แก้ไขข้อมูล");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await deleteMilestoneAction(milestone.id);
      if (res.success) {
        toast.success("ลบ Milestone สำเร็จ");
        onOpenChange(false);
      } else {
        setError(res.error || "ลบไม่สำเร็จ");
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
        <DialogTitle className="flex items-center gap-2 text-danger">
          <AlertTriangle className="h-5 w-5" />
          ยืนยันการลบ Milestone
        </DialogTitle>
        <DialogDescription>
          คุณต้องการลบ Milestone <strong>"{milestone?.title}"</strong> ใช่หรือไม่?
          การกระทำนี้ไม่สามารถย้อนกลับได้
        </DialogDescription>
      </DialogHeader>

      {error && (
        <div className="mt-4 p-3 text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-line">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
        >
          ยกเลิก
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          {isSubmitting ? "กำลังลบ..." : "ลบข้อมูล"}
        </Button>
      </div>
    </Dialog>
  );
}


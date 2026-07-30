"use client";

import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScheduleOverride } from "@/lib/countdown/types";
import { deleteOverrideAction } from "@/app/control-room/actions";
import { toast } from "sonner";

interface DeleteOverrideDialogProps {
  override: ScheduleOverride | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usingFallback?: boolean;
}

export function DeleteOverrideDialog({
  override,
  open,
  onOpenChange,
  usingFallback = false,
}: DeleteOverrideDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!override) return null;

  const handleDelete = async () => {
    if (usingFallback) {
      toast.error("ระบบอยู่ในโหมด Fallback ไม่อนุญาตให้แก้ไขข้อมูล");
      return;
    }

    setLoading(true);
    try {
      const res = await deleteOverrideAction(override.id);
      if (!res.success) {
        toast.error(res.error || "ลบไม่สำเร็จ");
      } else {
        toast.success("ลบรายการยกเว้นเรียบร้อยแล้ว");
        onOpenChange(false);
      }
    } catch {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="text-danger">ยืนยันการลบรายการยกเว้น</DialogTitle>
        <DialogDescription>
          คุณต้องการลบรายการวันยกเว้นสำหรับวันที่ <strong>{override.date}</strong> ({override.label}) ใช่หรือไม่? ระบบจะกลับไปใช้วันทำงานตามปฏิทินมาตรฐาน
        </DialogDescription>
      </DialogHeader>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenChange(false)}
          className="rounded-xl text-xs"
        >
          ยกเลิก
        </Button>
        <Button
          variant="danger"
          size="sm"
          disabled={loading}
          onClick={handleDelete}
          className="rounded-xl text-xs"
        >
          {loading ? "กำลังลบ..." : "ยืนยันการลบ"}
        </Button>
      </div>
    </Dialog>
  );
}

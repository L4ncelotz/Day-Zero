"use client";

import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScheduleOverride, ScheduleStatus } from "@/lib/countdown/types";
import { editOverrideAction } from "@/app/control-room/actions";
import { toast } from "sonner";

interface EditOverrideDialogProps {
  override: ScheduleOverride | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usingFallback?: boolean;
}

export function EditOverrideDialog({
  override,
  open,
  onOpenChange,
  usingFallback = false,
}: EditOverrideDialogProps) {
  const [status, setStatus] = useState<ScheduleStatus>(override?.status || "holiday");
  const [label, setLabel] = useState(override?.label || "");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (override) {
      setStatus(override.status);
      setLabel(override.label);
    }
  }, [override]);

  if (!override) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usingFallback) {
      toast.error("ระบบอยู่ในโหมด Fallback ไม่อนุญาตให้แก้ไขข้อมูล");
      return;
    }

    setLoading(true);
    try {
      const res = await editOverrideAction({
        ...override,
        status,
        label: label.trim() || (status === "working" ? "ทำงานพิเศษ" : "วันหยุด"),
      });

      if (!res.success) {
        toast.error(res.error || "แก้ไขไม่สำเร็จ");
      } else {
        toast.success("แก้ไขข้อมูลเรียบร้อยแล้ว");
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
        <DialogTitle>แก้ไขวันยกเว้น ({override.date})</DialogTitle>
        <DialogDescription>ปรับปรุงประเภทวันหรือคำอธิบายสำหรับวันที่เลือก</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 my-2">
        <div className="space-y-1">
          <label className="text-xs text-text-tertiary">ประเภท</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ScheduleStatus)}
            className="w-full px-3 py-2 rounded-xl border border-line bg-surface-elevated text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="holiday">วันหยุดพิเศษ (Holiday)</option>
            <option value="working">วันทำงานพิเศษ (Working Day)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-text-tertiary">คำอธิบายเพิ่มเติม</label>
          <input
            type="text"
            maxLength={80}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line bg-surface-elevated text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            ยกเลิก
          </Button>
          <Button type="submit" size="sm" disabled={loading} className="rounded-xl text-xs">
            {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

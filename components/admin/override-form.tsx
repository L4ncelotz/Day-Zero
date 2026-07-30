"use client";

import React, { useState } from "react";
import { addOverrideAction } from "@/app/control-room/actions";
import { Button } from "@/components/ui/button";
import { COUNTDOWN_CONFIG } from "@/lib/config";
import { parseDateOnly, formatDisplayDate } from "@/lib/countdown/dates";
import { ScheduleStatus } from "@/lib/countdown/types";
import { Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface OverrideFormProps {
  usingFallback?: boolean;
}

export function OverrideForm({ usingFallback = false }: OverrideFormProps) {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<ScheduleStatus>("holiday");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDate(val);
    setErrorMsg("");

    if (val) {
      const dateObj = parseDateOnly(val);
      const day = dateObj.getDay();
      // Auto suggest: weekend -> working, weekday -> holiday
      if (day === 0 || day === 6) {
        setStatus("working");
      } else {
        setStatus("holiday");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usingFallback) {
      toast.error("ระบบอยู่ในโหมด Fallback ไม่อนุญาตให้แก้ไขข้อมูล");
      return;
    }
    if (!date) {
      setErrorMsg("กรุณาเลือกวันที่");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await addOverrideAction({
        date,
        status,
        label: label.trim() || (status === "working" ? "วันหยุดสุดสัปดาห์ทำงานพิเศษ" : "วันหยุดพิเศษ"),
      });

      if (!res.success) {
        setErrorMsg(res.error || "เกิดข้อผิดพลาด");
        toast.error(res.error || "บันทึกไม่สำเร็จ");
      } else {
        toast.success("เพิ่มวันยกเว้นเรียบร้อยแล้ว");
        setDate("");
        setLabel("");
      }
    } catch {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  const dayNameText = date ? formatDisplayDate(date, { format: "dayName" }) : "";

  return (
    <div className="p-5 rounded-2xl border border-line bg-surface space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Plus className="h-4 w-4 text-accent" /> เพิ่มวันยกเว้นตารางงาน
        </h2>
        {date && (
          <span className="text-xs font-mono text-accent">
            {dayNameText} {formatDisplayDate(date, { format: "short" })}
          </span>
        )}
      </div>

      {usingFallback && (
        <div className="p-3 rounded-xl border border-warning/30 bg-warning/10 text-warning text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            <strong>โหมด Fallback:</strong> การแก้ไขถูกระงับชั่วคราวเนื่องจากไม่ได้เชื่อมต่อ Upstash Redis Database
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs text-text-tertiary">วันที่ (YYYY-MM-DD)</label>
          <input
            type="date"
            min={COUNTDOWN_CONFIG.startDate}
            max={COUNTDOWN_CONFIG.endDate}
            value={date}
            onChange={handleDateChange}
            disabled={usingFallback || loading}
            required
            className="w-full px-3 py-2 rounded-xl border border-line bg-surface-elevated text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-text-tertiary">ประเภท</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ScheduleStatus)}
            disabled={usingFallback || loading}
            className="w-full px-3 py-2 rounded-xl border border-line bg-surface-elevated text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
          >
            <option value="holiday">วันหยุดพิเศษ (Holiday — Mon–Fri)</option>
            <option value="working">วันหยุดสุดสัปดาห์ทำงานพิเศษ (Weekend Working Day)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-text-tertiary">คำอธิบายเพิ่มเติม (Optional)</label>
          <input
            type="text"
            placeholder="เช่น วันหยุดบริษัท, เสาร์ทำงาน"
            maxLength={80}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            disabled={usingFallback || loading}
            className="w-full px-3 py-2 rounded-xl border border-line bg-surface-elevated text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
          />
        </div>

        {errorMsg && (
          <div className="col-span-full text-xs text-danger font-medium pt-1">
            {errorMsg}
          </div>
        )}

        <div className="col-span-full flex justify-end pt-2">
          <Button type="submit" disabled={usingFallback || loading || !date} size="sm" className="rounded-xl">
            {loading ? "กำลังบันทึก..." : "บันทึกวันยกเว้น"}
          </Button>
        </div>
      </form>
    </div>
  );
}

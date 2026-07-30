import { Metadata } from "next";
import { verifyAdminSession } from "@/lib/auth/session";
import { getSchedule } from "@/lib/schedule/repository";
import { calculateCountdown } from "@/lib/countdown/calculate";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminHeader } from "@/components/admin/admin-header";
import { ScheduleSummary } from "@/components/admin/schedule-summary";
import { OverrideForm } from "@/components/admin/override-form";
import { OverrideTable } from "@/components/admin/override-table";
import { AlertTriangle } from "lucide-react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Schedule Control Room — Internship Countdown",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function ControlRoomPage() {
  const isAuthenticated = await verifyAdminSession();

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  const { data: scheduleData, usingFallback } = await getSchedule();
  const calculation = calculateCountdown(scheduleData, undefined, usingFallback);

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 sm:p-8">
      <Toaster position="bottom-right" theme="dark" />
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <AdminHeader lastUpdatedAt={scheduleData.lastUpdatedAt} />

        {/* Fallback Warning Notice ONLY inside /control-room */}
        {usingFallback && (
          <div className="p-4 rounded-2xl border border-warning/40 bg-warning/10 text-warning text-xs space-y-1">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>โหมดสำรองข้อมูล (Baseline Fallback Active)</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              ไม่ได้ระบุค่าตัวแปรสภาพแวดล้อม <code className="font-mono text-warning">UPSTASH_REDIS_REST_URL</code> หรือ <code className="font-mono text-warning">UPSTASH_REDIS_REST_TOKEN</code> ในสภาพแวดล้อมระบบ 
              หน้า Public Countdown ยังคงคำนวณวันตามปฏิทินมาตรฐานได้ปกติ แต่ระบบปิดรับการแก้ไขข้อมูลชั่วคราวเพื่อป้องกันข้อผิดพลาด
            </p>
          </div>
        )}

        <ScheduleSummary
          totalWorkingDays={calculation.totalWorkingDays}
          overrides={scheduleData.overrides}
        />

        <OverrideForm usingFallback={usingFallback} />

        <OverrideTable
          overrides={scheduleData.overrides}
          usingFallback={usingFallback}
        />
      </div>
    </div>
  );
}

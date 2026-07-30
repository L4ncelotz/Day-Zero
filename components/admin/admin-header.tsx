"use client";

import React from "react";
import { logoutAction } from "@/app/control-room/actions";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldCheck } from "lucide-react";
import { formatDisplayDate } from "@/lib/countdown/dates";

interface AdminHeaderProps {
  lastUpdatedAt: string;
}

export function AdminHeader({ lastUpdatedAt }: AdminHeaderProps) {
  const formattedDate = lastUpdatedAt
    ? formatDisplayDate(lastUpdatedAt.split("T")[0], { format: "full" })
    : "29 July 2026";

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-accent" />
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Schedule Control Room
          </h1>
        </div>
        <p className="text-xs text-text-tertiary">
          อัปเดตล่าสุด: <span className="font-mono text-text-secondary">{formattedDate}</span>
        </p>
      </div>

      <form action={logoutAction}>
        <Button variant="outline" size="sm" type="submit" className="rounded-xl text-xs">
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
          ออกจากระบบ
        </Button>
      </form>
    </header>
  );
}

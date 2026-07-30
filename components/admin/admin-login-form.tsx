"use client";

import React, { useActionState } from "react";
import { loginAction } from "@/app/control-room/actions";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-text-primary">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-surface-elevated text-accent mb-1 border border-line">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Schedule Control Room</h1>
          <p className="text-xs text-text-tertiary">
            กรุณาใส่รหัสผ่านเพื่อเข้าสู่ระบบจัดการวันนับถอยหลัง
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-1">
            <input
              type="password"
              name="password"
              placeholder="รหัสผ่าน"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface-elevated text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent text-sm"
            />
            {state?.error && (
              <p className="text-xs text-danger pt-1 font-medium">{state.error}</p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full rounded-xl">
            {isPending ? (
              "กำลังเข้าสู่ระบบ..."
            ) : (
              <>
                เข้าสู่ระบบ <ArrowRight className="h-4 w-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

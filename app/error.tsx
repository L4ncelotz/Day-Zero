"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center space-y-4">
      <div className="text-sm font-mono text-danger">เกิดข้อผิดพลาดในการโหลดระบบ</div>
      <p className="text-xs text-text-tertiary max-w-xs">
        {error.message || "ไม่สามารถดึงข้อมูลวันนับถอยหลังได้ในขณะนี้"}
      </p>
      <Button variant="outline" size="sm" onClick={() => reset()} className="rounded-xl">
        ลองใหม่อีกครั้ง
      </Button>
    </div>
  );
}

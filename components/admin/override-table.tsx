"use client";

import React, { useState } from "react";
import { ScheduleOverride } from "@/lib/countdown/types";
import { formatDisplayDate } from "@/lib/countdown/dates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, CalendarX } from "lucide-react";
import { EditOverrideDialog } from "./edit-override-dialog";
import { DeleteOverrideDialog } from "./delete-override-dialog";

interface OverrideTableProps {
  overrides: ScheduleOverride[];
  usingFallback?: boolean;
}

export function OverrideTable({ overrides, usingFallback = false }: OverrideTableProps) {
  const [editingItem, setEditingItem] = useState<ScheduleOverride | null>(null);
  const [deletingItem, setDeletingItem] = useState<ScheduleOverride | null>(null);

  const sortedOverrides = [...overrides].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">
          รายการวันยกเว้นทั้งหมด ({sortedOverrides.length})
        </h2>
      </div>

      {sortedOverrides.length === 0 ? (
        <div className="p-8 rounded-2xl border border-line bg-surface text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-surface-elevated text-text-tertiary">
            <CalendarX className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-text-primary">ยังไม่มีวันยกเว้น</h3>
            <p className="text-xs text-text-tertiary max-w-sm mx-auto">
              ระบบกำลังนับวันจันทร์–ศุกร์เป็นวันทำงานตามปฏิทินมาตรฐานโดยอัตโนมัติ
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-surface-elevated text-text-tertiary font-mono uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Label</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-text-secondary">
                {sortedOverrides.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-text-primary">
                      {item.date}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {formatDisplayDate(item.date, { format: "dayName" })}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={item.status === "working" ? "working" : "holiday"}>
                        {item.status === "working" ? "ทำงานพิเศษ" : "วันหยุด"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{item.label}</td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingItem(item)}
                        disabled={usingFallback}
                        className="min-h-[44px] min-w-[44px] rounded-lg text-text-tertiary hover:text-text-primary"
                        aria-label="Edit item"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingItem(item)}
                        disabled={usingFallback}
                        className="min-h-[44px] min-w-[44px] rounded-lg text-text-tertiary hover:text-danger"
                        aria-label="Delete item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dialog Modals */}
      <EditOverrideDialog
        override={editingItem}
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        usingFallback={usingFallback}
      />

      <DeleteOverrideDialog
        override={deletingItem}
        open={!!deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        usingFallback={usingFallback}
      />
    </div>
  );
}

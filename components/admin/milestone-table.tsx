"use client";

import React, { useState } from "react";
import { Milestone } from "@/lib/countdown/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Milestone as MilestoneIcon } from "lucide-react";
import { EditMilestoneDialog } from "./edit-milestone-dialog";
import { DeleteMilestoneDialog } from "./delete-milestone-dialog";

interface MilestoneTableProps {
  milestones: Milestone[];
  usingFallback?: boolean;
}

export function MilestoneTable({ milestones, usingFallback = false }: MilestoneTableProps) {
  const [editingItem, setEditingItem] = useState<Milestone | null>(null);
  const [deletingItem, setDeletingItem] = useState<Milestone | null>(null);

  // Milestones are automatically sorted by the backend based on original creation date or custom order if needed.
  // We just display them as-is.

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">
          รายการ Timeline Milestones ({milestones.length})
        </h2>
      </div>

      {milestones.length === 0 ? (
        <div className="p-8 rounded-2xl border border-line bg-surface text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-surface-elevated text-text-tertiary">
            <MilestoneIcon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-text-primary">ยังไม่มีข้อมูล Milestone</h3>
            <p className="text-xs text-text-tertiary max-w-sm mx-auto">
              กดเพิ่ม Milestone เพื่อให้มีข้อมูลแสดงบน Timeline หน้าเว็บ
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-surface-elevated text-text-tertiary font-mono uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-[20%]">Date</th>
                  <th className="py-3 px-4 w-[25%]">Title</th>
                  <th className="py-3 px-4 w-[35%]">Description</th>
                  <th className="py-3 px-4 w-[10%]">Status</th>
                  <th className="py-3 px-4 w-[10%] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-text-secondary">
                {milestones.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-text-primary">
                      {item.date}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 text-text-tertiary truncate max-w-[200px]" title={item.description}>
                      {item.description}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={item.isCompleted ? "working" : "holiday"}>
                        {item.isCompleted ? "สำเร็จแล้ว" : "ยังไม่ถึง"}
                      </Badge>
                    </td>
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
      <EditMilestoneDialog
        milestone={editingItem}
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        usingFallback={usingFallback}
      />

      <DeleteMilestoneDialog
        milestone={deletingItem}
        open={!!deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        usingFallback={usingFallback}
      />
    </div>
  );
}

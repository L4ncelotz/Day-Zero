import React from "react";
import { LayoutDashboard, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            KPI Dashboard
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Training & Operations</p>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link 
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 transition-all"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">KPI System</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-800 text-xs text-neutral-500 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span>System Online & Synced</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-neutral-950 relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import TrainingPlanTab from "@/components/dashboard/training-plan-tab";
import EmployeeMovementTab from "@/components/dashboard/employee-movement-tab";
import MonthlyReportsTab from "@/components/dashboard/monthly-reports-tab";
import MasterDataTab from "@/components/dashboard/master-data-tab";

import {
  Users,
  TrendingUp,
  BookOpen,
  AlertCircle,
  Download,
  Save,
  LayoutDashboard,
  CalendarCheck,
  UserPlus,
  FileSpreadsheet,
  Settings,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import * as XLSX from "xlsx";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch initial data from API
  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data", err);
        setLoading(false);
      });
  }, []);

  const saveData = async (newData: any) => {
    setData(newData);
    setSaving(true);
    try {
      await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
    } catch (err) {
      console.error("Failed to save data", err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportExcel = () => {
    if (!data) return;

    const wb = XLSX.utils.book_new();

    // Trainees Sheet
    const wsTrainees = XLSX.utils.json_to_sheet(data.trainees || []);
    XLSX.utils.book_append_sheet(wb, wsTrainees, "Training Plan");

    // Movements Sheet
    const wsMovements = XLSX.utils.json_to_sheet(data.movements || []);
    XLSX.utils.book_append_sheet(wb, wsMovements, "Employee Movement");

    // Monthly Reports
    if (data.monthlyReports) {
      Object.entries(data.monthlyReports).forEach(([key, val]: any) => {
        const ws = XLSX.utils.json_to_sheet(val.items || []);
        XLSX.utils.book_append_sheet(wb, ws, val.title || key);
      });
    }

    XLSX.writeFile(wb, "KPI_Dashboard_Export.xlsx");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-neutral-400">Loading KPI System Data...</p>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const trainees = data?.trainees || [];
  const movements = data?.movements || [];
  const trainers = data?.trainers || [];
  const processes = data?.processes || [];
  const reports = data?.monthlyReports || {};
  const employeeTypes = data?.employeeTypes || [];
  const periodClosing = data?.periodClosing || {};
  const kpiConfig = data?.kpiConfig || { targetCompletionRate: 90, maxTurnoverRate: 15.0, targetDurationDays: 7 };
  const dashboardConfig = data?.dashboardConfig || { showWorkloadChart: true, showRetentionChart: true, showKpiCards: true };

  const totalTrainees = trainees.length;
  const completedCount = trainees.filter((t: any) => t.status === "Completed").length;
  const achieveRate = totalTrainees > 0 ? Math.round((completedCount / totalTrainees) * 100) : 0;

  const totalIn = movements.reduce((acc: number, m: any) => acc + (Number(m.countIn) || 0), 0);
  const totalOut = movements.reduce((acc: number, m: any) => acc + (Number(m.countOut) || 0), 0);
  const turnoverRate = totalIn > 0 ? ((totalOut / totalIn) * 100).toFixed(1) : "0.0";

  // Trainer workload chart data
  const trainerWorkload = trainers.map((tName: string) => ({
    name: tName,
    count: trainees.filter((t: any) => t.trainer === tName).length,
  }));

  // Pie Chart Retention
  const retentionPieData = [
    { name: "Active / Retained", value: totalIn - totalOut > 0 ? totalIn - totalOut : 0, color: "#3b82f6" },
    { name: "Resigned", value: totalOut, color: "#ef4444" },
  ];

  return (
    <DashboardLayout>
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">KPI & Training Management</h2>
          <p className="text-neutral-400 text-sm mt-1">
            Real-time operations, employee movement & monthly KPI tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saving && (
            <span className="text-xs text-blue-400 flex items-center gap-1.5 animate-pulse">
              <Save size={14} /> Saving changes...
            </span>
          )}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg"
          >
            <Download size={16} /> Export to Excel
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap gap-2 bg-neutral-900/80 p-1.5 rounded-2xl border border-neutral-800 mb-8 backdrop-blur-md">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === "overview"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <LayoutDashboard size={17} /> Overview
        </button>

        <button
          onClick={() => setActiveTab("training")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === "training"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <CalendarCheck size={17} /> Training Plan ({trainees.length})
        </button>

        <button
          onClick={() => setActiveTab("movement")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === "movement"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <UserPlus size={17} /> Employee Movement
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === "reports"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <FileSpreadsheet size={17} /> Monthly Reports
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === "settings"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Settings size={17} /> Settings & Master Data
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* KPI Summary Cards */}
          {dashboardConfig.showKpiCards && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard
                title="Total Trainees"
                value={totalTrainees}
                icon={<Users size={20} />}
                trend={`${completedCount} Completed`}
                trendUp={true}
                color="text-blue-400"
              />
              <KpiCard
                title="Turnover Rate"
                value={`${turnoverRate}%`}
                icon={<AlertCircle size={20} />}
                trend={`Target < ${kpiConfig.maxTurnoverRate || 15}%`}
                trendUp={Number(turnoverRate) <= (kpiConfig.maxTurnoverRate || 15)}
                color="text-red-400"
              />
              <KpiCard
                title="Active Processes"
                value={processes.length}
                icon={<BookOpen size={20} />}
                trend="Across all lines"
                trendUp={true}
                color="text-indigo-400"
              />
              <KpiCard
                title="Training Completion Rate"
                value={`${achieveRate}%`}
                icon={<TrendingUp size={20} />}
                trend={`Target >= ${kpiConfig.targetCompletionRate || 90}%`}
                trendUp={achieveRate >= (kpiConfig.targetCompletionRate || 90)}
                color="text-emerald-400"
              />
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trainer Workload */}
            {dashboardConfig.showWorkloadChart && (
              <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-6">Trainer Workload Distribution</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trainerWorkload} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="name" stroke="#666" tick={{ fill: "#999" }} axisLine={false} />
                      <YAxis stroke="#666" tick={{ fill: "#999" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#171717", border: "1px solid #333", borderRadius: "8px" }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Assigned Trainees" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Retention Pie Chart */}
            {dashboardConfig.showRetentionChart && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-white mb-4">Employee Retention Ratio</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={retentionPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {retentionPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#171717", border: "1px solid #333", borderRadius: "8px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  {retentionPieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-neutral-400">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRAINING PLAN TAB */}
      {activeTab === "training" && (
        <TrainingPlanTab
          trainees={trainees}
          trainers={trainers}
          processes={processes}
          onUpdateTrainees={(newTrainees) => saveData({ ...data, trainees: newTrainees })}
        />
      )}

      {/* EMPLOYEE MOVEMENT TAB */}
      {activeTab === "movement" && (
        <EmployeeMovementTab
          movements={movements}
          onUpdateMovements={(newMovements) => saveData({ ...data, movements: newMovements })}
        />
      )}

      {/* MONTHLY REPORTS TAB */}
      {activeTab === "reports" && (
        <MonthlyReportsTab
          reports={reports}
          onUpdateReports={(newReports) => saveData({ ...data, monthlyReports: newReports })}
        />
      )}

      {/* MASTER DATA SETTINGS TAB */}
      {activeTab === "settings" && (
        <MasterDataTab
          trainers={trainers}
          processes={processes}
          employeeTypes={employeeTypes}
          periodClosing={periodClosing}
          kpiConfig={kpiConfig}
          dashboardConfig={dashboardConfig}
          onUpdateData={(updatedFields) => saveData({ ...data, ...updatedFields })}
        />
      )}
    </DashboardLayout>
  );
}

function KpiCard({ title, value, icon, trend, trendUp, color = "text-blue-400" }: any) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-neutral-700 transition-all">
      <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        {icon}
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 ${color}`}>
          {icon}
        </div>
        <h3 className="text-neutral-400 font-medium text-sm">{title}</h3>
      </div>
      <div className="mb-2">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${trendUp ? "text-emerald-400" : "text-red-400"}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

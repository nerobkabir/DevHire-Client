"use client";

import { useState, useEffect } from "react";
import { Loader2 }             from "lucide-react";
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, Tooltip,
  XAxis, YAxis, CartesianGrid,
  Legend, ResponsiveContainer,
} from "recharts";
import { dashboardService }    from "@/services/dashboard.service";
import type { ChartData, PieChartData } from "@/types";

// ── Color palettes ────────────────────────────────────────────────────────────
const BAR_COLORS  = ["#6366f1", "#10b981", "#f59e0b"];
const PIE_COLORS  = [
  "#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6",
  "#06b6d4","#ec4899","#84cc16","#f97316","#64748b",
];

// ── Chart card wrapper ────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 shadow-lg text-xs">
      {label && <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</p>}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [barData,  setBarData]  = useState<ChartData | null>(null);
  const [lineData, setLineData] = useState<ChartData | null>(null);
  const [pieData,  setPieData]  = useState<PieChartData | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardService.getBarChart(),
      dashboardService.getLineChart(),
      dashboardService.getPieChart(),
    ])
      .then(([bar, line, pie]) => { setBarData(bar); setLineData(line); setPieData(pie); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
      </div>
    );
  }

  // ── Transform bar data for recharts ────────────────────────────────────────
  const barChartData = barData?.labels.map((label, i) => ({
    month:        label,
    Jobs:         barData.datasets.jobs?.[i]         ?? 0,
    Applications: barData.datasets.applications?.[i] ?? 0,
    Users:        barData.datasets.users?.[i]        ?? 0,
  })) ?? [];

  // ── Transform line data ────────────────────────────────────────────────────
  const lineChartData = lineData?.labels.map((label, i) => ({
    date:  label,
    Users: lineData.datasets.users?.[i] ?? 0,
    Jobs:  lineData.datasets.jobs?.[i]  ?? 0,
  })) ?? [];

  // ── Pie data ───────────────────────────────────────────────────────────────
  const jobsByCategory    = pieData?.jobsByCategory        ?? [];
  const appsByStatus      = pieData?.applicationsByStatus  ?? [];
  const usersByRole       = pieData?.usersByRole           ?? [];

  return (
    <div className="space-y-6">
      {/* Bar chart */}
      <ChartCard
        title="Monthly Activity Overview"
        subtitle="Jobs, applications, and user registrations over the last 6 months"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="Jobs"         fill={BAR_COLORS[0]} radius={[4,4,0,0]} />
            <Bar dataKey="Applications" fill={BAR_COLORS[1]} radius={[4,4,0,0]} />
            <Bar dataKey="Users"        fill={BAR_COLORS[2]} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Line chart */}
      <ChartCard
        title="Daily Registrations (Last 30 Days)"
        subtitle="New users and job postings per day"
      >
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={lineChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              interval={4}
            />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line type="monotone" dataKey="Users" stroke={BAR_COLORS[0]} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Jobs"  stroke={BAR_COLORS[1]} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Pie charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Jobs by category */}
        <ChartCard title="Jobs by Category">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={jobsByCategory}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  (percent ?? 0) > 0.05 ? `${name} ${((percent ?? 0) * 100).toFixed(0)}%` : ""
                }
                labelLine={false}
              >
                {jobsByCategory.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {jobsByCategory.slice(0, 5).map((item, i) => (
              <span key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {item.label} ({item.value})
              </span>
            ))}
          </div>
        </ChartCard>

        {/* Applications by status */}
        <ChartCard title="Applications by Status">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={appsByStatus}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
              >
                {appsByStatus.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {appsByStatus.map((item, i) => (
              <span key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {item.label} ({item.value})
              </span>
            ))}
          </div>
        </ChartCard>

        {/* Users by role */}
        <ChartCard title="Users by Role">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={usersByRole}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {usersByRole.map((_, i) => (
                  <Cell key={i} fill={["#6366f1","#10b981","#ef4444"][i] ?? PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {usersByRole.map((item, i) => (
              <span key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: ["#6366f1","#10b981","#ef4444"][i] ?? PIE_COLORS[i] }} />
                {item.label} ({item.value})
              </span>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect }    from "react";
import Link                        from "next/link";
import { Briefcase, Users, CheckCircle, XCircle, FileText, Clock, Star, ChevronRight } from "lucide-react";
import { jobService }              from "@/services/job.service";
import { applicationService }      from "@/services/application.service";
import { useAuth }                 from "@/contexts/AuthContext";
import { formatSalary, timeAgo }   from "@/lib/utils";
import type { Job, Application }   from "@/types";

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, href }: {
  label: string; value: number | string; icon: React.ElementType;
  color: string; href?: string;
}) {
  const content = (
    <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 ${href ? "hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all cursor-pointer" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const s: Record<string, string> = {
    PENDING:     "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    REVIEWED:    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    SHORTLISTED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    REJECTED:    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    HIRED:       "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    OPEN:        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    CLOSED:      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${s[status] ?? ""}`}>{status}</span>;
}

// ── Recruiter overview ────────────────────────────────────────────────────────
function RecruiterOverview() {
  const { user }          = useAuth();
  const [jobs, setJobs]   = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    jobService.getAll({ limit: 50 })
      .then((res) => {
        const mine = res.data.filter((j) =>
          typeof j.createdBy === "object" ? j.createdBy.id === user.id : j.createdBy === user.id
        );
        setJobs(mine);
        setTotal(mine.length);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const open   = jobs.filter((j) => j.status === "OPEN").length;
  const closed = jobs.filter((j) => j.status === "CLOSED").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Jobs Posted"    value={total}  icon={Briefcase}    color="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"   href="/dashboard/my-jobs"    />
        <StatCard label="Open Jobs"      value={open}   icon={CheckCircle}  color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" href="/dashboard/my-jobs"    />
        <StatCard label="Closed Jobs"    value={closed} icon={XCircle}      color="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300"               href="/dashboard/my-jobs"    />
        <StatCard label="Total Jobs"     value={total}  icon={Users}        color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"    href="/dashboard/applications" />
      </div>

      {/* Recent jobs */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Job Posts</h2>
          <Link href="/dashboard/my-jobs" className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-4">
            {[1,2,3].map((i) => <div key={i} className="animate-pulse h-12 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No jobs posted yet.</p>
            <Link href="/dashboard/post-job" className="mt-2 inline-block text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Post your first job →</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  {job.company.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{job.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{job.category} · {formatSalary(job.salary)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={job.status} />
                  <span className="text-xs text-gray-400">{timeAgo(job.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── User overview (developer) ─────────────────────────────────────────────────
function UserOverview() {
  const [apps, setApps]     = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getMine({ limit: 50 })
      .then((res) => setApps(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Applied"  value={apps.length}                                      icon={FileText}    color="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"   href="/dashboard/applications" />
        <StatCard label="Pending"        value={apps.filter((a) => a.status === "PENDING").length} icon={Clock}       color="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400" />
        <StatCard label="Shortlisted"    value={apps.filter((a) => a.status === "SHORTLISTED").length} icon={Star}   color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" />
        <StatCard label="Hired"          value={apps.filter((a) => a.status === "HIRED").length}  icon={CheckCircle} color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
          <Link href="/dashboard/applications" className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-4">{[1,2,3].map((i) => <div key={i} className="animate-pulse h-12 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}</div>
        ) : apps.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">No applications yet.</p>
            <Link href="/jobs" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Browse jobs →</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {apps.slice(0, 5).map((app) => {
              const job = typeof app.jobId === "object" ? app.jobId : null;
              return (
                <div key={app.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                    {(job?.company ?? "J").charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{job?.title ?? "Job"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{job?.company} · {timeAgo(app.createdAt)}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
export default function DashboardOverview() {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === "RECRUITER" || user.role === "ADMIN"
    ? <RecruiterOverview />
    : <UserOverview />;
}
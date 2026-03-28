"use client";

import { useState, useEffect } from "react";
import Link                    from "next/link";
import { Loader2, Pencil, Trash2, ToggleLeft, ToggleRight, Plus } from "lucide-react";
import { jobService }          from "@/services/job.service";
import { applicationService }  from "@/services/application.service";
import { Pagination }          from "@/components/jobs/Pagination";
import { useAuth }             from "@/contexts/AuthContext";
import { formatSalary, timeAgo } from "@/lib/utils";
import { getErrorMessage }     from "@/lib/axios";
import type { Job }            from "@/types";

export default function MyJobsPage() {
  const { user }              = useAuth();
  const [jobs, setJobs]       = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [appCounts, setAppCounts]   = useState<Record<string, number>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getAll({ page, limit: 10 });
      const mine = res.data.filter((j) =>
        typeof j.createdBy === "object" ? j.createdBy.id === user?.id : j.createdBy === user?.id
      );
      setJobs(mine);
      setTotalPages(res.meta.totalPages);

      // Fetch applicant counts
      const counts: Record<string, number> = {};
      await Promise.all(
        mine.map(async (job) => {
          try {
            const apps = await applicationService.getByJob(job.id, { limit: 1 });
            counts[job.id] = apps.meta.total;
          } catch { counts[job.id] = 0; }
        })
      );
      setAppCounts(counts);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [page, user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      await jobService.delete(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally { setDeletingId(null); }
  };

  const handleToggleStatus = async (job: Job) => {
    setTogglingId(job.id);
    try {
      const updated = await jobService.update(job.id, {
        status: job.status === "OPEN" ? "CLOSED" : "OPEN",
      } as Partial<Job>);
      setJobs((prev) => prev.map((j) => j.id === job.id ? updated : j));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally { setTogglingId(null); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
        </p>
        <Link
          href="/dashboard/post-job"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Post New Job
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No jobs posted yet.</p>
            <Link href="/dashboard/post-job" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              Post your first job →
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {["Job Title","Category","Salary","Applicants","Status","Posted","Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{job.company}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                          {job.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {formatSalary(job.salary)}/yr
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/dashboard/applications?jobId=${job.id}`}
                          className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {appCounts[job.id] ?? 0} applicants
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === "OPEN"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {timeAgo(job.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {/* Toggle status */}
                          <button
                            onClick={() => handleToggleStatus(job)}
                            disabled={togglingId === job.id}
                            title={job.status === "OPEN" ? "Close job" : "Reopen job"}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-emerald-600 disabled:opacity-50 transition-colors"
                          >
                            {togglingId === job.id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : job.status === "OPEN"
                              ? <ToggleRight className="w-4 h-4 text-emerald-500" />
                              : <ToggleLeft className="w-4 h-4" />
                            }
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(job.id)}
                            disabled={deletingId === job.id}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 disabled:opacity-50 transition-colors"
                          >
                            {deletingId === job.id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Trash2 className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{job.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{job.company} · {job.category}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === "OPEN"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    }`}>{job.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatSalary(job.salary)}/yr</span>
                    <span>{appCounts[job.id] ?? 0} applicants</span>
                    <span>{timeAgo(job.createdAt)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleToggleStatus(job)} disabled={togglingId === job.id}
                      className="flex-1 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      {job.status === "OPEN" ? "Close" : "Reopen"}
                    </button>
                    <button onClick={() => handleDelete(job.id)} disabled={deletingId === job.id}
                      className="flex-1 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link                    from "next/link";
import { Loader2, Trash2, ExternalLink } from "lucide-react";
import { jobService }          from "@/services/job.service";
import { Pagination }          from "@/components/jobs/Pagination";
import { formatSalary, formatDate } from "@/lib/utils";
import { getErrorMessage }     from "@/lib/axios";
import type { Job }            from "@/types";

export default function ManageJobsPage() {
  const [jobs, setJobs]           = useState<Job[]>([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    jobService.getAll({ page, limit: 10, sort: "-createdAt" })
      .then((res) => {
        setJobs(res.data);
        setTotalPages(res.meta.totalPages);
        setTotalCount(res.meta.total);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job listing permanently?")) return;
    setDeletingId(id);
    try {
      await jobService.delete(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      setTotalCount((c) => c - 1);
    } catch (err) { alert(getErrorMessage(err)); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span> total jobs
      </p>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No jobs found.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {["Job Title","Company","Category","Salary","Status","Created By","Date",""].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {jobs.map((job) => {
                    const poster = typeof job.createdBy === "object" ? job.createdBy : null;
                    return (
                      <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white truncate max-w-[160px]">{job.title}</span>
                            <Link href={`/jobs/${job.id}`} target="_blank" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex-shrink-0">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{job.company}</td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                            {job.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">{formatSalary(job.salary)}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job.status === "OPEN"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          }`}>{job.status}</span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">{poster?.name ?? "—"}</td>
                        <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">{formatDate(job.createdAt)}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => handleDelete(job.id)} disabled={deletingId === job.id}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 disabled:opacity-50 transition-colors">
                            {deletingId === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{job.company} · {job.category}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === "OPEN"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    }`}>{job.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{formatSalary(job.salary)} · {formatDate(job.createdAt)}</span>
                    <button onClick={() => handleDelete(job.id)} disabled={deletingId === job.id}
                      className="text-xs text-red-600 hover:underline disabled:opacity-50">Delete</button>
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
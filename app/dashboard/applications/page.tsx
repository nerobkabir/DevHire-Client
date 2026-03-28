"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams }               from "next/navigation";
import { Loader2, ChevronDown, Briefcase, X } from "lucide-react";
import Link                              from "next/link";
import { jobService }                    from "@/services/job.service";
import { applicationService }            from "@/services/application.service";
import { useAuth }                       from "@/contexts/AuthContext";
import { getErrorMessage }               from "@/lib/axios";
import { timeAgo, formatDate }           from "@/lib/utils";
import { Pagination }                    from "@/components/jobs/Pagination";
import type { Job, Application, AppStatus } from "@/types";

// ── Status styles ─────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  PENDING:     "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  REVIEWED:    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  SHORTLISTED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  REJECTED:    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  HIRED:       "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

const STATUS_OPTIONS: AppStatus[] = ["PENDING","REVIEWED","SHORTLISTED","REJECTED","HIRED"];

// ── USER Applications view ────────────────────────────────────────────────────
function UserApplications() {
  const [apps, setApps]               = useState<Application[]>([]);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);
  const [statusFilter, setStatusFilter] = useState<AppStatus | "">("");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    applicationService
      .getMine({ page, limit: 10, ...(statusFilter && { status: statusFilter }) })
      .then((res) => {
        setApps(res.data);
        setTotalPages(res.meta.totalPages);
        setTotal(res.meta.total);
      })
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  const handleWithdraw = async (id: string) => {
    if (!confirm("Withdraw this application?")) return;
    setWithdrawingId(id);
    try {
      await applicationService.delete(id);
      setApps((prev) => prev.filter((a) => a.id !== id));
      setTotal((c) => c - 1);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as AppStatus | ""); setPage(1); }}
            className="appearance-none pl-4 pr-10 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
          <span className="font-semibold text-gray-900 dark:text-white">{total}</span> applications
        </p>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
        ) : apps.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">No applications yet</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Start applying to jobs to see them here
            </p>
            <Link
              href="/jobs"
              className="mt-1 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Browse jobs →
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {["Job Title", "Company", "Location", "Applied", "Status", ""].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {apps.map((app) => {
                    const job = typeof app.jobId === "object" ? (app.jobId as any) : null;
                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          {job ? (
                            <Link
                              href={`/jobs/${job._id ?? job.id}`}
                              className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              {job.title}
                            </Link>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                          {job?.company ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">
                          {job?.location ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[app.status]}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {app.status === "PENDING" && (
                            <button
                              onClick={() => handleWithdraw(app.id)}
                              disabled={withdrawingId === app.id}
                              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
                            >
                              {withdrawingId === app.id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <X className="w-3.5 h-3.5" />
                              }
                              Withdraw
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
              {apps.map((app) => {
                const job = typeof app.jobId === "object" ? (app.jobId as any) : null;
                return (
                  <div key={app.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {job?.title ?? "—"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {job?.company ?? "—"}
                        </p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${STATUS_STYLES[app.status]}`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{formatDate(app.createdAt)}</span>
                      {app.status === "PENDING" && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          disabled={withdrawingId === app.id}
                          className="text-xs text-red-500 hover:underline disabled:opacity-50"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

// ── RECRUITER Applications view ───────────────────────────────────────────────
function RecruiterApplications() {
  const { user }      = useAuth();
  const searchParams  = useSearchParams();
  const initialJobId  = searchParams.get("jobId") ?? "";

  const [myJobs, setMyJobs]               = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [apps, setApps]                   = useState<Application[]>([]);
  const [loading, setLoading]             = useState(false);
  const [jobsLoading, setJobsLoading]     = useState(true);
  const [updatingId, setUpdatingId]       = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    jobService.getAll({ limit: 200, page: 1 })
      .then((res) => {
        const mine = res.data.filter((j) =>
          typeof j.createdBy === "object"
            ? j.createdBy.id === user.id
            : j.createdBy === user.id
        );
        setMyJobs(mine);
        if (!selectedJobId && mine.length > 0) setSelectedJobId(mine[0].id);
      })
      .finally(() => setJobsLoading(false));
  }, [user]);

  useEffect(() => {
    if (!selectedJobId) return;
    setLoading(true);
    applicationService.getByJob(selectedJobId, { limit: 50 })
      .then((res) => setApps(res.data))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, [selectedJobId]);

  const handleStatusChange = async (appId: string, status: AppStatus) => {
    setUpdatingId(appId);
    try {
      const updated = await applicationService.updateStatus(appId, status);
      setApps((prev) => prev.map((a) => a.id === appId ? updated : a));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Job selector */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Job to View Applicants
        </label>
        {jobsLoading ? (
          <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ) : myJobs.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">No jobs posted yet.</p>
            <Link
              href="/dashboard/post-job"
              className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Post a job →
            </Link>
          </div>
        ) : (
          <div className="relative">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {myJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.company}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Applicants */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 h-[200px]"
            />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl py-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No applicants for this job yet.</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="font-semibold text-gray-900 dark:text-white">{apps.length}</span>{" "}
            applicant{apps.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {apps.map((app) => {
              const applicant = typeof app.applicantId === "object" ? app.applicantId : null;
              return (
                <div
                  key={app.id}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex flex-col gap-4"
                >
                  {/* Applicant info */}
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0 overflow-hidden">
                      {applicant?.avatar
                        ? <img src={applicant.avatar} alt="" className="w-full h-full object-cover" />
                        : (applicant?.name?.[0] ?? "U").toUpperCase()
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {applicant?.name ?? "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {applicant?.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(app.createdAt)}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  {applicant?.skills && applicant.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {applicant.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {applicant.skills.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">
                          +{applicant.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* GitHub */}
                  {applicant?.github && (
                    <a
                      href={applicant.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline truncate"
                    >
                      {applicant.github.replace("https://", "")}
                    </a>
                  )}

                  {/* Cover letter */}
                  {app.coverLetter && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5">
                      {app.coverLetter}
                    </p>
                  )}

                  {/* Status dropdown */}
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[app.status]}`}>
                        {app.status}
                      </span>
                      {updatingId === app.id && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      )}
                    </div>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as AppStatus)}
                      disabled={updatingId === app.id}
                      className="w-full appearance-none px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Role router ───────────────────────────────────────────────────────────────
function ApplicationsContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (user.role === "RECRUITER" || user.role === "ADMIN") {
    return <RecruiterApplications />;
  }

  return <UserApplications />;
}

// ── Default export with Suspense (required for useSearchParams) ───────────────
export default function ApplicationsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    }>
      <ApplicationsContent />
    </Suspense>
  );
}
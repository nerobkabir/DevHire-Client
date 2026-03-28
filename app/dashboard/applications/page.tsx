"use client";

import { useState, useEffect } from "react";
import { useSearchParams }     from "next/navigation";
import { Loader2, ChevronDown } from "lucide-react";
import { jobService }           from "@/services/job.service";
import { applicationService }   from "@/services/application.service";
import { useAuth }              from "@/contexts/AuthContext";
import { getErrorMessage }      from "@/lib/axios";
import { timeAgo }              from "@/lib/utils";
import type { Job, Application, AppStatus } from "@/types";

const STATUS_OPTIONS: AppStatus[] = ["PENDING","REVIEWED","SHORTLISTED","REJECTED","HIRED"];

const STATUS_STYLES: Record<string, string> = {
  PENDING:     "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  REVIEWED:    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  SHORTLISTED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  REJECTED:    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  HIRED:       "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

export default function ApplicationsPage() {
  const { user }              = useAuth();
  const searchParams          = useSearchParams();
  const initialJobId          = searchParams.get("jobId") ?? "";

  const [myJobs, setMyJobs]   = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [apps, setApps]       = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [updatingId, setUpdatingId]   = useState<string | null>(null);

  // Fetch recruiter's jobs
  useEffect(() => {
    if (!user) return;
    jobService.getAll({ limit: 100, page: 1 })
      .then((res) => {
        const mine = res.data.filter((j) =>
          typeof j.createdBy === "object" ? j.createdBy.id === user.id : j.createdBy === user.id
        );
        setMyJobs(mine);
        if (!selectedJobId && mine.length > 0) setSelectedJobId(mine[0].id);
      })
      .finally(() => setJobsLoading(false));
  }, [user]);

  // Fetch applicants for selected job
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
    } finally { setUpdatingId(null); }
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
          <p className="text-sm text-gray-500 dark:text-gray-400">No jobs posted yet.</p>
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
            <div key={i} className="animate-pulse bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 h-[200px]" />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl py-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No applicants for this job yet.</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="font-semibold text-gray-900 dark:text-white">{apps.length}</span> applicant{apps.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {apps.map((app) => {
              const applicant = typeof app.applicantId === "object" ? app.applicantId : null;
              return (
                <div key={app.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
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
                        <span key={skill} className="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
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
                    <a href={applicant.github} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline truncate">
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
                  <div className="relative mt-auto">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[app.status]}`}>
                        {app.status}
                      </span>
                      {updatingId === app.id && <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />}
                    </div>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as AppStatus)}
                      disabled={updatingId === app.id}
                      className="mt-2 w-full appearance-none px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
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
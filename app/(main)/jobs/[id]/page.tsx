"use client";

import { useState, useEffect, use } from "react";
import Link                          from "next/link";
import {
  MapPin, DollarSign, Briefcase, Clock, Users,
  Share2, Check, ChevronRight, Loader2, BookmarkPlus,
} from "lucide-react";
import { jobService }         from "@/services/job.service";
import { applicationService } from "@/services/application.service";
import { getErrorMessage }    from "@/lib/axios";
import { useAuth }            from "@/contexts/AuthContext";
import { formatSalary, timeAgo } from "@/lib/utils";
import { ApplyModal }         from "@/components/jobs/ApplyModal";
import { ReviewSection }      from "@/components/jobs/ReviewSection";
import { JobCard, JobCardSkeleton } from "@/components/jobs/JobCard";
import type { Job }           from "@/types";

// Skeleton 
function PageSkeleton() {
  return (
    <div className="animate-pulse max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-7 space-y-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="w-2/3 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
            </div>
          </div>
          {[1,2].map(i => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-7 space-y-3">
              <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="space-y-2">
                {[1,2,3,4].map(j => <div key={j} className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded" />)}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-3">
            <div className="w-full h-11 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="w-full h-11 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page 
export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }                    = use(params);
  const { user, isAuthenticated } = useAuth();

  const [job, setJob]               = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [loading, setLoading]       = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicantCount, setApplicantCount] = useState(0);
  const [showModal, setShowModal]   = useState(false);
  const [shared, setShared]         = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await jobService.getById(id);
        setJob(data);

        // Fetch related jobs
        const related = await jobService.getAll({ category: data.category, limit: 4 });
        setRelatedJobs(related.data.filter((j) => j.id !== id).slice(0, 4));

        // Check if user applied
        if (isAuthenticated && user?.role === "USER") {
          try {
            const apps = await applicationService.getMine({ limit: 100 });
            const applied = apps.data.some((a) => {
              const jId = typeof a.jobId === "object" ? a.jobId.id : a.jobId;
              return jId === id;
            });
            setHasApplied(applied);
          } catch {}
        }

        // Recruiter: fetch applicant count
        if (isAuthenticated && (user?.role === "RECRUITER" || user?.role === "ADMIN")) {
          try {
            const apps = await applicationService.getByJob(id, { limit: 1 });
            setApplicantCount(apps.meta.total);
          } catch {}
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isAuthenticated, user]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {}
  };

  if (loading) return <PageSkeleton />;
  if (!job)    return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 dark:text-gray-400">Job not found.</p>
      <Link href="/jobs" className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
        Browse All Jobs
      </Link>
    </div>
  );

  const poster = typeof job.createdBy === "object" ? job.createdBy : null;

  return (
    <>
      {showModal && (
        <ApplyModal
          jobId={job.id}
          jobTitle={job.title}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); setHasApplied(true); }}
        />
      )}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Jobs</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-white truncate max-w-[200px]">{job.title}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: Main content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Job header card */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-7">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                    {job.company.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{job.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{poster?.name ?? job.company}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === "OPEN"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      }`}>
                        {job.status}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                        {job.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                        {job.jobType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: MapPin,      label: "Location", value: job.location          },
                    { icon: DollarSign,  label: "Salary",   value: formatSalary(job.salary) + "/yr" },
                    { icon: Briefcase,   label: "Type",     value: job.jobType             },
                    { icon: Clock,       label: "Posted",   value: timeAgo(job.createdAt)  },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex flex-col gap-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-7">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Job Description</h2>
                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              {/* Required skills */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-7">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-7">
                <ReviewSection jobId={id} />
              </div>
            </div>

            {/* ── Right: Sidebar ───────────────────────────────────────── */}
            <div className="space-y-5">

              {/* Apply / status card */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-3">
                {/* USER: apply button */}
                {(!isAuthenticated || user?.role === "USER") && (
                  <>
                    {hasApplied ? (
                      <div className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                        <Check className="w-4 h-4" /> Already Applied
                      </div>
                    ) : (
                      <button
                        onClick={() => isAuthenticated ? setShowModal(true) : window.location.href = "/login"}
                        disabled={job.status !== "OPEN"}
                        className="w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                      >
                        {job.status !== "OPEN" ? "Applications Closed" : isAuthenticated ? "Apply Now" : "Sign in to Apply"}
                      </button>
                    )}
                  </>
                )}

                {/* RECRUITER / ADMIN: see applicant count */}
                {isAuthenticated && (user?.role === "RECRUITER" || user?.role === "ADMIN") && (
                  <Link
                    href={`/dashboard/applications?jobId=${job.id}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    {applicantCount} Applicant{applicantCount !== 1 ? "s" : ""}
                  </Link>
                )}

                {/* Save & Share */}
                <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <BookmarkPlus className="w-4 h-4" /> Save Job
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {shared ? <><Check className="w-4 h-4 text-emerald-500" /> Link Copied!</> : <><Share2 className="w-4 h-4" /> Share Job</>}
                </button>
              </div>

              {/* Company info */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">About the Company</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{job.company}</p>
                    {poster?.email && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{poster.email}</p>
                    )}
                  </div>
                </div>
                <Link
                  href={`/jobs?search=${encodeURIComponent(job.company)}`}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  View all jobs at {job.company}
                </Link>
              </div>
            </div>
          </div>

          {/* Related jobs */}
          {relatedJobs.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  More {job.category} Jobs
                </h2>
                <Link href={`/jobs?category=${job.category}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedJobs.map((j) => <JobCard key={j.id} job={j} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
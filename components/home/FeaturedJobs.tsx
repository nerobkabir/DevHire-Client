"use client";

import { useEffect, useState } from "react";
import Link                    from "next/link";
import { MapPin, Clock, DollarSign, ArrowRight } from "lucide-react";
import { jobService }   from "@/services/job.service";
import { timeAgo, formatSalary } from "@/lib/utils";
import type { Job }     from "@/types";

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 h-[220px] animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="flex gap-2">
        <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}

// ── Job card ──────────────────────────────────────────────────────────────────
function JobCard({ job }: { job: Job }) {
  const company = typeof job.createdBy === "object" ? job.createdBy.name : job.company;

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 h-[220px] hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-lg font-bold text-indigo-600 dark:text-indigo-400">
          {job.company.charAt(0)}
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
          {job.jobType}
        </span>
      </div>

      {/* Info */}
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
        {job.title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{company}</p>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-auto">
        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="w-3 h-3" />{job.location}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <DollarSign className="w-3 h-3" />{formatSalary(job.salary)}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-gray-800">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
          {job.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <Clock className="w-3 h-3" />{timeAgo(job.createdAt)}
        </span>
      </div>
    </Link>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export function FeaturedJobs() {
  const [jobs, setJobs]     = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService.getAll({ limit: 8, sort: "-createdAt" })
      .then((res) => setJobs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">Latest Openings</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Jobs</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Hand-picked opportunities from top tech companies
            </p>
          </div>
          <Link
            href="/jobs"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:gap-3 transition-all"
          >
            View all jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : jobs.map((job) => <JobCard key={job.id} job={job} />)
          }
        </div>

        {/* Mobile view all */}
        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
          >
            View all jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
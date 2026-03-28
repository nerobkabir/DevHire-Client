import Link                              from "next/link";
import { MapPin, DollarSign, Clock }     from "lucide-react";
import { formatSalary, timeAgo }         from "@/lib/utils";
import type { Job }                      from "@/types";

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function JobCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 animate-pulse h-[260px] flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="w-20 h-5 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="w-14 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}

// ── Job card ──────────────────────────────────────────────────────────────────
export function JobCard({ job }: { job: Job }) {
  const companyName = typeof job.createdBy === "object" ? job.createdBy.name : job.company;

  return (
    <div className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 h-[260px] flex flex-col hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-base font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          {job.company.charAt(0).toUpperCase()}
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex-shrink-0">
          {job.jobType}
        </span>
      </div>

      {/* Title & company */}
      <Link href={`/jobs/${job.id}`}>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-0.5">
          {job.title}
        </h3>
      </Link>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{companyName}</p>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate max-w-[80px]">{job.location}</span>
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <DollarSign className="w-3 h-3 flex-shrink-0" />
          {formatSalary(job.salary)}
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-auto">
        {job.requiredSkills.slice(0, 3).map((skill) => (
          <span key={skill} className="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {skill}
          </span>
        ))}
        {job.requiredSkills.length > 3 && (
          <span className="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            +{job.requiredSkills.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
            {job.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Clock className="w-3 h-3" />
            {timeAgo(job.createdAt)}
          </span>
        </div>
        <Link
          href={`/jobs/${job.id}`}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Apply
        </Link>
      </div>
    </div>
  );
}
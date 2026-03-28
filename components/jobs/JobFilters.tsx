"use client";

import { X }       from "lucide-react";

const CATEGORIES = ["Frontend","Backend","Fullstack","DevOps","Mobile","Data","AI/ML","QA","Design","Other"];
const JOB_TYPES  = ["Full-time","Part-time","Contract","Remote","Internship"];

interface Filters {
  category:  string;
  jobType:   string;
  location:  string;
  salaryMin: number;
  salaryMax: number;
}

interface Props {
  filters:    Filters;
  onChange:   (key: keyof Filters, value: string | number) => void;
  onReset:    () => void;
  totalCount: number;
}

export function JobFilters({ filters, onChange, onReset, totalCount }: Props) {
  const hasActive =
    filters.category || filters.jobType || filters.location ||
    filters.salaryMin > 0 || filters.salaryMax < 200000;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 sticky top-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h3>
          {hasActive && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
            >
              <X className="w-3 h-3" /> Reset all
            </button>
          )}
        </div>

        {/* Result count */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{totalCount}</span> jobs found
        </p>

        {/* Category */}
        <FilterSection title="Category">
          <div className="space-y-1.5">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat}
                  onChange={() => onChange("category", filters.category === cat ? "" : cat)}
                  className="w-3.5 h-3.5 accent-indigo-600"
                />
                <span className={`text-sm transition-colors ${
                  filters.category === cat
                    ? "text-indigo-600 dark:text-indigo-400 font-medium"
                    : "text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                }`}>
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Job type */}
        <FilterSection title="Job Type">
          <div className="space-y-1.5">
            {JOB_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="jobType"
                  checked={filters.jobType === type}
                  onChange={() => onChange("jobType", filters.jobType === type ? "" : type)}
                  className="w-3.5 h-3.5 accent-indigo-600"
                />
                <span className={`text-sm transition-colors ${
                  filters.jobType === type
                    ? "text-indigo-600 dark:text-indigo-400 font-medium"
                    : "text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                }`}>
                  {type}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Location */}
        <FilterSection title="Location">
          <input
            type="text"
            value={filters.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="e.g. Remote, New York"
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </FilterSection>

        {/* Salary range */}
        <FilterSection title="Salary Range" noBorder>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>${(filters.salaryMin / 1000).toFixed(0)}K</span>
              <span>${(filters.salaryMax / 1000).toFixed(0)}K</span>
            </div>
            <input
              type="range"
              min={0}
              max={200000}
              step={5000}
              value={filters.salaryMin}
              onChange={(e) => onChange("salaryMin", Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <input
              type="range"
              min={0}
              max={200000}
              step={5000}
              value={filters.salaryMax}
              onChange={(e) => onChange("salaryMax", Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              ${(filters.salaryMin / 1000).toFixed(0)}K — ${(filters.salaryMax / 1000).toFixed(0)}K / year
            </p>
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}

function FilterSection({
  title,
  children,
  noBorder,
}: {
  title:    string;
  children: React.ReactNode;
  noBorder?: boolean;
}) {
  return (
    <div className={`pb-4 mb-4 ${noBorder ? "" : "border-b border-gray-100 dark:border-gray-800"}`}>
      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
        {title}
      </h4>
      {children}
    </div>
  );
}
"use client";

import { X } from "lucide-react";
import { formatSalary } from "@/lib/utils";

interface ActiveFilters {
  search?:   string;
  category?: string;
  jobType?:  string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  sort?:     string;
}

interface Props {
  filters:  ActiveFilters;
  onRemove: (key: string) => void;
}

const SORT_LABELS: Record<string, string> = {
  "-createdAt": "Latest",
  "salary":     "Salary Low→High",
  "-salary":    "Salary High→Low",
};

export function ActiveFilterTags({ filters, onRemove }: Props) {
  const tags: { key: string; label: string }[] = [];

  if (filters.search)   tags.push({ key: "search",   label: `"${filters.search}"` });
  if (filters.category) tags.push({ key: "category", label: filters.category       });
  if (filters.jobType)  tags.push({ key: "jobType",  label: filters.jobType        });
  if (filters.location) tags.push({ key: "location", label: filters.location       });
  if (filters.sort && filters.sort !== "-createdAt") {
    tags.push({ key: "sort", label: SORT_LABELS[filters.sort] ?? filters.sort });
  }
  if (filters.salaryMin && filters.salaryMin > 0) {
    tags.push({ key: "salaryMin", label: `Min ${formatSalary(filters.salaryMin)}` });
  }
  if (filters.salaryMax && filters.salaryMax < 200000) {
    tags.push({ key: "salaryMax", label: `Max ${formatSalary(filters.salaryMax)}` });
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
      {tags.map(({ key, label }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
        >
          {label}
          <button
            onClick={() => onRemove(key)}
            className="hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
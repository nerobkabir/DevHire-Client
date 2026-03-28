"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { jobService } from "@/services/job.service";
import { JobCard, JobCardSkeleton } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { ActiveFilterTags } from "@/components/jobs/ActiveFilterTags";
import { Pagination } from "@/components/jobs/Pagination";
import type { Job } from "@/types";

// ── Default filter state ──────────────────────────────────────────────────────
const DEFAULT_FILTERS = {
  category: "",
  jobType: "",
  location: "",
  salaryMin: 0,
  salaryMax: 200000,
};

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Latest" },
  { value: "-salary", label: "Salary: High→Low" },
  { value: "salary", label: "Salary: Low→High" },
];

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Search className="w-7 h-7 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No jobs found
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        We couldn&apos;t find any jobs matching your current filters. Try
        adjusting your search or removing some filters.
      </p>
      <button
        onClick={onReset}
        className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}

// ── Main content component that uses useSearchParams ────────────────────────
function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── State ─────────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: searchParams.get("category") ?? "",
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // ── Fetch jobs ─────────────────────────────────────────────────────────────
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        sort,
        ...(search && { search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.jobType && { jobType: filters.jobType }),
        ...(filters.location && { location: filters.location }),
        ...(filters.salaryMin > 0 && { salaryMin: filters.salaryMin }),
        ...(filters.salaryMax < 200000 && { salaryMax: filters.salaryMax }),
      };

      const res = await jobService.getAll(params);
      setJobs(res.data);
      setTotalPages(res.meta.totalPages);
      setTotalCount(res.meta.total);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, filters]);

  // Debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchJobs();
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search, filters, sort]);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFilterChange = (key: keyof typeof filters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleRemoveFilter = (key: string) => {
    if (key === "search") {
      setSearch("");
      return;
    }
    if (key === "sort") {
      setSort("-createdAt");
      return;
    }
    if (key in filters) {
      const reset = key === "salaryMin" ? 0 : key === "salaryMax" ? 200000 : "";
      setFilters((prev) => ({ ...prev, [key]: reset }));
      setPage(1);
    }
  };

  const handleReset = () => {
    setSearch("");
    setSort("-createdAt");
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Find Your Next Role
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Browse {totalCount.toLocaleString()} developer opportunities
          </p>

          {/* Search bar */}
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by title, company, or skill..."
                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="hidden sm:block px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Active filter tags */}
          <div className="mt-4">
            <ActiveFilterTags
              filters={{ search, sort, ...filters }}
              onRemove={handleRemoveFilter}
            />
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-7">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <JobFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
              totalCount={totalCount}
            />
          </div>

          {/* Mobile sidebar overlay */}
          {showFilters && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowFilters(false)}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-950 overflow-y-auto p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <JobFilters
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={handleReset}
                  totalCount={totalCount}
                />
              </div>
            </div>
          )}

          {/* Jobs grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile sort */}
            <div className="sm:hidden mb-4">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState onReset={handleReset} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page component (server component) with Suspense ────────────────────────
export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading jobs...</div>
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
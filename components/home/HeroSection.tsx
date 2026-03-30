"use client";

import { useState, useEffect } from "react";
import Link                    from "next/link";
import { Search, ArrowRight, Sparkles, TrendingUp, Users, Briefcase } from "lucide-react";

// ── Animated counter 
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const step     = Math.ceil(end / (duration / 16));
    const timer    = setInterval(() => {
      setCount((prev) => {
        if (prev + step >= end) { clearInterval(timer); return end; }
        return prev + step;
      });
    }, 16);
    return () => clearInterval(timer);
  }, [end]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

// ── Component 
export function HeroSection() {
  const [search, setSearch] = useState("");

  const stats = [
    { icon: Briefcase, label: "Open Jobs",    value: 2400, suffix: "+"  },
    { icon: Users,     label: "Developers",   value: 15000, suffix: "+" },
    { icon: TrendingUp,label: "Companies",    value: 800,  suffix: "+"  },
  ];

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-50 dark:bg-indigo-950/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-50 dark:bg-emerald-950/20 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            AI-Powered Developer Hiring Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight max-w-4xl mx-auto">
          Find Your Dream{" "}
          <span className="text-indigo-600 dark:text-indigo-400">Developer</span>{" "}
          Job or Hire Top Talent
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Connect with thousands of companies hiring for Frontend, Backend, Fullstack, and more. 
          Let AI match you with the perfect opportunity.
        </p>

        {/* Search bar */}
        <div className="mt-10 max-w-2xl mx-auto px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-2 shadow-lg shadow-gray-100 dark:shadow-none">
            <div className="flex items-center flex-1 gap-2 px-2">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs by title, skill, or company..."
                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none py-2"
              />
            </div>
            <Link
              href={`/jobs${search ? `?search=${encodeURIComponent(search)}` : ""}`}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors flex-shrink-0"
            >
              Search
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs text-gray-400 dark:text-gray-500">Popular:</span>
            {["React", "Node.js", "Python", "TypeScript", "Remote"].map((tag) => (
              <Link
                key={tag}
                href={`/jobs?search=${tag}`}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Browse All Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/register?role=RECRUITER"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Post a Job — It&apos;s Free
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
          {stats.map(({ icon: Icon, label, value, suffix }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <Counter end={value} suffix={suffix} />
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
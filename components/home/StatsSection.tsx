"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 2400,  suffix: "+", label: "Active Job Listings",    desc: "New jobs added daily"            },
  { value: 15000, suffix: "+", label: "Registered Developers",  desc: "Across 50+ countries"            },
  { value: 800,   suffix: "+", label: "Partner Companies",      desc: "From startups to enterprises"    },
  { value: 94,    suffix: "%", label: "Hiring Success Rate",    desc: "Candidates placed within 30 days"},
];

function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount]     = useState(0);
  const [started, setStarted] = useState(false);
  const ref                   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const step  = Math.ceil(end / (2000 / 16));
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev + step >= end) { clearInterval(timer); return end; }
        return prev + step;
      });
    }, 16);
    return () => clearInterval(timer);
  }, [started, end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export function StatsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-600 dark:bg-indigo-700">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white">Trusted by Developers and Companies Worldwide</h2>
          <p className="text-indigo-200 mt-3">
            The numbers speak for themselves — DevHire delivers results.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(({ value, suffix, label, desc }) => (
            <div key={label} className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-white mb-2">
                <CountUp end={value} suffix={suffix} />
              </p>
              <p className="text-base font-semibold text-indigo-100">{label}</p>
              <p className="text-sm text-indigo-300 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
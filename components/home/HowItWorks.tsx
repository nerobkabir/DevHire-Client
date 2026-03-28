"use client";

import { useState } from "react";
import { UserCheck, Search, FileText, Briefcase, Users, CheckCircle } from "lucide-react";

const DEVELOPER_STEPS = [
  { icon: UserCheck, title: "Create Your Profile",    desc: "Sign up and build a professional developer profile with your skills, experience, and GitHub portfolio." },
  { icon: Search,    title: "Explore Job Listings",   desc: "Browse thousands of curated job listings. Use AI-powered search to find roles that match your skill set perfectly." },
  { icon: FileText,  title: "Apply & Get Hired",      desc: "Submit your application with a personalized cover letter. Use our AI resume analyzer to boost your chances." },
];

const RECRUITER_STEPS = [
  { icon: Briefcase,    title: "Post a Job Opening",    desc: "Create detailed job listings in minutes. Use our AI description generator to write compelling job posts." },
  { icon: Users,        title: "Review Applicants",     desc: "Browse qualified developer profiles. Filter by skills, experience, and location to find the perfect fit." },
  { icon: CheckCircle,  title: "Hire Top Talent",       desc: "Connect with shortlisted candidates, schedule interviews, and onboard your new team member seamlessly." },
];

export function HowItWorks() {
  const [active, setActive] = useState<"developer" | "recruiter">("developer");
  const steps = active === "developer" ? DEVELOPER_STEPS : RECRUITER_STEPS;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">Simple Process</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How DevHire Works</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3">
            Get started in minutes — whether you&apos;re hiring or job hunting.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center mt-8 bg-gray-200 dark:bg-gray-800 rounded-xl p-1">
            {(["developer", "recruiter"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  active === tab
                    ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                For {tab === "developer" ? "Developers" : "Recruiters"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-7 h-[220px] flex flex-col"
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
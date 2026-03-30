"use client";

import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";

// ── FAQ data 
const FAQ_ITEMS = [
  {
    q: "Is DevHire free for developers?",
    a: "Yes, creating a developer account and applying for jobs is completely free. We believe every developer deserves access to great opportunities without paying a fee.",
  },
  {
    q: "How does the AI resume analyzer work?",
    a: "Paste your resume text into the analyzer and our AI will evaluate your skills, experience, and formatting. It returns an overall score, highlights your strengths, identifies skill gaps, and suggests specific improvements.",
  },
  {
    q: "Can I post jobs as a recruiter?",
    a: "Absolutely. Register as a Recruiter, complete your company profile, and you can start posting jobs immediately. Our AI description generator helps you write compelling job posts in seconds.",
  },
  {
    q: "How long does the hiring process typically take?",
    a: "Timelines vary by company, but 94% of successful placements happen within 30 days. The key is a strong profile, tailored applications, and quick responses to recruiter messages.",
  },
  {
    q: "What types of developer roles can I find on DevHire?",
    a: "DevHire covers all tech roles — Frontend, Backend, Fullstack, DevOps, Mobile, Data, AI/ML, QA, and Design. Jobs range from internships and contracts to full-time senior positions.",
  },
  {
    q: "Is my profile information kept private?",
    a: "You have full control over your profile visibility. By default, your profile is visible to verified recruiters only. You can hide your profile at any time from your dashboard settings.",
  },
];

// ── FAQ item 
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900 dark:text-white">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ── Newsletter
function Newsletter() {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900 rounded-3xl px-8 py-12 text-center mb-16">
      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-5">
        <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Get the Best Jobs in Your Inbox
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Subscribe to our weekly newsletter and receive curated job listings that match your skills — no spam, ever.
      </p>

      {submitted ? (
        <div className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl">
          ✓ You&apos;re subscribed! Check your inbox.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0"
          >
            Subscribe Free
          </button>
        </form>
      )}
    </div>
  );
}

// ── Combined component
export function NewsletterFAQ() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-3xl mx-auto">
        <Newsletter />

        {/* FAQ */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">Got Questions?</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.q} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
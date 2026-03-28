import Link from "next/link";
import { Bot, FileSearch, Sparkles, ArrowRight } from "lucide-react";

const AI_FEATURES = [
  {
    icon: Bot,
    title:   "AI Job Chatbot",
    desc:    "Ask our AI for personalized job suggestions, career advice, and salary insights based on your skills.",
    badge:   "Most Popular",
  },
  {
    icon: FileSearch,
    title:   "Resume Analyzer",
    desc:    "Paste your resume and get an instant score, skill gaps, and actionable improvements to land more interviews.",
    badge:   "New",
  },
  {
    icon: Sparkles,
    title:   "Smart Job Description",
    desc:    "Recruiters can generate compelling, bias-free job descriptions in seconds using our AI writing assistant.",
    badge:   "For Recruiters",
  },
];

export function AIBanner() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl px-8 py-12 mb-10">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-10 w-80 h-80 bg-white/5 rounded-full" />

          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Google Gemini AI
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Meet Your AI Career Assistant
            </h2>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-8">
              From finding the right job to crafting the perfect application — our AI tools give you an unfair advantage in your job search.
            </p>
            <Link
              href="/ai-tools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 text-sm font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Try AI Tools for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {AI_FEATURES.map(({ icon: Icon, title, desc, badge }) => (
            <div
              key={title}
              className="relative flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 h-[200px] hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all"
            >
              {/* Badge */}
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                {badge}
              </span>

              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
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
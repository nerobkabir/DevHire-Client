import type { Metadata } from "next";
import Link              from "next/link";
import { Clock, ArrowRight, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Career Tips — DevHire",
  description: "Developer career advice, job hunting tips, and tech industry insights from the DevHire team.",
};

export const POSTS = [
  {
    id:       "how-to-negotiate-salary",
    title:    "How to Negotiate Your Developer Salary (And Actually Win)",
    excerpt:  "Most developers leave thousands of dollars on the table by accepting the first offer. Here's a proven framework to negotiate confidently and get what you deserve.",
    category: "Career Advice",
    date:     "March 15, 2025",
    readTime: "8 min read",
    author:   "Sarah Chen",
    color:    "from-indigo-500 to-purple-600",
    emoji:    "💰",
  },
  {
    id:       "remote-job-interview-tips",
    title:    "10 Things That Separate Remote Job Winners from the Rest",
    excerpt:  "Remote roles are competitive — often 200+ applicants per posting. We analyzed thousands of successful applications to find what actually gets developers hired.",
    category: "Job Hunting",
    date:     "March 8, 2025",
    readTime: "6 min read",
    author:   "Marcus Williams",
    color:    "from-emerald-500 to-teal-600",
    emoji:    "🏠",
  },
  {
    id:       "portfolio-that-gets-interviews",
    title:    "Build a Developer Portfolio That Gets You Interviews",
    excerpt:  "A portfolio with 10 half-finished projects hurts more than it helps. This guide covers what senior hiring managers actually look for — and what makes them skip your profile.",
    category: "Portfolio",
    date:     "February 28, 2025",
    readTime: "10 min read",
    author:   "Priya Patel",
    color:    "from-amber-500 to-orange-600",
    emoji:    "🗂️",
  },
  {
    id:       "ai-tools-for-job-search",
    title:    "5 AI Tools That Will Transform Your 2025 Job Search",
    excerpt:  "From AI resume analyzers to interview prep chatbots, we tested every major tool so you don&apos;t have to. Here&apos;s what actually works — and what&apos;s just hype.",
    category: "AI & Tools",
    date:     "February 20, 2025",
    readTime: "7 min read",
    author:   "Priya Patel",
    color:    "from-purple-500 to-pink-600",
    emoji:    "🤖",
  },
  {
    id:       "from-bootcamp-to-first-job",
    title:    "Bootcamp to First Dev Job in 90 Days: A Real Story",
    excerpt:  "Hiroshi Nakamura had zero CS degree, six months of coding experience, and three rejection streaks. Then he changed his approach. This is exactly what he did.",
    category: "Success Stories",
    date:     "February 12, 2025",
    readTime: "12 min read",
    author:   "Sarah Chen",
    color:    "from-red-500 to-rose-600",
    emoji:    "🎓",
  },
  {
    id:       "tech-interview-system-design",
    title:    "System Design Interviews: The Practical Guide for Mid-Level Devs",
    excerpt:  "System design interviews terrify most developers because nobody teaches them properly. Here&apos;s the framework we&apos;ve seen work across hundreds of interviews at top companies.",
    category: "Interview Prep",
    date:     "February 3, 2025",
    readTime: "15 min read",
    author:   "Marcus Williams",
    color:    "from-cyan-500 to-blue-600",
    emoji:    "🏗️",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Career Advice":  "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
  "Job Hunting":    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  "Portfolio":      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  "AI & Tools":     "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  "Success Stories":"bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  "Interview Prep": "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300",
};

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 py-14 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Career Tips & Insights
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Practical advice for developers navigating the job market — from salary negotiation to acing system design interviews.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Featured post */}
        <Link href={`/blog/${featured.id}`} className="group block mb-10">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg transition-all">
            <div className={`h-48 bg-gradient-to-br ${featured.color} flex items-center justify-center`}>
              <span className="text-7xl">{featured.emoji}</span>
            </div>
            <div className="p-7">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[featured.category]}`}>
                  {featured.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />{featured.readTime}
                </span>
                <span className="text-xs text-gray-400 hidden sm:block">{featured.date}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {featured.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">By {featured.author}</p>
                <span className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2.5 transition-all">
                  Read article <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}
              className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all flex flex-col">
              <div className={`h-28 bg-gradient-to-br ${post.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-5xl">{post.emoji}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[post.category]}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{post.readTime}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-gray-800">
                  <p className="text-xs text-gray-400">{post.date}</p>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
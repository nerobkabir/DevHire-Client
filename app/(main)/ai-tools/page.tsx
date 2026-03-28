import type { Metadata }         from "next";
import { Bot, Search, FileText, Sparkles } from "lucide-react";
import { AIChatbot }             from "@/components/ai/AIChatbot";
import { AISearchAssistant }     from "@/components/ai/AISearchAssistant";
import { AIResumeAnalyzer }      from "@/components/ai/AIResumeAnalyzer";

export const metadata: Metadata = {
  title: "AI Tools — DevHire",
  description: "AI-powered job search assistant, resume analyzer, and career chatbot for developers.",
};

const TOOLS = [
  { icon: Bot,      title: "AI Job Chatbot",      desc: "Ask questions, get career advice and personalized job suggestions.",    color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" },
  { icon: Search,   title: "AI Search Assistant", desc: "Describe what you want — our AI suggests the best keywords and roles.", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
  { icon: FileText, title: "Resume Analyzer",     desc: "Paste your resume and get a score, skill gaps, and improvements.",     color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
];

export default function AIToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Page header */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Powered by Google Gemini AI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            AI-Powered Career Tools
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Supercharge your job search with three intelligent tools built to give you an unfair advantage.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            {TOOLS.map(({ icon: Icon, title, color }) => (
              <div key={title} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${color} bg-opacity-50`}>
                <Icon className="w-4 h-4" />
                {title}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tools grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Chatbot — full height left */}
          <div className="lg:row-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">AI Job Chatbot</h2>
            </div>
            <AIChatbot />
          </div>

          {/* Search assistant */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">AI Search Assistant</h2>
            </div>
            <AISearchAssistant />
          </div>

          {/* Resume analyzer */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Resume Analyzer</h2>
            </div>
            <AIResumeAnalyzer />
          </div>
        </div>
      </div>
    </div>
  );
}
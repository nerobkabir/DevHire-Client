"use client";

import { useState }       from "react";
import { Loader2, FileText, CheckCircle, TrendingUp, AlertCircle, Briefcase } from "lucide-react";
import { aiService }      from "@/services/ai.service";
import { getErrorMessage } from "@/lib/axios";

interface AnalysisResult {
  skills:         string[];
  experience:     string;
  strengths:      string[];
  improvements:   string[];
  jobSuggestions: string[];
  overallScore:   number;
}

// ── Circular score ────────────────────────────────────────────────────────────
function CircularScore({ score }: { score: number }) {
  const radius      = 42;
  const circ        = 2 * Math.PI * radius;
  const strokeDash  = (score / 100) * circ;
  const color =
    score >= 75 ? "#10b981" :
    score >= 50 ? "#f59e0b" :
    "#ef4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" className="dark:stroke-gray-700" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={`${strokeDash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{score}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">/ 100</span>
        </div>
      </div>
      <p className="text-sm font-semibold" style={{ color }}>
        {score >= 75 ? "Strong Resume" : score >= 50 ? "Good Resume" : "Needs Work"}
      </p>
    </div>
  );
}

// ── List section ──────────────────────────────────────────────────────────────
function ResultSection({ icon: Icon, title, items, color }: {
  icon: React.ElementType; title: string; items: string[]; color: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className={`w-4 h-4 ${color}`} />
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h4>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${color.replace("text-", "bg-")}`} />
            <p className="text-sm text-gray-600 dark:text-gray-300">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AIResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<AnalysisResult | null>(null);
  const [error, setError]           = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resumeText.trim().length < 50) {
      setError("Please paste at least 50 characters of resume text.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await aiService.analyzeResume({
        resumeText: resumeText.trim(),
        jobTitle:   jobTitle.trim() || undefined,
      });
      setResult(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Resume Analyzer</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Get an AI score and actionable feedback</p>
        </div>
      </div>

      {!result ? (
        <form onSubmit={handleAnalyze} className="space-y-4">
          {/* Job title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Target Job Title <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior React Developer"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Resume textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Resume Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={10}
              placeholder="Paste your resume text here...

Include:
• Work experience
• Skills and technologies  
• Education
• Projects

Tip: Copy the text from your resume PDF or Word doc."
              maxLength={5000}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono leading-relaxed"
            />
            <p className="text-xs text-right text-gray-400 mt-1">{resumeText.length}/5000</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button type="submit" disabled={resumeText.length < 50 || loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing your resume...</>
            ) : (
              <><FileText className="w-4 h-4" /> Analyze Resume</>
            )}
          </button>
        </form>
      ) : (
        /* Results */
        <div className="space-y-6">
          {/* Score + experience */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-xl bg-gray-50 dark:bg-gray-800">
            <CircularScore score={result.overallScore} />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Experience</p>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{result.experience}</p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2.5">
              Detected Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {result.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Strengths & improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ResultSection
              icon={CheckCircle}
              title="Strengths"
              items={result.strengths}
              color="text-emerald-600"
            />
            <ResultSection
              icon={AlertCircle}
              title="Areas to Improve"
              items={result.improvements}
              color="text-amber-600"
            />
          </div>

          {/* Job suggestions */}
          <ResultSection
            icon={Briefcase}
            title="Suggested Job Titles"
            items={result.jobSuggestions}
            color="text-indigo-600"
          />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setResult(null)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Analyze Another Resume
            </button>
            {result.jobSuggestions[0] && (
              <a
                href={`/jobs?search=${encodeURIComponent(result.jobSuggestions[0])}`}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium text-center hover:bg-indigo-700 transition-colors"
              >
                Find Matching Jobs
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
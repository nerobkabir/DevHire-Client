"use client";

import { useState }       from "react";
import { useRouter }      from "next/navigation";
import { Search, Loader2, Sparkles, ArrowRight, Tag, FolderOpen } from "lucide-react";
import { aiService }      from "@/services/ai.service";
import { getErrorMessage } from "@/lib/axios";

interface SearchResult {
  suggestion: string;
  keywords:   string[];
  categories: string[];
}

export function AISearchAssistant() {
  const router  = useRouter();
  const [query, setQuery]     = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<SearchResult | null>(null);
  const [error, setError]     = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await aiService.searchAssistant(query.trim());
      setResult(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordClick = (kw: string) =>
    router.push(`/jobs?search=${encodeURIComponent(kw)}`);

  const handleCategoryClick = (cat: string) =>
    router.push(`/jobs?category=${encodeURIComponent(cat)}`);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">AI Search Assistant</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Get AI-powered job search suggestions</p>
        </div>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
          <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you're looking for..."
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
          />
        </div>
        <button type="submit" disabled={!query.trim() || loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl" />
          <div>
            <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="flex gap-2">
              {[1,2,3].map((i) => <div key={i} className="w-20 h-7 bg-gray-200 dark:bg-gray-700 rounded-full" />)}
            </div>
          </div>
          <div>
            <div className="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="flex gap-2">
              {[1,2].map((i) => <div key={i} className="w-24 h-7 bg-gray-200 dark:bg-gray-700 rounded-full" />)}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-5">
          {/* Suggestion */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
                {result.suggestion}
              </p>
            </div>
          </div>

          {/* Keywords */}
          {result.keywords.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Suggested Keywords
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((kw) => (
                  <button key={kw} onClick={() => handleKeywordClick(kw)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 dark:hover:border-indigo-800 transition-colors">
                    {kw}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {result.categories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <FolderOpen className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Recommended Categories
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.categories.map((cat) => (
                  <button key={cat} onClick={() => handleCategoryClick(cat)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                    {cat}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => router.push(`/jobs?search=${encodeURIComponent(query)}`)}
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
            Search Jobs with These Terms
          </button>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Describe your ideal job and our AI will suggest the best keywords and categories.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            e.g. "I want a remote React job at a startup"
          </p>
        </div>
      )}
    </div>
  );
}
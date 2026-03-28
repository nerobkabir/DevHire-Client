"use client";

import { useState, useEffect } from "react";
import { Star, Loader2, Sparkles } from "lucide-react";
import { reviewService }  from "@/services/review.service";
import { aiService }      from "@/services/ai.service";
import { useAuth }        from "@/contexts/AuthContext";
import { timeAgo }        from "@/lib/utils";
import { getErrorMessage } from "@/lib/axios";
import type { Review }    from "@/types";

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false }: {
  value: number; onChange?: (v: number) => void; readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type={readonly ? "button" : "button"}
          disabled={readonly}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => !readonly && setHover(i)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer"}`}
        >
          <Star className={`w-4 h-4 transition-colors ${
            i <= (hover || value)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`} />
        </button>
      ))}
    </div>
  );
}

// ── AI Summary card ───────────────────────────────────────────────────────────
function AISummaryCard({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<{
    summary: string; sentiment: string; avgRating: number; highlights: string[];
  } | null>(null);
  const [error, setError]     = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await aiService.summarizeReviews(jobId);
      setSummary(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const sentimentColor = {
    positive: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
    neutral:  "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
    negative: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
  };

  if (!summary) {
    return (
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/10 disabled:opacity-50 transition-all"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating AI summary...</> : <><Sparkles className="w-4 h-4" /> Generate AI Review Summary</>}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">AI Review Summary</h4>
        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
          sentimentColor[summary.sentiment as keyof typeof sentimentColor] ?? sentimentColor.neutral
        }`}>
          {summary.sentiment}
        </span>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{summary.summary}</p>

      {summary.highlights.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {summary.highlights.map((h, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900 text-gray-700 dark:text-gray-300">
              {h}
            </span>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Review section ────────────────────────────────────────────────────────────
export function ReviewSection({ jobId }: { jobId: string }) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews]     = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]           = useState({ rating: 0, comment: "" });
  const [formError, setFormError] = useState("");
  const [success, setSuccess]     = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await reviewService.getByJob(jobId, { limit: 10 });
      setReviews(res.data);
      setAvgRating(res.meta.avgRating);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) { setFormError("Please select a rating"); return; }
    if (form.comment.trim().length < 10) { setFormError("Comment must be at least 10 characters"); return; }

    setSubmitting(true);
    setFormError("");
    try {
      await reviewService.create({ jobId, ...form });
      setSuccess(true);
      setForm({ rating: 0, comment: "" });
      fetchReviews();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reviews</h2>
          {avgRating > 0 && (
            <div className="flex items-center gap-1.5">
              <StarRating value={Math.round(avgRating)} readonly />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{avgRating}</span>
              <span className="text-sm text-gray-400">({reviews.length})</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {reviews.length > 0 && (
        <div className="mb-6">
          <AISummaryCard jobId={jobId} />
        </div>
      )}

      {/* Review list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="w-2/3 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
          No reviews yet. Be the first to review this job.
        </p>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map((review) => {
            const reviewer = typeof review.userId === "object" ? review.userId : null;
            return (
              <div key={review.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {reviewer?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {reviewer?.name ?? "Anonymous"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating value={review.rating} readonly />
                    <span className="text-xs text-gray-400">{timeAgo(review.createdAt)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Add review form */}
      {isAuthenticated && !success && (
        <div className="mt-6 p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Your rating</label>
              <StarRating value={form.rating} onChange={(v) => setForm((p) => ({ ...p, rating: v }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Your review</label>
              <textarea
                value={form.comment}
                onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
                rows={3}
                placeholder="Share your thoughts about this job opportunity..."
                maxLength={1000}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
            {formError && <p className="text-xs text-red-500">{formError}</p>}
            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {success && (
        <div className="mt-4 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">✓ Review submitted successfully!</p>
        </div>
      )}
    </section>
  );
}
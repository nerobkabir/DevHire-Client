"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, Pencil, Loader2, X, Check } from "lucide-react";
import { reviewService }   from "@/services/review.service";
import { useAuth }         from "@/contexts/AuthContext";
import { timeAgo }         from "@/lib/utils";
import { getErrorMessage } from "@/lib/axios";
import { applicationService } from "@/services/application.service";
import type { Review }     from "@/types";

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
      ))}
    </div>
  );
}

export default function MyReviews() {
  const { user }              = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId]   = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ rating: 0, comment: "" });
  const [saving, setSaving]   = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
  if (!user) return;

  const fetchMyReviews = async () => {
    setLoading(true);
    try {
      // ১. user-এর applications থেকে jobId গুলো নাও
      const appsRes = await applicationService.getMine({ limit: 50 });
      const jobIds  = appsRes.data
        .map((a) => typeof a.jobId === "object" ? a.jobId.id : a.jobId)
        .filter(Boolean) as string[];

      if (jobIds.length === 0) { setLoading(false); return; }

      // ২. প্রতিটা job-এর reviews fetch করো, user-এর reviews filter করো
      const allReviews: Review[] = [];
      await Promise.all(
        jobIds.map(async (jobId) => {
          try {
            const res = await reviewService.getByJob(jobId, { limit: 50 });
            const mine = res.data.filter((r) => {
              const reviewUserId = typeof r.userId === "object" ? r.userId.id : r.userId;
              return reviewUserId === user.id;
            });
            allReviews.push(...mine);
          } catch {}
        })
      );

      setReviews(allReviews);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  fetchMyReviews();
}, [user]);

  const handleEdit = (review: Review) => {
    setEditId(review.id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      const updated = await reviewService.update(id, editForm);
      setReviews((prev) => prev.map((r) => r.id === id ? updated : r));
      setEditId(null);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    setDeletingId(id);
    try {
      await reviewService.delete(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally { setDeletingId(null); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl py-16 text-center">
          <Star className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">You haven&apos;t written any reviews yet.</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Browse jobs and share your experience.</p>
        </div>
      ) : (
        reviews.map((review) => {
          const job = typeof review.jobId === "object" ? review.jobId : null;
          const isEditing = editId === review.id;

          return (
            <div key={review.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{job?.title ?? "Job"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{job?.company} · {timeAgo(review.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StarDisplay value={review.rating} />
                  {!isEditing && (
                    <>
                      <button onClick={() => handleEdit(review)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors disabled:opacity-50">
                        {deletingId === review.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <button key={i} onClick={() => setEditForm((p) => ({ ...p, rating: i }))}>
                        <Star className={`w-5 h-5 cursor-pointer transition-colors ${i <= editForm.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={editForm.comment}
                    onChange={(e) => setEditForm((p) => ({ ...p, comment: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(review.id)} disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                      {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Save
                    </button>
                    <button onClick={() => setEditId(null)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
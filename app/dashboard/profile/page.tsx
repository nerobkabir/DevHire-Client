"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, X, Check } from "lucide-react";
import { useAuth }         from "@/contexts/AuthContext";
import { userService }     from "@/services/user.service";
import { getErrorMessage } from "@/lib/axios";

export default function ProfileSettings() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    name:   "",
    email:  "",
    bio:    "",
    github: "",
    avatar: "",
  });
  const [skills, setSkills]     = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name:   user.name   ?? "",
        email:  user.email  ?? "",
        bio:    user.bio    ?? "",
        github: user.github ?? "",
        avatar: user.avatar ?? "",
      });
      setSkills(user.skills ?? []);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await userService.update(user.id, { ...form, skills });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => setSkills((prev) => prev.filter((s) => s !== skill));

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Avatar preview */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden flex-shrink-0">
              {form.avatar
                ? <img src={form.avatar} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                : user?.name?.[0]?.toUpperCase()
              }
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{form.name || "Your Name"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full name</label>
              <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="John Doe" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email address</label>
              <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="you@example.com" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Bio & links */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">About You</h3>

          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              rows={3}
              placeholder="Tell recruiters a bit about yourself, your experience and what you're looking for..."
              maxLength={500}
              className={`${inputClass} resize-none`}
            />
            <p className="text-xs text-right text-gray-400 mt-1">{form.bio.length}/500</p>
          </div>

          <div>
            <label className={labelClass}>GitHub URL</label>
            <input type="url" value={form.github} onChange={(e) => setForm((p) => ({ ...p, github: e.target.value }))} placeholder="https://github.com/yourusername" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Avatar URL</label>
            <input type="url" value={form.avatar} onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.value }))} placeholder="https://example.com/avatar.jpg" className={inputClass} />
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Skills</h3>

          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              placeholder="Add a skill (e.g. React, Node.js)..."
              className={`${inputClass} flex-1`}
            />
            <button type="button" onClick={addSkill}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 flex items-center gap-1.5 flex-shrink-0 transition-colors">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Feedback */}
        {error   && <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">{error}</div>}
        {success && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-600 dark:text-emerald-400">
            <Check className="w-4 h-4" /> Profile updated successfully!
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
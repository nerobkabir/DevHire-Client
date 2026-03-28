"use client";

import { useState }           from "react";
import { useRouter }          from "next/navigation";
import { Loader2, Sparkles, Check } from "lucide-react";
import { jobService }         from "@/services/job.service";
import { aiService }          from "@/services/ai.service";
import { useAuth }            from "@/contexts/AuthContext";
import { getErrorMessage }    from "@/lib/axios";

const CATEGORIES = ["Frontend","Backend","Fullstack","DevOps","Mobile","Data","AI/ML","QA","Design","Other"];
const JOB_TYPES  = ["Full-time","Part-time","Contract","Remote","Internship"];

interface FormState {
  title:       string;
  description: string;
  company:     string;
  salary:      string;
  location:    string;
  category:    string;
  jobType:     string;
  skillInput:  string;
  skills:      string[];
}

interface FormErrors {
  title?:       string;
  description?: string;
  company?:     string;
  salary?:      string;
  location?:    string;
  skillInput?:  string;
}

const INITIAL: FormState = {
  title: "", description: "", company: "", salary: "", location: "",
  category: "Frontend", jobType: "Full-time", skillInput: "", skills: [],
};

export default function PostJobPage() {
  const router      = useRouter();
  const { user }    = useAuth();
  const [form, setForm]       = useState<FormState>(INITIAL);
  const [errors, setErrors]   = useState<FormErrors>({});
  const [saving, setSaving]   = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof FormState, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  // ── AI generate description ───────────────────────────────────────────────
  const handleAiGenerate = async () => {
    if (!form.title || !form.company) {
      setErrors({
        title:   !form.title   ? "Required for AI" : undefined,
        company: !form.company ? "Required for AI" : undefined,
      });
      return;
    }
    setAiLoading(true);
    try {
      const res = await aiService.generateDescription({
        title:    form.title,
        company:  form.company,
        skills:   form.skills,
        location: form.location || undefined,
      });
      setForm((p) => ({ ...p, description: res.description }));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally { setAiLoading(false); }
  };

  // ── Add / remove skill ────────────────────────────────────────────────────
  const addSkill = () => {
    const s = form.skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm((p) => ({ ...p, skills: [...p.skills, s], skillInput: "" }));
    } else {
      setForm((p) => ({ ...p, skillInput: "" }));
    }
  };

  const removeSkill = (skill: string) =>
    setForm((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.title.trim())       e.title       = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.company.trim())     e.company     = "Company is required";
    if (!form.salary || isNaN(Number(form.salary)) || Number(form.salary) < 0)
      e.salary = "Valid salary is required";
    if (!form.location.trim())    e.location    = "Location is required";
    if (form.skills.length === 0) e.skillInput  = "Add at least one skill";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await jobService.create({
        title:          form.title.trim(),
        description:    form.description.trim(),
        company:        form.company.trim(),
        salary:         Number(form.salary),
        location:       form.location.trim(),
        category:       form.category as any,
        jobType:        form.jobType  as any,
        requiredSkills: form.skills,
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/my-jobs"), 1500);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally { setSaving(false); }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";
  const errorClass = "mt-1 text-xs text-red-500";

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <Check className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">Job Posted Successfully!</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to My Jobs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Basic info */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Job Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Job Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Senior React Developer"
                className={inputClass}
              />
              {errors.title && <p className={errorClass}>{errors.title}</p>}
            </div>
            <div>
              <label className={labelClass}>Company Name *</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="e.g. Acme Corp"
                className={inputClass}
              />
              {errors.company && <p className={errorClass}>{errors.company}</p>}
            </div>
            <div>
              <label className={labelClass}>Location *</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Remote, New York"
                className={inputClass}
              />
              {errors.location && <p className={errorClass}>{errors.location}</p>}
            </div>
            <div>
              <label className={labelClass}>Annual Salary (USD) *</label>
              <input
                type="number"
                min={0}
                value={form.salary}
                onChange={(e) => set("salary", e.target.value)}
                placeholder="e.g. 90000"
                className={inputClass}
              />
              {errors.salary && <p className={errorClass}>{errors.salary}</p>}
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={inputClass}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Job Type *</label>
              <select
                value={form.jobType}
                onChange={(e) => set("jobType", e.target.value)}
                className={inputClass}
              >
                {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Required Skills *</h3>
          <div className="flex flex-wrap gap-2 min-h-[32px]">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={form.skillInput}
              onChange={(e) => set("skillInput", e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              placeholder="Type a skill and press Enter"
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              Add
            </button>
          </div>
          {errors.skillInput && <p className={errorClass}>{errors.skillInput}</p>}
        </div>

        {/* Description with AI */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Job Description *</h3>
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={aiLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/30 disabled:opacity-50 transition-colors"
            >
              {aiLoading
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                : <><Sparkles className="w-3.5 h-3.5" /> AI Generate</>
              }
            </button>
          </div>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={8}
            placeholder="Describe the role, responsibilities, and requirements... or use AI to generate it."
            className={`${inputClass} resize-none`}
          />
          <p className="text-xs text-gray-400 text-right">{form.description.length} chars</p>
          {errors.description && <p className={errorClass}>{errors.description}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</>
            : "Post Job"
          }
        </button>
      </form>
    </div>
  );
}
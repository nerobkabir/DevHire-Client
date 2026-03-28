"use client";

import { useState }       from "react";
import { Mail, MapPin, Phone, Send, Loader2, Check } from "lucide-react";

const CONTACT_INFO = [
  { icon: Mail,    title: "Email",    value: "hello@devhire.com",    href: "mailto:hello@devhire.com"    },
  { icon: Phone,   title: "Phone",   value: "+1 (415) 555-0182",    href: "tel:+14155550182"             },
  { icon: MapPin,  title: "Office",  value: "340 Pine St, San Francisco, CA 94104", href: "#"            },
];

const SOCIAL = [
  { label: "GitHub",    href: "https://github.com",    icon: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )},
  { label: "LinkedIn",  href: "https://linkedin.com",  icon: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )},
  { label: "Twitter",   href: "https://twitter.com",   icon: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )},
];

const SUBJECTS = [
  "General Inquiry",
  "Bug Report",
  "Feature Request",
  "Partnership",
  "Press & Media",
  "Billing Question",
  "Other",
];

interface FormState { name: string; email: string; subject: string; message: string; }
interface FormErrors { name?: string; email?: string; subject?: string; message?: string; }

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.name.trim())                        e.name    = "Name is required";
  if (!f.email.trim())                       e.email   = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email   = "Enter a valid email";
  if (!f.subject)                            e.subject = "Please select a subject";
  if (!f.message.trim())                     e.message = "Message is required";
  else if (f.message.trim().length < 20)     e.message = "Message must be at least 20 characters";
  return e;
}

export default function ContactPage() {
  const [form, setForm]       = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors]   = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const set = (key: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";
  const errClass   = "mt-1 text-xs text-red-500";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 py-14 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Get in Touch</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Have a question, a partnership idea, or just want to say hi? We read every message and reply within 24 hours.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left: contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <div className="space-y-4">
                {CONTACT_INFO.map(({ icon: Icon, title, value, href }) => (
                  <a key={title} href={href}
                    className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                      <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">{title}</p>
                      <p className="text-sm text-gray-900 dark:text-white">{value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Follow Us</h3>
              <div className="flex items-center gap-3">
                {SOCIAL.map(({ label, href, icon: Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Typical Response Time</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-300">
                We reply to all messages within 24 hours on business days. For urgent matters, please use our email directly.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                      Thanks for reaching out, {form.name.split(" ")[0]}. We&apos;ll get back to you at {form.email} within 24 hours.
                    </p>
                  </div>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full name</label>
                      <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="John Doe" className={inputClass} />
                      {errors.name && <p className={errClass}>{errors.name}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Email address</label>
                      <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={inputClass} />
                      {errors.email && <p className={errClass}>{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Subject</label>
                    <select value={form.subject} onChange={(e) => set("subject", e.target.value)} className={inputClass}>
                      <option value="">Select a subject...</option>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.subject && <p className={errClass}>{errors.subject}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      rows={6}
                      placeholder="Tell us how we can help..."
                      className={`${inputClass} resize-none`}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {errors.message ? <p className={errClass}>{errors.message}</p> : <span />}
                      <p className="text-xs text-gray-400">{form.message.length} chars</p>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {loading
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                      : <><Send className="w-4 h-4" /> Send Message</>
                    }
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
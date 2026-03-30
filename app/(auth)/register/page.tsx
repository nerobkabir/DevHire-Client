"use client";

import { useState, useEffect }         from "react";
import { useRouter }                   from "next/navigation";
import Link                            from "next/link";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useAuth }                     from "@/contexts/AuthContext";
import { getErrorMessage }             from "@/lib/axios";

// Form state 
interface FormState {
  name:     string;
  email:    string;
  password: string;
  role:     "USER" | "RECRUITER";
}

interface FormErrors {
  name?:     string;
  email?:    string;
  password?: string;
  general?:  string;
}

// Validation
function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim())                             errors.name     = "Name is required";
  else if (form.name.trim().length < 2)              errors.name     = "Name must be at least 2 characters";
  if (!form.email.trim())                            errors.email    = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(form.email))      errors.email    = "Enter a valid email";
  if (!form.password)                                errors.password = "Password is required";
  else if (form.password.length < 6)                 errors.password = "Password must be at least 6 characters";
  else if (!/\d/.test(form.password))                errors.password = "Password must contain at least one number";
  return errors;
}

// Password strength
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 6)   score++;
  if (password.length >= 10)  score++;
  if (/\d/.test(password))    score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak",   color: "bg-red-500"    };
  if (score <= 3) return { score, label: "Fair",   color: "bg-yellow-500" };
  return              { score, label: "Strong", color: "bg-emerald-500" };
}

// Component
export default function RegisterPage() {
  const router               = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [form, setForm]         = useState<FormState>({ name: "", email: "", password: "", role: "USER" });
  const [errors, setErrors]     = useState<FormErrors>({});
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined, general: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await register(form);
      router.push("/dashboard");
    } catch (err) {
      setErrors({ general: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Join thousands of developers and companies
          </p>
        </div>

        {/* Google login (UI only) */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400 dark:text-gray-500">or register with email</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {(["USER", "RECRUITER"] as const).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setForm((p) => ({ ...p, role }))}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                form.role === role
                  ? role === "USER"
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <span className="text-2xl">{role === "USER" ? "💻" : "🏢"}</span>
              <div className="text-center">
                <p className={`text-sm font-semibold ${
                  form.role === role
                    ? role === "USER" ? "text-indigo-600 dark:text-indigo-400" : "text-emerald-600 dark:text-emerald-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}>
                  {role === "USER" ? "Developer" : "Recruiter"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {role === "USER" ? "Find jobs" : "Post jobs"}
                </p>
              </div>
              {form.role === role && (
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  role === "USER" ? "bg-indigo-600" : "bg-emerald-600"
                }`}>
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* General error */}
        {errors.general && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-gray-800 border text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                errors.name ? "border-red-400 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-gray-800 border text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                errors.email ? "border-red-400 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters with a number"
                className={`w-full px-4 py-2.5 pr-11 rounded-lg text-sm bg-white dark:bg-gray-800 border text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.password ? "border-red-400 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength indicator */}
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= strength.score ? strength.color : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Strength: <span className={`font-medium ${
                    strength.label === "Strong" ? "text-emerald-500" :
                    strength.label === "Fair"   ? "text-yellow-500"  :
                    "text-red-500"
                  }`}>{strength.label}</span>
                </p>
              </div>
            )}

            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect }  from "react";
import { useRouter }            from "next/navigation";
import Link                     from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth }              from "@/contexts/AuthContext";
import { getErrorMessage }      from "@/lib/axios";

// Demo credentials
const DEMO_ACCOUNTS = [
  { label: "User Demo",      email: "user@devhire.com",      password: "user123",      role: "USER"      },
  { label: "Recruiter Demo", email: "recruiter@devhire.com", password: "recruiter123", role: "RECRUITER" },
  { label: "Admin Demo",     email: "admin@devhire.com",     password: "admin123",     role: "ADMIN"     },
] as const;

// Form state 
interface FormState {
  email:    string;
  password: string;
}

interface FormErrors {
  email?:    string;
  password?: string;
  general?:  string;
}

// Validation 
function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.email.trim())                   errors.email    = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email";
  if (!form.password)                       errors.password = "Password is required";
  return errors;
}

// Component 
export default function LoginPage() {
  const router              = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [form, setForm]         = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors]     = useState<FormErrors>({});
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  // Redirect if already logged in
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
      await login({ email: form.email, password: form.password });
      router.push("/dashboard");
    } catch (err) {
      setErrors({ general: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (account: typeof DEMO_ACCOUNTS[number]) => {
    setDemoLoading(account.role);
    try {
      await login({ email: account.email, password: account.password });
      router.push("/dashboard");
    } catch (err) {
      setErrors({ general: getErrorMessage(err) });
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Sign in to your DevHire account
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
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400 dark:text-gray-500">or sign in with email</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* General error */}
        {errors.general && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                errors.email
                  ? "border-red-400 dark:border-red-600"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-2.5 pr-11 rounded-lg text-sm bg-white dark:bg-gray-800 border text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.password
                    ? "border-red-400 dark:border-red-600"
                    : "border-gray-300 dark:border-gray-600"
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
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>

      {/* Demo login cards */}
      <div className="mt-6">
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-3 font-medium uppercase tracking-wide">
          Quick Demo Login
        </p>
        <div className="grid grid-cols-3 gap-3">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.role}
              onClick={() => handleDemoLogin(account)}
              disabled={!!demoLoading}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                account.role === "ADMIN"
                  ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20"
                  : account.role === "RECRUITER"
                  ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
                  : "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/10 hover:bg-indigo-100 dark:hover:bg-indigo-900/20"
              }`}
            >
              {demoLoading === account.role ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              ) : (
                <span className="text-lg">
                  {account.role === "ADMIN" ? "👑" : account.role === "RECRUITER" ? "🏢" : "💻"}
                </span>
              )}
              <span className={`text-xs font-medium ${
                account.role === "ADMIN"
                  ? "text-red-600 dark:text-red-400"
                  : account.role === "RECRUITER"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-indigo-600 dark:text-indigo-400"
              }`}>
                {account.role === "USER" ? "Developer" : account.role === "RECRUITER" ? "Recruiter" : "Admin"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
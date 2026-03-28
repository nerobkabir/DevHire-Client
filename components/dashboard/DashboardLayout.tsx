"use client";

import { useState }          from "react";
import Link                  from "next/link";
import { usePathname }       from "next/navigation";
import { useTheme }          from "next-themes";
import {
  LayoutDashboard, FileText, Star, User,
  Briefcase, LogOut, Menu, X, Sun, Moon,
  ChevronDown, Settings,
} from "lucide-react";
import { useAuth }      from "@/contexts/AuthContext";
import { getInitials }  from "@/lib/utils";

// ── Nav items per role ────────────────────────────────────────────────────────
const USER_NAV = [
  { label: "Overview",     href: "/dashboard",              icon: LayoutDashboard },
  { label: "Applications", href: "/dashboard/applications", icon: FileText        },
  { label: "My Reviews",   href: "/dashboard/reviews",      icon: Star            },
  { label: "Profile",      href: "/dashboard/profile",      icon: User            },
];

const RECRUITER_NAV = [
  { label: "Overview",     href: "/dashboard",                  icon: LayoutDashboard },
  { label: "My Jobs",      href: "/dashboard/my-jobs",          icon: Briefcase       },
  { label: "Applications", href: "/dashboard/applications",     icon: FileText        },
  { label: "Post Job",     href: "/dashboard/post-job",         icon: FileText        },
  { label: "Profile",      href: "/dashboard/profile",          icon: User            },
];

const ADMIN_NAV = [
  { label: "Overview",     href: "/dashboard",                  icon: LayoutDashboard },
  { label: "Users",        href: "/dashboard/users",            icon: User            },
  { label: "Jobs",         href: "/dashboard/jobs",             icon: Briefcase       },
  { label: "Analytics",    href: "/dashboard/analytics",        icon: Star            },
  { label: "Profile",      href: "/dashboard/profile",          icon: Settings        },
];

// ── Theme toggle ──────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({
  navItems, open, onClose,
}: {
  navItems: typeof USER_NAV;
  open:     boolean;
  onClose:  () => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white">
              Dev<span className="text-indigo-600">Hire</span>
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {user?.avatar
                ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                : getInitials(user?.name ?? "U")
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${
                user?.role === "ADMIN"     ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"   :
                user?.role === "RECRUITER" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
                "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(href)
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Dashboard Navbar ──────────────────────────────────────────────────────────
function DashboardNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout }  = useAuth();
  const pathname          = usePathname();
  const [dropOpen, setDropOpen] = useState(false);

  // Page title from pathname
  const pageTitle = pathname === "/dashboard"               ? "Overview"
    : pathname.includes("/applications")                    ? "My Applications"
    : pathname.includes("/reviews")                         ? "My Reviews"
    : pathname.includes("/profile")                         ? "Profile Settings"
    : pathname.includes("/my-jobs")                         ? "My Jobs"
    : pathname.includes("/post-job")                        ? "Post a Job"
    : pathname.includes("/users")                           ? "Manage Users"
    : pathname.includes("/analytics")                       ? "Analytics"
    : "Dashboard";

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
              {user?.avatar
                ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                : getInitials(user?.name ?? "U")
              }
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
              {user?.name}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropOpen ? "rotate-180" : ""}`} />
          </button>

          {dropOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg py-1 z-50">
              <Link href="/dashboard/profile" onClick={() => setDropOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                <User className="w-3.5 h-3.5 text-gray-400" /> Profile
              </Link>
              <Link href="/dashboard/profile" onClick={() => setDropOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Settings className="w-3.5 h-3.5 text-gray-400" /> Settings
              </Link>
              <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
              <button onClick={() => { logout(); setDropOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems =
    user?.role === "ADMIN"     ? ADMIN_NAV     :
    user?.role === "RECRUITER" ? RECRUITER_NAV :
    USER_NAV;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar
        navItems={navItems}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
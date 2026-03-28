import Link from "next/link";

const CATEGORIES = [
  { label: "Frontend",  icon: "🎨", count: 320, color: "bg-pink-50 dark:bg-pink-900/20 border-pink-100 dark:border-pink-900 text-pink-600 dark:text-pink-400"    },
  { label: "Backend",   icon: "⚙️", count: 410, color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400"     },
  { label: "Fullstack", icon: "💻", count: 280, color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400" },
  { label: "DevOps",    icon: "🛠️", count: 150, color: "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900 text-orange-600 dark:text-orange-400" },
  { label: "Mobile",    icon: "📱", count: 190, color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900 text-purple-600 dark:text-purple-400" },
  { label: "Data",      icon: "📊", count: 230, color: "bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-900 text-teal-600 dark:text-teal-400"       },
  { label: "AI/ML",     icon: "🤖", count: 175, color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400" },
  { label: "QA",        icon: "🔍", count: 120, color: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900 text-red-600 dark:text-red-400"           },
  { label: "Design",    icon: "✏️", count: 95,  color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900 text-yellow-600 dark:text-yellow-400" },
  { label: "Other",     icon: "🌐", count: 210, color: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"         },
];

export function JobCategories() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">Explore by Role</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Job Categories</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
            From frontend to AI/ML, find opportunities that match your skills and passion.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map(({ label, icon, count, color }) => (
            <Link
              key={label}
              href={`/jobs?category=${label}`}
              className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border h-[140px] justify-center hover:scale-105 transition-all duration-200 ${color}`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
              <div className="text-center">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs opacity-70 mt-0.5">{count} jobs</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
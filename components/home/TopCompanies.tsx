import Link from "next/link";

const COMPANIES = [
  { name: "Stripe",    jobs: 24, initials: "ST", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" },
  { name: "Vercel",    jobs: 18, initials: "VR", color: "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"              },
  { name: "Shopify",   jobs: 31, initials: "SH", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" },
  { name: "Figma",     jobs: 12, initials: "FG", color: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300"       },
  { name: "MongoDB",   jobs: 20, initials: "MG", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"   },
  { name: "Atlassian", jobs: 27, initials: "AT", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"       },
  { name: "Notion",    jobs: 9,  initials: "NT", color: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"          },
  { name: "Linear",    jobs: 14, initials: "LN", color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" },
];

export function TopCompanies() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">Featured Employers</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Top Companies Hiring Now</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3">
            Join world-class teams at companies that invest in their developers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {COMPANIES.map(({ name, jobs, initials, color }) => (
            <Link
              key={name}
              href={`/jobs?search=${name}`}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all h-[130px] justify-center bg-white dark:bg-gray-900"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${color}`}>
                {initials}
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">{name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{jobs} jobs</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
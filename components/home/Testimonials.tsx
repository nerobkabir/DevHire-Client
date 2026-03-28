const TESTIMONIALS = [
  {
    name:    "Arjun Sharma",
    role:    "Senior Frontend Developer",
    company: "Hired at Stripe",
    avatar:  "AS",
    rating:  5,
    color:   "bg-indigo-600",
    text:    "DevHire completely changed my job search. The AI resume analyzer pointed out gaps I never noticed, and within 3 weeks I had 5 interviews lined up. I landed my dream job at Stripe in less than a month!",
  },
  {
    name:    "Priya Mehta",
    role:    "Engineering Manager",
    company: "Shopify",
    avatar:  "PM",
    rating:  5,
    color:   "bg-emerald-600",
    text:    "As a recruiter, DevHire saves us hours every week. The applicant profiles are detailed, and the platform makes it easy to filter by the exact skills we need. We've hired 12 developers through DevHire this year alone.",
  },
  {
    name:    "Karim Hassan",
    role:    "Full Stack Developer",
    company: "Hired at MongoDB",
    avatar:  "KH",
    rating:  5,
    color:   "bg-purple-600",
    text:    "The AI chatbot helped me figure out exactly which roles to apply for based on my skills. The cover letter suggestions were incredibly specific. Best job platform I have ever used — period.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < count ? "text-yellow-400" : "text-gray-200 dark:text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">Success Stories</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What Our Users Say</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3">
            Real stories from developers and recruiters who found success on DevHire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, company, avatar, rating, color, text }) => (
            <div
              key={name}
              className="flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-7 h-[280px]"
            >
              {/* Quote mark */}
              <div className="text-4xl text-indigo-200 dark:text-indigo-800 font-serif leading-none mb-3">&ldquo;</div>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1 line-clamp-5">
                {text}
              </p>

              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-50 dark:border-gray-800">
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{role} · {company}</p>
                </div>
                <StarRating count={rating} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
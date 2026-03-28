import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const POSTS: Record<string, { title: string; category: string; date: string; readTime: string; content: string }> = {
  "top-skills-2025": {
    title: "Top Developer Skills in Demand for 2025",
    category: "Career",
    date: "March 15, 2025",
    readTime: "5 min read",
    content: `The tech industry continues to evolve rapidly. In 2025, the most in-demand skills include TypeScript, React, Node.js, cloud platforms like AWS and GCP, and AI/ML integration. Developers who combine strong fundamentals with modern tooling are landing the best roles.

Full-stack capabilities are increasingly expected even for specialized roles. Knowing both frontend and backend gives you a significant edge in the job market.

Soft skills like communication, collaboration, and the ability to learn quickly remain just as important as technical skills. Companies want developers who can grow with the team.`,
  },
  "remote-work-tips": {
    title: "How to Land a Remote Developer Job",
    category: "Remote Work",
    date: "March 10, 2025",
    readTime: "4 min read",
    content: `Remote work has become the norm for many developers. To stand out, you need a strong GitHub profile, a portfolio with real projects, and clear communication skills.

Tailor your resume for each application. Highlight experience with async communication tools like Slack, Notion, and Jira. Show that you can manage your own time effectively.

Many remote roles are posted on platforms like DevHire, We Work Remotely, and Remote OK. Apply consistently and follow up professionally.`,
  },
  "resume-tips": {
    title: "Writing a Developer Resume That Gets Noticed",
    category: "Resume",
    date: "March 5, 2025",
    readTime: "6 min read",
    content: `Your resume is your first impression. Keep it to one page, use clear section headers, and lead with your strongest projects. Recruiters spend less than 10 seconds on an initial scan.

Quantify your impact wherever possible. Instead of "built a dashboard", say "built a dashboard that reduced reporting time by 40%". Numbers catch attention.

Include links to your GitHub, portfolio, and LinkedIn. Make sure your GitHub has pinned repositories with good READMEs. Use DevHire's AI Resume Analyzer to get instant feedback.`,
  },
  "interview-prep": {
    title: "Cracking the Technical Interview in 2025",
    category: "Interview",
    date: "Feb 28, 2025",
    readTime: "7 min read",
    content: `Technical interviews have evolved. Most companies now include system design, behavioral questions, and take-home projects alongside DSA problems.

Practice on LeetCode focusing on arrays, strings, trees, and graphs. For system design, study concepts like load balancing, caching, databases, and microservices.

Behavioral questions follow the STAR format — Situation, Task, Action, Result. Prepare 5-6 strong stories from your experience that demonstrate leadership, problem-solving, and teamwork.`,
  },
  "open-source": {
    title: "How Contributing to Open Source Boosts Your Career",
    category: "Growth",
    date: "Feb 20, 2025",
    readTime: "5 min read",
    content: `Open source contributions are one of the best ways to build credibility as a developer. They show real-world collaboration skills, code quality, and initiative.

Start small — fix typos, improve documentation, or solve good-first-issues. Popular projects to contribute to include React, Next.js, VS Code extensions, and developer tools.

Over time, meaningful contributions can lead to job offers, speaking opportunities, and a strong professional network. Many top developers got their first job through open source.`,
  },
  "salary-negotiation": {
    title: "Negotiating Your Developer Salary With Confidence",
    category: "Career",
    date: "Feb 15, 2025",
    readTime: "4 min read",
    content: `Salary negotiation is a skill most developers avoid — but it can mean tens of thousands of dollars over your career. Always negotiate. Employers expect it.

Research market rates on Glassdoor, Levels.fyi, and LinkedIn Salary. Know your number before the conversation. When asked for your expectation, give a range with your target at the lower end.

Focus on value, not need. "Based on my experience with TypeScript and system design, and the market rate for this role, I was expecting X" is far stronger than "I need more money".`,
  },
};

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Post not found
          </h1>
          <Link href="/blog" className="text-indigo-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600" />

          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                {post.category}
              </span>
              <span className="text-xs text-gray-400">{post.date}</span>
              <span className="text-xs text-gray-400">{post.readTime}</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>

            <div className="prose dark:prose-invert max-w-none">
              {post.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 text-center">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Ready to apply what you learned?
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Browse Jobs on DevHire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
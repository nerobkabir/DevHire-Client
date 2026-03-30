import type { Metadata } from "next";
import Link              from "next/link";
import { Target, Heart, Zap, Shield, Users, Briefcase, Building2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About — DevHire",
  description: "Learn about DevHire's mission to connect talented developers with the best companies in the world.",
};

// Data 
const TEAM = [
  {
    name:   "Sarah Chen",
    role:   "Co-Founder & CEO",
    bio:    "Former engineering lead at Stripe. Spent 8 years hiring developers and saw how broken the process was for both sides. Built DevHire to fix it.",
    avatar: "SC",
    color:  "bg-indigo-600",
    links:  { linkedin: "#", twitter: "#" },
  },
  {
    name:   "Marcus Williams",
    role:   "Co-Founder & CTO",
    bio:    "Full-stack engineer with 10+ years building developer tools. Previously at GitHub and Vercel. Obsessed with developer experience.",
    avatar: "MW",
    color:  "bg-emerald-600",
    links:  { linkedin: "#", github: "#" },
  },
  {
    name:   "Priya Patel",
    role:   "Head of AI & Product",
    bio:    "AI/ML engineer who led recommendation systems at LinkedIn. Brings deep expertise in matching algorithms and AI-powered career tools.",
    avatar: "PP",
    color:  "bg-purple-600",
    links:  { linkedin: "#", twitter: "#" },
  },
];

const STATS = [
  { icon: Users,     value: "15,000+", label: "Developers",    desc: "Active on the platform"        },
  { icon: Briefcase, value: "2,400+",  label: "Open Jobs",     desc: "Posted each month"             },
  { icon: Building2, value: "800+",    label: "Companies",     desc: "From startups to enterprises"  },
];

const VALUES = [
  {
    icon:  Target,
    title: "Developer-First",
    desc:  "Every product decision starts with one question: does this make a developer's job search easier? We optimize for candidates, not recruiters.",
    color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
  },
  {
    icon:  Heart,
    title: "Radical Transparency",
    desc:  "Salary ranges are always visible. Company culture information is honest. We believe hiding information wastes everyone's time.",
    color: "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
  },
  {
    icon:  Zap,
    title: "AI Without the Hype",
    desc:  "Our AI tools exist to save you time — not to replace human judgment. We use AI where it genuinely helps and stay out of the way everywhere else.",
    color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  },
  {
    icon:  Shield,
    title: "Privacy by Default",
    desc:  "Your profile is private until you choose to share it. We never sell candidate data or let recruiters cold-contact you without your consent.",
    color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-950">

      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 to-transparent dark:from-indigo-950/20 dark:to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 mb-6">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            We&apos;re fixing how developers
            <span className="text-indigo-600 dark:text-indigo-400"> find work</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
            Too many talented developers are stuck in a broken hiring process — ghosted by recruiters, buried by algorithms, and forced to negotiate salary in the dark. DevHire was built to change that.
          </p>
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            We&apos;re a small, focused team that has been on both sides of the hiring table. We know the frustration of spending months job hunting, and we know the pain of sifting through hundreds of mismatched applications. DevHire is our answer to both problems.
          </p>
        </div>
      </section>

      {/* Stats*/}
      <section className="bg-indigo-600 dark:bg-indigo-700 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {STATS.map(({ icon: Icon, value, label, desc }) => (
              <div key={label} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{value}</p>
                <p className="text-base font-semibold text-indigo-100">{label}</p>
                <p className="text-sm text-indigo-300 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What We Stand For</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              These aren&apos;t marketing words. They&apos;re principles that shape every feature we build and every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">The Team</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Small on headcount, big on experience. We&apos;ve been developers and recruiters, so we know what both sides need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map(({ name, role, bio, avatar, color }) => (
              <div key={name} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-7 text-center hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-white text-xl font-bold mx-auto mb-4`}>
                  {avatar}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-0.5">{name}</h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-3">{role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA*/}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to find your next role?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Join 15,000+ developers who have already found better jobs through DevHire.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/jobs" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
              Browse Jobs <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
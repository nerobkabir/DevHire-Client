import Link from "next/link";
import { Briefcase, Mail, MapPin, Phone } from "lucide-react";

// ─── Inline SVG brand icons (lucide-react v0.394+ removed brand icons) ────────
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterXIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ─── Footer links 
const FOOTER_LINKS = {
  platform: [
    { label: "Browse Jobs",    href: "/jobs"          },
    { label: "Companies",      href: "/companies"     },
    { label: "AI Tools",       href: "/ai-tools"      },
    { label: "Blog",           href: "/blog"          },
  ],
  company: [
    { label: "About Us",       href: "/about"         },
    { label: "Contact",        href: "/contact"       },
    { label: "Privacy Policy", href: "/privacy"       },
    { label: "Terms of Use",   href: "/terms"         },
  ],
  developers: [
    { label: "Create Account", href: "/register"      },
    { label: "Browse Jobs",    href: "/jobs"          },
    { label: "AI Resume Check",href: "/ai-tools"      },
    { label: "Dashboard",      href: "/dashboard"     },
  ],
  recruiters: [
    { label: "Post a Job",     href: "/dashboard/post-job"      },
    { label: "Manage Jobs",    href: "/dashboard/my-jobs"       },
    { label: "View Applicants",href: "/dashboard/applications"  },
    { label: "Sign Up",        href: "/register"                },
  ],
};

const SOCIAL_LINKS = [
  { label: "GitHub",   href: "https://github.com",   icon: GitHubIcon   },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedInIcon },
  { label: "Twitter",  href: "https://twitter.com",  icon: TwitterXIcon },
];

// ─── Footer component 
export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 w-fit mb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Dev<span className="text-indigo-400">Hire</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-500 mb-6 max-w-xs">
              Connecting talented developers with top companies. Your next opportunity is just one click away.
            </p>

            {/* Contact info */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <a
                  href="mailto:hello@devhire.com"
                  className="hover:text-indigo-400 transition-colors"
                >
                  hello@devhire.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>+1 (555) 000-0000</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <FooterLinkColumn title="Platform"   links={FOOTER_LINKS.platform}   />
          <FooterLinkColumn title="Company"    links={FOOTER_LINKS.company}    />
          <FooterLinkColumn title="Developers" links={FOOTER_LINKS.developers} />
          <FooterLinkColumn title="Recruiters" links={FOOTER_LINKS.recruiters} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} DevHire. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-gray-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Footer link column 
function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-gray-500 hover:text-indigo-400 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
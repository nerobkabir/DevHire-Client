import Link from "next/link";
import { Briefcase, Github, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";

// Footer links
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
    { label: "Post a Job",     href: "/dashboard/post-job" },
    { label: "Manage Jobs",    href: "/dashboard/my-jobs"  },
    { label: "View Applicants",href: "/dashboard/applications" },
    { label: "Sign Up",        href: "/register"           },
  ],
};

const SOCIAL_LINKS = [
  { label: "GitHub",   href: "https://github.com",   icon: Github   },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "Twitter",  href: "https://twitter.com",  icon: Twitter  },
];

// Component
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
                <a href="mailto:hello@devhire.com" className="hover:text-indigo-400 transition-colors">
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
                  <Icon className="w-4 h-4" />
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

// Footer link column 
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
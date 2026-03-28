import type { Metadata } from "next";
import { HeroSection }   from "@/components/home/HeroSection";
import { FeaturedJobs }  from "@/components/home/FeaturedJobs";
import { JobCategories } from "@/components/home/JobCategories";
import { HowItWorks }    from "@/components/home/HowItWorks";
import { StatsSection }  from "@/components/home/StatsSection";
import { TopCompanies }  from "@/components/home/TopCompanies";
import { Testimonials }  from "@/components/home/Testimonials";
import { AIBanner }      from "@/components/home/AIBanner";
import { NewsletterFAQ } from "@/components/home/NewsletterFAQ";

export const metadata: Metadata = {
  title: "DevHire — Find Developer Jobs or Hire Top Talent",
  description: "Connect talented developers with top companies. Browse thousands of tech jobs or post your opening today.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedJobs />
      <JobCategories />
      <HowItWorks />
      <StatsSection />
      <TopCompanies />
      <Testimonials />
      <AIBanner />
      <NewsletterFAQ />
    </>
  );
}
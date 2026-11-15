import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import ProofStrip from "@/components/ProofStrip";
import BuiltFor from "@/components/BuiltFor";
import StartHere from "@/components/StartHere";
import Services from "@/components/Services";
import Industries from "@/components/Industries";
import Engagement from "@/components/Engagement";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import { homepageFaqs } from "@/data/faqs";
import { getPublishedProjects } from "@/lib/cms";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/", site.title, site.description);

export default async function Home() {
  const projects = await getPublishedProjects();

  return (
    <>
      <Hero />
      <TechMarquee />
      <ProofStrip />
      <BuiltFor />
      <StartHere />
      <Services />
      <Industries />
      <Engagement />
      <Process />
      <Portfolio projects={projects} />
      <Testimonials />
      <FAQ />
      <Contact />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: homepageFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />
    </>
  );
}

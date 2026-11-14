import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import ProofStrip from "@/components/ProofStrip";
import Services from "@/components/Services";
import Industries from "@/components/Industries";
import Engagement from "@/components/Engagement";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import { getPublishedProjects } from "@/lib/cms";

export default async function Home() {
  const projects = await getPublishedProjects();

  return (
    <>
      <Hero />
      <TechMarquee />
      <ProofStrip />
      <Services />
      <Industries />
      <Engagement />
      <Process />
      <Portfolio projects={projects} />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}

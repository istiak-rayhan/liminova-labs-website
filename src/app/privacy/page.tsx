import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Liminova Labs collects, uses, and retains inquiry data.",
};

export default function PrivacyPolicy() {
  return (
    <main className="bg-white pb-16">
      <div className="max-w-3xl mx-auto px-6 pt-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last updated: 5 September 2026</p>

        <div className="space-y-6 text-slate-600 leading-relaxed">
          <p>
            This policy applies to {site.legalName} (“we”, “us”) and the website
            at {site.url}. We are a studio based in Dhaka, Bangladesh, serving
            clients worldwide. For privacy questions:{" "}
            <a href={`mailto:${site.email}`} className="text-emerald-600">
              {site.email}
            </a>
            .
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">What we collect</h2>
          <p>
            When you submit the contact form we collect name, work email,
            company, project type, budget band, timeline, and message. If you
            email us directly we also process the contents of that thread. We
            do not sell personal data.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">Why we collect it</h2>
          <p>
            Lawful basis: legitimate interests and, where you tick the consent
            box, consent to reply about your inquiry. We use the data to
            evaluate fit, reply, and — if we work together — to open a project
            file.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">Retention</h2>
          <p>
            Unsuccessful inquiries are deleted or archived within 24 months.
            Contracted project records are kept for the period required by the
            statement of work and applicable tax law.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">Processors</h2>
          <p>
            Email is sent through our configured mail transport (Gmail or a
            transactional provider). Hosting and analytics may be provided by
            Vercel. Vercel Analytics is first-party and does not use
            advertising cookies.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">Your rights</h2>
          <p>
            You may request access, correction, or deletion of inquiry data by
            emailing {site.email}. If you are in the EEA or UK you may also
            lodge a complaint with your local authority.
          </p>
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the Liminova Labs website and engaging the studio.",
};

export default function TermsOfService() {
  return (
    <main className="bg-white pb-16">
      <div className="max-w-3xl mx-auto px-6 pt-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Terms of Service</h1>
        <p className="text-slate-500 mb-8">Last updated: 5 September 2026</p>

        <div className="space-y-6 text-slate-600 leading-relaxed">
          <p>
            By using {site.url} you agree to these terms. {site.legalName} is
            the contracting studio. Project work is governed by a separate
            statement of work. If the two conflict, the statement of work
            wins.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">The website</h2>
          <p>
            Site content is for information. It is not an offer to contract.
            We may change pages without notice. Portfolio items are shown with
            permission or as anonymized case studies.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">Intellectual property</h2>
          <p>
            The Liminova Labs name, mark, and site copy remain ours. Client
            deliverables transfer as written in the statement of work, typically
            on final payment. You may not reuse our branding without written
            permission.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">Inquiries</h2>
          <p>
            Submitting a brief does not create a client relationship. We may
            decline work we cannot staff honestly. {site.responseSla}
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">Liability</h2>
          <p>
            The website is provided as-is. For project work, liability is
            limited to the fees paid under the relevant statement of work,
            except where the law forbids that limit.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">Governing law</h2>
          <p>
            These website terms are governed by the laws of Bangladesh, without
            prejudice to mandatory consumer protections in your country.
            Project contracts may specify a different venue.
          </p>

          <p>
            Questions:{" "}
            <a href={`mailto:${site.email}`} className="text-emerald-600">
              {site.email}
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

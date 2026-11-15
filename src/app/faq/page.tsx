import type { Metadata } from "next";
import Link from "next/link";
import { faqs } from "@/data/faqs";
import { getBookingHref, site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "/faq",
  "FAQ",
  "Pricing, ownership, timelines, and how to hire Liminova Labs for Flutter, Next.js, LMS, SEO, or an embedded engineer.",
);

export default function FaqPage() {
  return (
    <main className="bg-white pb-24">
      <div className="max-w-3xl mx-auto px-6 pt-16">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-4">
          FAQ
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Straight answers before you book.
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-12">
          {site.responseSla} Still unsure?{" "}
          <Link href={getBookingHref()} className="text-emerald-700 font-semibold">
            Book a consultation
          </Link>{" "}
          or{" "}
          <Link href="/#contact" className="text-emerald-700 font-semibold">
            send a brief
          </Link>
          .
        </p>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-1"
            >
              <summary className="cursor-pointer list-none py-4 font-semibold text-slate-900 flex items-center justify-between gap-4">
                {faq.question}
                <span className="text-emerald-500 group-open:rotate-45 transition-transform text-2xl leading-none">
                  +
                </span>
              </summary>
              <p className="pb-5 text-slate-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />
    </main>
  );
}

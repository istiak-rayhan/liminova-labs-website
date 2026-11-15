import type { Metadata } from "next";
import Link from "next/link";
import BookingSteps from "@/components/BookingSteps";
import TrackLink from "@/components/TrackLink";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "/book",
  "Book a consultation",
  "Book a working conversation with Liminova Labs about a Flutter app, Next.js platform, LMS, or growth engagement. We reply within one business day.",
);

export default function BookPage() {
  const calendly = site.calendly;

  return (
    <main className="bg-white pb-24">
      <div className="max-w-3xl mx-auto px-6 pt-16">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-4">
          Consultation
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Book a working conversation.
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          Thirty minutes. Product, not a pitch deck. {site.responseSla}
        </p>

        <BookingSteps />

        {calendly ? (
          <div className="mt-10 rounded-3xl overflow-hidden border border-slate-200 min-h-[720px] bg-slate-50">
            <iframe
              src={calendly}
              title="Schedule a consultation with Liminova Labs"
              className="w-full min-h-[720px]"
            />
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-slate-100 bg-slate-50 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Write first. We will find a time.
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Email a short brief or use the form. We will reply with a slot that
              overlaps your timezone.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`mailto:${site.email}?subject=Consultation%20with%20Liminova%20Labs`}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium"
              >
                Email {site.email}
              </a>
              <TrackLink
                href="/#contact"
                event="cta_brief_book_page"
                className="px-6 py-3 bg-white border border-slate-200 rounded-full font-medium text-slate-700"
              >
                Send a brief
              </TrackLink>
            </div>
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Prefer not to book a call?
          </h2>
          <p className="text-slate-600 leading-relaxed mb-5">
            Send a one-screen brief — budget, timeline, and what should exist in
            90 days. Same inbox, same reply SLA.
          </p>
          <TrackLink
            href="/#contact"
            event="cta_brief_book_alt"
            className="inline-flex items-center text-emerald-700 font-semibold hover:text-emerald-800"
          >
            Open the brief form →
          </TrackLink>
          <p className="mt-4 text-sm text-slate-500">
            Or email{" "}
            <Link href={`mailto:${site.email}`} className="font-medium text-slate-700">
              {site.email}
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

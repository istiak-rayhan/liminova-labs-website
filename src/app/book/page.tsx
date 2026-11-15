import type { Metadata } from "next";
import Link from "next/link";
import BookingCalendar from "@/components/BookingCalendar";
import BookingSteps from "@/components/BookingSteps";
import TrackLink from "@/components/TrackLink";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { upcomingSlots } from "@/lib/slots";

export const metadata: Metadata = pageMetadata(
  "/book",
  "Book a consultation",
  "Book a working conversation with Liminova Labs about a Flutter app, Next.js platform, LMS, or growth engagement. We reply within one business day.",
);

export default function BookPage() {
  const slots = upcomingSlots();

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

        <div className="mt-10 rounded-3xl border border-slate-100 bg-slate-50 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Pick a time.</h2>
          <p className="text-slate-600 mb-6">Weekdays, 10:00–16:30 Dhaka. We hold the slot and confirm by email.</p>
          <BookingCalendar slots={slots} />
        </div>

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

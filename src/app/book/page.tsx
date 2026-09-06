import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Book a consultation",
  description:
    "Pick a time with Liminova Labs or send a brief. We reply within one business day.",
};

export default function BookPage() {
  const calendly = site.calendly;

  return (
    <main className="bg-white pb-24">
      <div className="max-w-3xl mx-auto px-6 pt-16">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-4">
          Consultation
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Book a working conversation.
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          Thirty minutes. Product, not a pitch deck. {site.responseSla} If
          calendar is empty, send a brief — same inbox.
        </p>

        {calendly ? (
          <div className="rounded-3xl overflow-hidden border border-slate-200 min-h-[720px] bg-slate-50">
            <iframe
              src={calendly}
              title="Schedule a consultation with Liminova Labs"
              className="w-full min-h-[720px]"
            />
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Write first. We will find a time.
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Email a short brief or use the form. We will reply with a slot
              that overlaps your timezone. {site.responseSla}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`mailto:${site.email}?subject=Consultation%20with%20Liminova%20Labs`}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium"
              >
                Email {site.email}
              </a>
              <Link
                href="/#contact"
                className="px-6 py-3 bg-white border border-slate-200 rounded-full font-medium text-slate-700"
              >
                Send a brief
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

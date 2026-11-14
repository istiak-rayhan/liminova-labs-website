"use client";

import Link from "next/link";
import { homepageFaqs } from "@/data/faqs";

export default function FAQ() {
  const midpoint = Math.ceil(homepageFaqs.length / 2);
  const columns = [homepageFaqs.slice(0, midpoint), homepageFaqs.slice(midpoint)];

  return (
    <section id="faq" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Questions before you book
          </h2>
          <p className="text-slate-600 text-lg">
            Pricing, IP, communication, and what we will not take.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-4 items-start">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="space-y-3">
              {column.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-slate-200/80 bg-white/90 px-5 py-1 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.4)]"
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
          ))}
        </div>
        <p className="text-center mt-10">
          <Link
            href="/faq"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            See all FAQs
          </Link>
        </p>
      </div>
    </section>
  );
}

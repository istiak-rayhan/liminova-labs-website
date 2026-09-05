"use client";

import { faqs } from "@/data/faqs";

export default function FAQ() {
  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          Questions before you book
        </h2>
        <p className="text-slate-600 text-lg mb-12">
          Pricing, IP, communication, and what we will not take.
        </p>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-100 bg-white px-6 py-2"
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
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";

const audiences = [
  {
    label: "Founders",
    detail: "Need a real product surface without hiring a full eng org.",
  },
  {
    label: "Operators",
    detail: "Need booking, inventory, LMS, or commerce that teams can run daily.",
  },
  {
    label: "Agencies",
    detail: "Need a named specialist inside their squad — not an anonymous bench.",
  },
];

export default function BuiltFor() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-6">
          Built for
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {audiences.map((item, index) => (
            <motion.div
              key={item.label}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-5"
            >
              <p className="font-semibold text-slate-900 mb-1.5">{item.label}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

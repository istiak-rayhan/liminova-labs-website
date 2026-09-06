"use client";

import { motion, useReducedMotion } from "framer-motion";
import { industries } from "@/data/proof";

export default function Industries() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Industries we ship in
          </h2>
          <p className="text-slate-600 text-lg">
            Three production categories — not a logo wall. The portfolio is
            the proof.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-8"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {industry.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{industry.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

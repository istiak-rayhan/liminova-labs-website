"use client";

import { motion, useReducedMotion } from "framer-motion";
import { engagementModels } from "@/data/proof";

export default function Engagement() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            How we engage
          </h2>
          <p className="text-slate-600 text-lg">
            No public price list. A clear model so you know what you are buying.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {engagementModels.map((model, index) => (
            <motion.div
              key={model.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-slate-100 bg-white p-8"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">
                {model.duration}
              </p>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{model.title}</h3>
              <p className="text-slate-600 leading-relaxed">{model.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

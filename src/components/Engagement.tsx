"use client";

import { motion, useReducedMotion } from "framer-motion";
import { engagementModels } from "@/data/proof";

const accents = [
  "border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white",
  "border-sky-200/80 bg-gradient-to-br from-sky-50 to-white",
  "border-amber-200/80 bg-gradient-to-br from-amber-50 to-white",
  "border-teal-200/80 bg-gradient-to-br from-teal-50 to-white",
];

const badges = [
  "text-emerald-700 bg-emerald-100/80",
  "text-sky-700 bg-sky-100/80",
  "text-amber-700 bg-amber-100/80",
  "text-teal-700 bg-teal-100/80",
];

export default function Engagement() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            How we engage
          </h2>
          <p className="text-slate-600 text-lg">
            No public price list. A clear model so you know what you are buying.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {engagementModels.map((model, index) => (
            <motion.div
              key={model.title}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-[1.5rem] border p-8 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.4)] ${accents[index % accents.length]}`}
            >
              <p
                className={`inline-flex text-[11px] font-bold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full mb-4 ${badges[index % badges.length]}`}
              >
                {model.duration}
              </p>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-3">
                {model.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{model.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

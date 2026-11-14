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
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-3xl md:text-[2.75rem] font-semibold text-slate-900 mb-4">
            How we engage
          </h2>
          <p className="text-slate-600 text-lg leading-8">
            No public price list. A clear model so you know what you are buying.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-7">
          {engagementModels.map((model, index) => (
            <motion.div
              key={`${model.title}-${model.duration}`}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={`card-roomy rounded-[1.75rem] border p-9 md:p-10 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] flex flex-col ${accents[index % accents.length]}`}
            >
              <p
                className={`inline-flex self-start text-xs font-semibold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full mb-5 ${badges[index % badges.length]}`}
              >
                {model.duration}
              </p>
              <h3 className="font-display text-2xl font-semibold text-slate-900 mb-4">
                {model.title}
              </h3>
              <p className="text-slate-600 text-[1.05rem] leading-8">{model.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

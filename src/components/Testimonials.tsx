"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";

const tints = [
  "from-emerald-50 to-white border-emerald-100",
  "from-sky-50 to-white border-sky-100",
  "from-amber-50 to-white border-amber-100",
];

export default function Testimonials() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            What operators told us
          </h2>
          <p className="text-slate-600 text-lg">
            Anonymized by request. Role and industry only — no stock portraits.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.figure
              key={item.role + item.context}
              initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-[1.75rem] border bg-gradient-to-br p-8 flex flex-col shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)] ${tints[index % tints.length]}`}
            >
              <div className="flex items-center gap-1 mb-5 text-amber-500">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star key={star} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-slate-700 leading-relaxed flex-grow text-[1.05rem]">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-8 pt-5 border-t border-slate-200/70">
                <p className="font-semibold text-slate-900">{item.role}</p>
                <p className="text-sm text-slate-500">{item.context}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

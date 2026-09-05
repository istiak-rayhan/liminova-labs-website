"use client";

import { motion, useReducedMotion } from "framer-motion";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
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
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-8 flex flex-col"
            >
              <blockquote className="text-slate-700 leading-relaxed flex-grow">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-8">
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

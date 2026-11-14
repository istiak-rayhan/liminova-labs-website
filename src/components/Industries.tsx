"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Car, ShoppingBag, Cloud, ScanLine, Cpu } from "lucide-react";
import { industries } from "@/data/proof";

const icons = [GraduationCap, Car, ShoppingBag, Cloud, ScanLine, Cpu];

const accentMap: Record<string, string> = {
  emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-700 ring-emerald-500/15",
  sky: "from-sky-500/20 to-sky-500/5 text-sky-700 ring-sky-500/15",
  amber: "from-amber-500/20 to-amber-500/5 text-amber-700 ring-amber-500/15",
  teal: "from-teal-500/20 to-teal-500/5 text-teal-700 ring-teal-500/15",
  cyan: "from-cyan-500/20 to-cyan-500/5 text-cyan-700 ring-cyan-500/15",
  lime: "from-lime-500/20 to-lime-500/5 text-lime-700 ring-lime-500/15",
};

export default function Industries() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-20 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Industries we ship in
          </h2>
          <p className="text-slate-600 text-lg">
            Six production categories — not a logo wall. The portfolio is the
            proof.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((industry, index) => {
            const Icon = icons[index % icons.length];
            const accent = accentMap[industry.accent] ?? accentMap.emerald;
            return (
              <motion.div
                key={industry.title}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 backdrop-blur-sm p-7 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] hover:-translate-y-1 transition-transform duration-300"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ring-1 mb-5 flex items-center justify-center ${accent}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-3">
                  {industry.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{industry.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

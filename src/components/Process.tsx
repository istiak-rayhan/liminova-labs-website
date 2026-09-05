"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Search, PenTool, Terminal, Rocket } from "lucide-react";
import { processSteps } from "@/data/process";

const icons = {
  search: Search,
  pen: PenTool,
  terminal: Terminal,
  rocket: Rocket,
};

export default function Process() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="process" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            How we <span className="text-emerald-500">scale</span> you
          </h2>
          <p className="text-slate-600 text-lg">
            Evaluation, design, engineering, then growth. We do not skip the
            first step to look faster.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2" />

          <div className="space-y-12 md:space-y-0">
            {processSteps.map((step, index) => {
              const isEven = index % 2 === 0;
              const Icon = icons[step.icon];
              return (
                <div
                  key={step.id}
                  className={`relative flex flex-col md:flex-row items-center ${isEven ? "md:justify-start" : "md:justify-end"} md:mb-16 last:mb-0`}
                >
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className={`hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white border-4 ${step.borderColor} z-10 items-center justify-center shadow-sm`}
                  >
                    <Icon className={`w-5 h-5 ${step.color.split(" ")[1]}`} />
                  </motion.div>

                  <motion.div
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, x: isEven ? -50 : 50, y: 20 }
                    }
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="md:w-5/12 bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all w-full relative z-20"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl font-extrabold text-slate-200">
                        {step.id}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { proofStats } from "@/data/proof";

function AnimatedNumber({
  numeric,
  suffix,
  active,
}: {
  numeric: number;
  suffix: string;
  active: boolean;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;

    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setN(Math.round(numeric * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, numeric]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}

export default function ProofStrip() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  return (
    <section ref={ref} className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {proofStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: index * 0.08 }}
          >
            <p className="text-4xl font-extrabold tracking-tight text-emerald-300">
              {reduceMotion || !/^\d+$/.test(stat.value) ? (
                <>
                  {stat.value}
                  {stat.suffix}
                </>
              ) : (
                <AnimatedNumber
                  numeric={stat.numeric}
                  suffix={stat.suffix}
                  active={inView}
                />
              )}
            </p>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

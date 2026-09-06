"use client";

import { motion, useReducedMotion } from "framer-motion";

const technologies = [
  "Flutter & Dart",
  "Next.js",
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "AI & ML",
  "Meta Ads",
  "SEO Optimization",
  "Figma",
  "REST APIs",
  "Tailwind CSS",
];

export default function TechMarquee() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <section className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="text-sm font-extrabold text-slate-400 uppercase tracking-widest"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white border-b border-slate-100 overflow-hidden relative flex items-center justify-center">
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      <div className="flex w-full">
        <motion.div
          className="flex whitespace-nowrap gap-16 px-8 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
        >
          {[...technologies, ...technologies, ...technologies].map((tech, index) => (
            <span
              key={`${tech}-${index}`}
              className="text-lg md:text-xl font-extrabold text-slate-300 uppercase tracking-widest hover:text-emerald-500 transition-colors duration-300 cursor-default"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

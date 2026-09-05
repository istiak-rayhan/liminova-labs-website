"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import HeroVisual from "@/components/HeroVisual";
import { getBookingHref } from "@/data/site";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : { opacity: 0, y: 20 };

  return (
    <section className="relative min-h-[calc(100svh-5rem)] flex items-center overflow-hidden bg-slate-50">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
        <div>
          <motion.div
            initial={initial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
              Digital transformation partner · Dhaka, serving globally
            </span>
          </motion.div>

          <motion.h1
            initial={initial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
          >
            We design, ship, and grow the platforms that become your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
              product business.
            </span>
          </motion.h1>

          <motion.p
            initial={initial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-slate-600 max-w-xl mb-10 leading-relaxed"
          >
            Flutter and Next.js products first. Then SEO and Meta Ads — only
            when the funnel can convert. Evaluation, build, scale, profit. One
            studio.
          </motion.p>

          <motion.div
            initial={initial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <Link
              href={getBookingHref()}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium text-lg transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
            >
              Book a consultation
              <ArrowUpRight className="w-5 h-5" />
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-4 bg-white border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 text-slate-700 rounded-full font-medium text-lg transition-all flex items-center justify-center"
            >
              View the work
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="pb-10 lg:pb-0"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import BookingSteps from "@/components/BookingSteps";
import HeroVisual from "@/components/HeroVisual";
import { getBookingHref, site } from "@/data/site";
import { track } from "@/lib/track";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : { opacity: 0, y: 20 };

  return (
    <section className="relative min-h-[calc(100svh-5rem)] flex items-center overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-teal-100/35 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-20 grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
        <div>
          <motion.p
            initial={initial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="font-display text-emerald-700 text-sm font-semibold tracking-[0.08em] uppercase mb-5"
          >
            {site.name}
          </motion.p>

          <motion.h1
            initial={initial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold text-slate-900 leading-[1.12] mb-6"
          >
            We design, ship, and grow the platforms that become your product
            business.
          </motion.h1>

          <motion.p
            initial={initial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
            className="text-lg text-slate-600 max-w-xl mb-8 leading-8"
          >
            Flutter and Next.js products first. Then SEO and Meta Ads — only when
            the funnel can convert. Dhaka-based, serving globally.
          </motion.p>

          <motion.div
            initial={initial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <Link
              href={getBookingHref()}
              onClick={() => track("cta_book_hero")}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium text-lg transition-all shadow-lg shadow-emerald-200/80 flex items-center justify-center gap-2"
            >
              Book a consultation
              <ArrowUpRight className="w-5 h-5" />
            </Link>
            <Link
              href="/#contact"
              onClick={() => track("cta_brief_hero")}
              className="px-8 py-4 text-slate-700 hover:text-emerald-700 font-medium text-lg transition-colors flex items-center justify-center"
            >
              Or send a brief
            </Link>
          </motion.div>

          <motion.div
            initial={initial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32, ease: "easeOut" }}
          >
            <BookingSteps compact />
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: "easeOut" }}
          className="pb-6 lg:pb-0"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

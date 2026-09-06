"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { getBookingHref, site } from "@/data/site";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/portfolio", label: "Work" },
  { href: "/about", label: "Company" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <motion.nav
      initial={reduceMotion ? false : { y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-50"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">L</span>
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">
            {site.name}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-emerald-500 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href={getBookingHref()}
          className="hidden md:flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm shadow-emerald-200"
        >
          Book a Consultation
          <ArrowRight className="w-4 h-4" />
        </Link>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 text-slate-800"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-emerald-50 bg-white"
          >
            <div className="px-6 py-6 flex flex-col gap-4 text-base font-medium text-slate-700">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-1"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={getBookingHref()}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-full"
              >
                Book a Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  );
}

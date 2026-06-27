"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-50"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">L</span>
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">
            Liminova Labs
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#services" className="hover:text-emerald-500 transition-colors">All Services</Link>
          <Link href="#portfolio" className="hover:text-emerald-500 transition-colors">Portfolio</Link>
          <Link href="#company" className="hover:text-emerald-500 transition-colors">Company</Link>
        </div>

        {/* CTA Button */}
        <button className="hidden md:flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm shadow-emerald-200">
          Book a Consultation
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.nav>
  );
}
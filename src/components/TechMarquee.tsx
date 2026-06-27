"use client";

import { motion } from "framer-motion";

// আমাদের কমপ্লিট সল্যুশন টেকনোলজি ও স্কিল
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
  "Tailwind CSS"
];

export default function TechMarquee() {
  return (
    <section className="py-8 bg-white border-b border-slate-100 overflow-hidden relative flex items-center justify-center">
      
      {/* Left & Right Gradient Fade (প্রিমিয়াম লুকের জন্য দুই পাশে ফেড ইফেক্ট) */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      <div className="flex w-full">
        <motion.div
          className="flex whitespace-nowrap gap-16 px-8 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30, // অ্যানিমেশন স্পিড (কমাতে বা বাড়াতে পারো)
          }}
        >
          {/* লুপ কন্টিনিউয়াস রাখার জন্য array-টাকে ডাবল করা হয়েছে */}
          {[...technologies, ...technologies, ...technologies].map((tech, index) => (
            <span
              key={index}
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
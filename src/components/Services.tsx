"use client";

import { motion } from "framer-motion";
import { Code2, TrendingUp, Cpu, ArrowRight } from "lucide-react";

const services = [
  {
    title: "Platform Engineering",
    description: "Custom websites, seamless iOS & Android apps using Flutter, robust admin panels, and full-scale LMS platforms tailored to your business needs.",
    tags: ["Flutter & Dart", "Next.js", "Node.js"],
    icon: Code2,
    color: "bg-blue-100 text-blue-600",
    borderColor: "hover:border-blue-200",
    shadowColor: "hover:shadow-blue-900/5",
  },
  {
    title: "Brand & Growth Marketing",
    description: "End-to-end brand evaluation, SEO-friendly landing pages, dynamic social media management, and profit-generating Meta Ads campaigns.",
    tags: ["Meta Ads", "SEO", "Social Media"],
    icon: TrendingUp,
    color: "bg-emerald-100 text-emerald-600",
    borderColor: "hover:border-emerald-200",
    shadowColor: "hover:shadow-emerald-900/5",
  },
  {
    title: "Advanced Tech & AI",
    description: "Intelligent Python-based web tools, AI & ML integrations, scalable REST API development, and data-driven solutions for maximum efficiency.",
    tags: ["Python", "AI & ML", "REST APIs"],
    icon: Cpu,
    color: "bg-purple-100 text-purple-600",
    borderColor: "hover:border-purple-200",
    shadowColor: "hover:shadow-purple-900/5",
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 text-sm font-bold uppercase tracking-wider mb-4"
          >
            360° Digital Solutions
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            From Idea to <span className="text-emerald-500">Profitability.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-lg leading-relaxed"
          >
            We don&apos;t just write code. We evaluate your brand, develop scalable platforms, and drive revenue through data-driven marketing. A complete ecosystem for modern business growth.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-slate-50 rounded-3xl p-8 border border-slate-100 transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl ${service.borderColor} ${service.shadowColor} flex flex-col h-full`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-300 ${service.color}`}>
                <service.icon className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {service.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {service.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              <button className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mt-auto">
                Explore capabilities <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
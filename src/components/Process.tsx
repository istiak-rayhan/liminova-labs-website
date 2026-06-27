"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Terminal, Rocket } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Discovery & Brand Evaluation",
    description: "We don't just take orders. We dive deep into your business model, target audience, and market landscape to craft a winning digital strategy.",
    icon: Search,
    color: "bg-blue-100 text-blue-600",
    borderColor: "border-blue-200",
  },
  {
    id: "02",
    title: "UI/UX & Architecture",
    description: "Mapping out the user journey. We design intuitive interfaces and robust system architectures tailored for long-term scalability.",
    icon: PenTool,
    color: "bg-purple-100 text-purple-600",
    borderColor: "border-purple-200",
  },
  {
    id: "03",
    title: "Platform Engineering",
    description: "Building the core. Whether it's a cross-platform Flutter app, a high-performance Next.js web app, or an AI-integrated tool, we build it flawlessly.",
    icon: Terminal,
    color: "bg-emerald-100 text-emerald-600",
    borderColor: "border-emerald-200",
  },
  {
    id: "04",
    title: "Growth & Profit Generation",
    description: "Launch is just the beginning. We deploy SEO strategies, Meta Ads, and conversion-focused campaigns to drive traffic, acquire users, and scale revenue.",
    icon: Rocket,
    color: "bg-orange-100 text-orange-600",
    borderColor: "border-orange-200",
  }
];

export default function Process() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            How We <span className="text-emerald-500">Scale</span> You
          </h2>
          <p className="text-slate-600 text-lg">
            Our battle-tested framework transforms raw ideas into profitable digital powerhouses.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Connecting Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2" />

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={step.id} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:justify-start' : 'md:justify-end'} md:mb-16 last:mb-0`}>
                  
                  {/* Center Node (Icon) */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className={`hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white border-4 ${step.borderColor} z-10 items-center justify-center shadow-sm`}
                  >
                    <step.icon className={`w-5 h-5 ${step.color.split(' ')[1]}`} />
                  </motion.div>

                  {/* Content Card */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className={`md:w-5/12 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all w-full relative z-20`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br ${step.color === 'bg-blue-100 text-blue-600' ? 'from-blue-400 to-blue-600' : step.color === 'bg-purple-100 text-purple-600' ? 'from-purple-400 to-purple-600' : step.color === 'bg-emerald-100 text-emerald-600' ? 'from-emerald-400 to-emerald-600' : 'from-orange-400 to-orange-600'} opacity-20`}>
                        {step.id}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
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
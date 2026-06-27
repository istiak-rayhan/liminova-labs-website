"use client";

import { motion } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000); // ৫ সেকেন্ড পর আবার নরমাল হবে
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative bg-white pt-24 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
          
          {/* Left Side: Contact Info */}
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
            >
              Let&apos;s build something <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                extraordinary.
              </span>
            </motion.h2>
            <p className="text-slate-600 text-lg mb-10 max-w-md leading-relaxed">
              Ready to transform your ideas into reality? Drop us a message, and let&apos;s discuss how we can help your business scale.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Email Us</p>
                  <a href="mailto:hello@liminovalabs.com" className="text-lg font-semibold text-slate-900 hover:text-emerald-600 transition-colors">
                    hello@liminovalabs.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white text-slate-900" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white text-slate-900" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Project Details</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white resize-none text-slate-900" 
                  placeholder="Tell us about your project goals..."
                />
              </div>
              
              <button 
                type="submit" 
                disabled={status === "loading" || status === "success"}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-200"
              >
                {status === "idle" && <><Send className="w-4 h-4" /> Send Message</>}
                {status === "loading" && "Sending..."}
                {status === "success" && <><CheckCircle2 className="w-5 h-5" /> Message Sent!</>}
                {status === "error" && <><AlertCircle className="w-5 h-5" /> Failed. Try Again.</>}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 text-slate-500 text-sm gap-4">
          <div className="flex items-center gap-2 font-semibold text-slate-900 text-lg">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
              <span className="text-white text-xs leading-none">L</span>
            </div>
            Liminova Labs
          </div>
          <p>© {new Date().getFullYear()} Liminova Labs. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </section>
  );
}
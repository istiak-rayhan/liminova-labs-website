"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { site } from "@/data/site";
import {
  budgetBands,
  projectTypes,
  timelines,
  type ContactPayload,
} from "@/lib/contact-schema";

const emptyForm: ContactPayload & { website: string } = {
  name: "",
  email: "",
  company: "",
  projectType: projectTypes[0],
  budget: budgetBands[0],
  timeline: timelines[3],
  message: "",
  consent: false,
  website: "",
};

export default function Contact() {
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const reduceMotion = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const payload = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("success");
        setFormData(emptyForm);
        track("contact_submit");
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setErrorMessage(payload.error ?? "Failed to send. Try again.");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Try again.");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const field =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white text-slate-900";

  return (
    <section id="contact" className="relative bg-white pt-24 pb-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
            >
              Tell us what you want{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                to ship.
              </span>
            </motion.h2>
            <p className="text-slate-600 text-lg mb-8 max-w-md leading-relaxed">
              A short brief is enough. {site.responseSla} Prefer a calendar
              slot?{" "}
              <Link href="/book" className="text-emerald-600 font-semibold">
                Book a consultation
              </Link>
              .
            </p>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Email</p>
                <a
                  href={`mailto:${site.email}`}
                  className="text-lg font-semibold text-slate-900 hover:text-emerald-600 transition-colors"
                >
                  {site.email}
                </a>
              </div>
            </div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Your name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={field}
                    placeholder="Alex Rivera"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Work email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={field}
                    placeholder="alex@company.com"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={field}
                    placeholder="Northline"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="projectType" className="block text-sm font-medium text-slate-700 mb-2">
                    Project type
                  </label>
                  <select
                    id="projectType"
                    value={formData.projectType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectType: e.target.value as (typeof projectTypes)[number],
                      })
                    }
                    className={field}
                  >
                    {projectTypes.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                    Budget band
                  </label>
                  <select
                    id="budget"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        budget: e.target.value as (typeof budgetBands)[number],
                      })
                    }
                    className={field}
                  >
                    {budgetBands.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label htmlFor="timeline" className="block text-sm font-medium text-slate-700 mb-2">
                    Timeline
                  </label>
                  <select
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeline: e.target.value as (typeof timelines)[number],
                      })
                    }
                    className={field}
                  >
                    {timelines.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Project details
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${field} resize-none`}
                  placeholder="What should exist in 90 days that does not exist today?"
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) =>
                    setFormData({ ...formData, consent: e.target.checked })
                  }
                  className="mt-1 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  required
                />
                <span>
                  I agree that Liminova Labs may use these details to reply about
                  this inquiry. See the{" "}
                  <Link href="/privacy" className="text-emerald-600 font-medium">
                    privacy policy
                  </Link>
                  .
                </span>
              </label>

              <p className="sr-only" role="status" aria-live="polite">
                {status === "success"
                  ? "Message sent"
                  : status === "error"
                    ? errorMessage
                    : ""}
              </p>

              {status === "error" && errorMessage ? (
                <p className="text-sm text-rose-600">{errorMessage}</p>
              ) : null}

              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-200"
              >
                {status === "idle" && (
                  <>
                    <Send className="w-4 h-4" /> Send brief
                  </>
                )}
                {status === "loading" && "Sending..."}
                {status === "success" && (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Message sent
                  </>
                )}
                {status === "error" && (
                  <>
                    <AlertCircle className="w-5 h-5" /> Failed. Try again.
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

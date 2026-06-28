"use client";

import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    slug: "bfrench",
    title: "B-FRENCH - Learn with Passion",
    category: "EdTech / LMS Platform",
    description: "A comprehensive language learning platform featuring pre-recorded lessons, live sessions, course tracking, and seamless payment integration.",
    tech: ["Flutter", "Node.js", "UI/UX"],
    // স্ক্রিনশটের নাম অনুযায়ী হুবহু বসানো হয়েছে
    images: [
      "/projects/bfrench1.jpg", 
      "/projects/bfrench2.jpg", 
      "/projects/bfrecnch3.jpg" 
    ], 
    featured: true,
  },
  {
    slug: "urbanride",
    title: "UrbanRide Solutions",
    category: "Ride-Sharing Application",
    description: "A scalable cross-platform mobile app for real-time ride booking, featuring live tracking and secure payment gateways.",
    tech: ["Flutter", "Firebase", "Maps API"],
    // স্ক্রিনশটের রাইডশেয়ারিং অ্যাপের ছবিগুলো
    images: [
      "/projects/Home.png", 
      "/projects/Onboarding.png",
      "/projects/Journey.png",
      "/projects/pickup-1.png"
    ],
    featured: false,
  },
  {
    slug: "lumina-ecommerce",
    title: "Lumina E-Commerce",
    category: "Retail / Web App",
    description: "High-conversion modern e-commerce storefront with dynamic inventory management and blazing fast page loads.",
    tech: ["Next.js", "React", "Tailwind"],
    // ই-কমার্সের ছবিগুলো
    images: [
      "/projects/e-comm1.jpg",
      "/projects/e-comm2.jpg"
    ],
    featured: false,
  }
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Selected Works
            </h2>
            <p className="text-slate-600 text-lg">
              A glimpse into the digital products we&apos;ve crafted. From full-scale LMS platforms to performant e-commerce solutions.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
            View All Projects <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all ${
                project.featured ? "lg:col-span-3 flex flex-col md:flex-row gap-10 items-center" : "col-span-1"
              }`}
            >
              {/* Image Area with Hover Zoom - Showing the first image [0] */}
              <div className={`relative overflow-hidden rounded-2xl bg-slate-100 flex-shrink-0 w-full ${project.featured ? 'md:w-1/2 aspect-[4/3] md:aspect-[16/10]' : 'aspect-video mb-6'}`}>
                <Image 
                  src={project.images[0]} 
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content Area */}
              <div className="flex-col flex-grow">
                <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-3 block">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Updated Button to Link to dynamic project page */}
                <Link 
                  href={`/portfolio/${project.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors"
                >
                  Explore Project <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
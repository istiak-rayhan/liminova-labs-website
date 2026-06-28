import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

const projects = [
  {
    slug: "bfrench",
    title: "B-FRENCH - Learn with Passion",
    category: "EdTech / LMS Platform",
    description: "A comprehensive language learning platform featuring pre-recorded lessons, live sessions, course tracking, and seamless payment integration. Built to scale and provide an intuitive learning experience for students globally.",
    tech: ["Flutter", "Node.js", "UI/UX", "REST API", "Payment Gateway"],
    images: [
      "/projects/bfrench1.jpg", 
      "/projects/bfrench2.jpg", 
      "/projects/bfrecnch3.jpg" 
    ],
  },
  {
    slug: "urbanride",
    title: "UrbanRide Solutions",
    category: "Ride-Sharing Application",
    description: "A scalable cross-platform mobile app for real-time ride booking, featuring live tracking and secure payment gateways. Designed with a focus on quick onboarding and seamless rider-driver matching.",
    tech: ["Flutter", "Firebase", "Maps API", "Real-time DB"],
    images: [
      "/projects/Home.png", 
      "/projects/Onboarding.png",
      "/projects/Journey.png",
      "/projects/pickup-1.png"
    ],
  },
  {
    slug: "lumina-ecommerce",
    title: "Lumina E-Commerce",
    category: "Retail / Web App",
    description: "High-conversion modern e-commerce storefront with dynamic inventory management and blazing fast page loads. Engineered to reduce cart abandonment and increase overall sales volume.",
    tech: ["Next.js", "React", "Tailwind", "Stripe"],
    images: [
      "/projects/e-comm1.jpg",
      "/projects/e-comm2.jpg"
    ],
  }
];

// 🛑 Next.js 15-এর জন্য এখানে async এবং Promise অ্যাড করা হয়েছে
export default async function ProjectDetails({ params }: { params: Promise<{ slug: string }> }) {
  
  // params-কে await করে slug বের করা হচ্ছে
  const resolvedParams = await params;
  const project = projects.find((p) => p.slug === resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-6">
          <Link href="/#portfolio" className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-3">
            {project.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            {project.title}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed mb-8">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, i) => (
              <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="max-w-5xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Project Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.images.map((img, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm aspect-[4/3] md:aspect-[16/10] ${index === 0 ? 'md:col-span-2 aspect-video' : ''}`}
            >
              <Image 
                src={img} 
                alt={`${project.title} screenshot ${index + 1}`}
                fill
                className="object-contain p-4 hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
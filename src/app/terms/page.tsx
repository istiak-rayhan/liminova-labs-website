import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate prose-emerald max-w-none text-slate-600 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Agreement to Terms</h2>
          <p>By accessing or using the Liminova Labs website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Intellectual Property</h2>
          <p>The service and its original content, features, and functionality are and will remain the exclusive property of Liminova Labs and its licensors. Our branding, logos, and portfolio items cannot be used without explicit permission.</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Client Projects</h2>
          <p>Project deliverables, timelines, and ownership rights are governed by individual contracts and agreements signed between Liminova Labs and the client prior to project commencement.</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Modifications</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days notice prior to any new terms taking effect.</p>
        </div>
      </div>
    </main>
  );
}
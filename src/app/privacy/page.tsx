import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate prose-emerald max-w-none text-slate-600 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>At Liminova Labs, we collect information you provide directly to us when you fill out a contact form, request a consultation, or communicate with us via email. This may include your name, email address, and project details.</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to communicate with you about your project, provide our services, and improve our website. We do not sell or share your personal information with third parties for marketing purposes.</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Data Security</h2>
          <p>We implement reasonable security measures to protect your personal information. However, please be aware that no method of transmission over the internet is 100% secure.</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@liminovalabs.com" className="text-emerald-600 hover:underline">hello@liminovalabs.com</a>.</p>
        </div>
      </div>
    </main>
  );
}
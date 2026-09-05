import Link from "next/link";
import { getMarketplaceLinks, site } from "@/data/site";

export default function Footer() {
  const marketplace = getMarketplaceLinks();

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4 text-sm">
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2 font-semibold text-slate-900 text-lg">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
              <span className="text-white text-xs leading-none">L</span>
            </div>
            {site.name}
          </div>
          <p className="text-slate-500 leading-relaxed">
            Digital transformation partner. {site.location}.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="text-slate-900 font-medium hover:text-emerald-600"
          >
            {site.email}
          </a>
        </div>

        <div>
          <p className="font-semibold text-slate-900 mb-4">Work</p>
          <ul className="space-y-2 text-slate-500">
            <li>
              <Link href="/portfolio" className="hover:text-emerald-600">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/services/platform-engineering" className="hover:text-emerald-600">
                Platform engineering
              </Link>
            </li>
            <li>
              <Link href="/services/brand-growth" className="hover:text-emerald-600">
                Brand & growth
              </Link>
            </li>
            <li>
              <Link href="/services/advanced-tech-ai" className="hover:text-emerald-600">
                Advanced tech & AI
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-900 mb-4">Company</p>
          <ul className="space-y-2 text-slate-500">
            <li>
              <Link href="/about" className="hover:text-emerald-600">
                About
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-emerald-600">
                Book a consultation
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-emerald-600">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-emerald-600">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-emerald-600">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-900 mb-4">Also on</p>
          {marketplace.length > 0 ? (
            <ul className="space-y-2 text-slate-500">
              {marketplace.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-600"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 leading-relaxed">
              Marketplace profiles are listed here once configured. Direct
              engagement is the default path.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </p>
        <p>{site.responseSla}</p>
      </div>
    </footer>
  );
}

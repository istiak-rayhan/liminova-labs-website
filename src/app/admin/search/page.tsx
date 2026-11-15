import { site } from "@/data/site";

const verified = Boolean(process.env.GOOGLE_SITE_VERIFICATION);

const listing = {
  name: site.name,
  category: "Software company",
  extra: "Website designer, Internet marketing service",
  phone: `+${site.whatsapp.replace(/\D/g, "")}`,
  website: site.url,
  email: site.email,
  area: "Dhaka, Bangladesh — serving clients worldwide",
  description:
    "Liminova Labs designs and ships Flutter and Next.js products, then grows them with SEO and Meta Ads. Dhaka-based studio for founders, operators, and agencies that need a named technical partner.",
};

export default function AdminSearchPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Search listing</h1>
        <p className="text-slate-500 mt-2 leading-relaxed">
          The site already publishes the business name, Dhaka location, services, and sitemap for Google.
          Creating the Google Business Profile and Search Console property has to be done in your Google account — this page is the copy to paste.
        </p>
      </div>

      <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3 text-sm">
        <h2 className="font-semibold text-slate-900">Google Business Profile</h2>
        <Row label="Name" value={listing.name} />
        <Row label="Primary category" value={listing.category} />
        <Row label="Also add" value={listing.extra} />
        <Row label="Phone" value={listing.phone} />
        <Row label="Website" value={listing.website} />
        <Row label="Service area" value={listing.area} />
        <p className="text-slate-600 leading-relaxed pt-2">{listing.description}</p>
        <a
          href="https://business.google.com/create"
          target="_blank"
          rel="noreferrer"
          className="inline-flex mt-2 rounded-full bg-emerald-500 text-white px-4 py-2 text-sm font-semibold"
        >
          Create the Google listing
        </a>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3 text-sm">
        <h2 className="font-semibold text-slate-900">Search Console</h2>
        <p className="text-slate-600 leading-relaxed">
          Add the property <strong>{site.url}</strong>, then submit the sitemap{" "}
          <strong>{site.url}/sitemap.xml</strong>.
        </p>
        <p className="text-slate-600 leading-relaxed">
          HTML tag verification: {verified ? "a token is set on this deployment." : "not set yet."} If Google gives you a meta tag, put only the content value in the Vercel environment variable{" "}
          <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">GOOGLE_SITE_VERIFICATION</code> and redeploy.
        </p>
        <a
          href="https://search.google.com/search-console"
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
        >
          Open Search Console
        </a>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-semibold text-slate-800">{label}: </span>
      <span className="text-slate-600">{value}</span>
    </p>
  );
}

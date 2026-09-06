import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-lg text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-3">
          404
        </p>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
          This page is not on the map.
        </h1>
        <p className="text-slate-600 mb-8">
          The URL may have moved. The work, the studio, and the booking path
          are still here.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-emerald-500 text-white rounded-full font-medium"
          >
            Home
          </Link>
          <Link
            href="/portfolio"
            className="px-6 py-3 bg-white border border-slate-200 rounded-full font-medium"
          >
            View work
          </Link>
        </div>
      </div>
    </main>
  );
}

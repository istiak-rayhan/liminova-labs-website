import Image from "next/image";

export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80 overflow-hidden">
        <div className="h-9 bg-slate-100 border-b border-slate-200 flex items-center gap-2 px-4">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
          <span className="ml-3 text-[11px] text-slate-400 font-medium truncate">
            B-FRENCH · language LMS
          </span>
        </div>
        <div className="relative aspect-[16/10] bg-slate-950">
          <Image
            src="/projects/bfrench1.jpg"
            alt="B-FRENCH learning platform"
            fill
            className="object-cover object-top"
            priority
            sizes="(min-width: 1024px) 540px, 90vw"
          />
        </div>
      </div>

      <div className="absolute -bottom-8 -right-2 sm:right-6 w-[38%] max-w-[180px] rounded-[1.6rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden">
        <div className="relative aspect-[9/19]">
          <Image
            src="/projects/Home.png"
            alt="UrbanRide rider home screen"
            fill
            className="object-cover object-top"
            sizes="180px"
          />
        </div>
      </div>
    </div>
  );
}

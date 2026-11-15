import BusinessDesk from "@/components/admin/BusinessDesk";
import { getCmsStore, toPublicTeamMember } from "@/lib/cms";
import { money } from "@/lib/finance";
import { requireArea } from "@/lib/guard";
import { buildReport } from "@/lib/report";

export default async function AdminBusinessPage() {
  await requireArea("business");
  const store = await getCmsStore();
  const report = buildReport(store);

  const cards = [
    { label: "Income so far", value: money(report.earned), hint: "Sum of receipts on every project" },
    { label: "This month", value: money(report.monthIncome), hint: "Receipts dated this month, Dhaka time" },
    { label: "Last 7 days", value: money(report.weekIncome), hint: "Receipts from the last 7 days" },
    { label: "Invested", value: money(report.invested), hint: "What you recorded below" },
    { label: "Net of investment", value: money(report.net), hint: "Income so far minus recorded investment" },
    { label: "Still to collect", value: money(report.toCollect), hint: "Finalized value minus receipts" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Business</h1>
        <p className="text-slate-500 mt-1">
          Studio money only. Nothing here is estimated. Add a receipt on a project and it shows up as income.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white border border-slate-200 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{card.value}</p>
            <p className="text-xs text-slate-500 mt-2">{card.hint}</p>
          </div>
        ))}
      </div>
      {report.bySection.length > 0 ? (
        <section className="rounded-2xl bg-white border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-3">Investment by section</h2>
          <ul className="space-y-2 text-sm">
            {report.bySection.map((row) => (
              <li key={row.label} className="flex justify-between gap-4">
                <span className="text-slate-700">{row.label}</span>
                <span className="font-semibold text-slate-900">{money(row.amount)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <BusinessDesk
        projects={store.projects}
        team={store.team.map(toPublicTeamMember)}
        initialInvestments={store.investments ?? []}
        initialPayouts={store.payouts ?? []}
      />
    </div>
  );
}

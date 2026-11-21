import BarList from "@/components/admin/BarList";
import BusinessDesk from "@/components/admin/BusinessDesk";
import { getCmsStore, toPublicTeamMember } from "@/lib/cms";
import { money, recentWeekIncome } from "@/lib/finance";
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
          Recorded money only. Nothing here is estimated. Add a receipt on a project and it shows up as income.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <BarList
          title="Collected against what is signed"
          hint="Receipts beside the amount still owed on finalized work."
          rows={[
            { label: "Collected", value: report.earned, display: money(report.earned), bar: "bg-emerald-500" },
            { label: "Still to collect", value: report.toCollect, display: money(report.toCollect), bar: "bg-amber-400" },
          ]}
        />
        <BarList
          title="Receipts by week"
          hint="Eight weeks, dated in Dhaka. A quiet week is a real gap, not an estimate."
          rows={recentWeekIncome(store.projects).map((week) => ({
            label: week.label,
            value: week.value,
            display: money(week.value),
            bar: "bg-emerald-500",
          }))}
        />
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
        <BarList
          title="Investment by section"
          hint="Spend you recorded, grouped by the section you chose."
          rows={report.bySection.map((row) => ({
            label: row.label,
            value: row.amount,
            display: money(row.amount),
            bar: "bg-slate-500",
          }))}
        />
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

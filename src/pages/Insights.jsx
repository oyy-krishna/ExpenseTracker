import { useMemo, useState } from "react";
import { Crown, PiggyBank, Receipt } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import EmptyState from "@/components/EmptyState";
import { useFinance } from "@/context/FinanceContext";
import { currentMonthKey, filterByMonth, monthlySeries, spendingByCategory, totals } from "@/lib/finance";
import { formatCurrency, monthKey, parseISODate } from "@/lib/utils";

export default function Insights() {
  const { transactions, currency, getCategory } = useFinance();
  const [month, setMonth] = useState(currentMonthKey());
  const [range, setRange] = useState("6");

  const months = useMemo(() => {
    const keys = new Set(transactions.map((t) => monthKey(t.date)));
    keys.add(currentMonthKey());
    return [...keys].sort().reverse().map((k) => ({
      key: k,
      label: parseISODate(`${k}-01`).toLocaleDateString(undefined, { month: "long", year: "numeric" }),
    }));
  }, [transactions]);

  const scoped = useMemo(
    () => (month === "all" ? transactions : filterByMonth(transactions, month)),
    [transactions, month]
  );
  // Full breakdown (no folding) for the table; folded version for the donut
  const breakdown = useMemo(() => spendingByCategory(scoped, getCategory, Infinity), [scoped, getCategory]);
  const pie = useMemo(() => spendingByCategory(scoped, getCategory, 6), [scoped, getCategory]);
  const bars = useMemo(() => monthlySeries(transactions, Number(range)), [transactions, range]);
  const sum = totals(scoped);
  const biggest = scoped.filter((t) => t.type === "expense").reduce((m, t) => (!m || t.amount > m.amount ? t : m), null);
  const biggestCat = biggest ? getCategory(biggest.categoryId, "expense") : null;

  if (!transactions.length) {
    return (
      <Card className="animate-fade-up">
        <EmptyState
          emoji="📊"
          title="Insights will appear here"
          description="Add a few transactions and Bloom will show where your money goes."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Spending insights</h2>
          <p className="text-sm text-muted-foreground">Understand your habits, gently 💗</p>
        </div>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="sm:w-60" aria-label="Choose month">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.key} value={m.key}>
                {m.label}
              </SelectItem>
            ))}
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MiniStat icon={Receipt} label="Total spent" value={formatCurrency(sum.expense, currency)} />
        <MiniStat
          icon={PiggyBank}
          label="Saved"
          value={`${sum.balance < 0 ? "−" : ""}${formatCurrency(Math.abs(sum.balance), currency)}`}
          hint={sum.income ? `${Math.round((sum.balance / sum.income) * 100)}% of income` : undefined}
        />
        <MiniStat
          icon={Crown}
          label="Biggest expense"
          value={biggest ? formatCurrency(biggest.amount, currency) : "—"}
          hint={biggest ? `${biggestCat.emoji} ${biggest.note || biggestCat.name}` : undefined}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending by category</CardTitle>
            <CardDescription>Share of total spending</CardDescription>
          </CardHeader>
          <CardContent>
            {pie.length ? (
              <CategoryPieChart data={pie} currency={currency} height={240} showLegend={false} />
            ) : (
              <EmptyState emoji="🧾" title="No expenses in this period" className="py-10" />
            )}
          </CardContent>
        </Card>

        {/* Table view of the same data: exact values, every category */}
        <Card>
          <CardHeader>
            <CardTitle>Category breakdown</CardTitle>
            <CardDescription>{breakdown.length} categories</CardDescription>
          </CardHeader>
          <CardContent>
            {breakdown.length ? (
              <ul className="space-y-3.5">
                {breakdown.map((r) => (
                  <li key={r.id}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2 font-semibold">
                        <span aria-hidden>{r.emoji}</span>
                        <span className="truncate">{r.name}</span>
                      </span>
                      <span className="shrink-0 tabular">
                        <span className="font-bold">{formatCurrency(r.value, currency)}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{(r.percent * 100).toFixed(1)}%</span>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(r.percent * 100, 1.5)}%`, backgroundColor: r.color }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState emoji="🌼" title="Nothing to break down" className="py-10" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
          <div className="space-y-1">
            <CardTitle>Monthly trend</CardTitle>
            <CardDescription>Income vs expenses over time</CardDescription>
          </div>
          <Tabs value={range} onValueChange={setRange}>
            <TabsList className="h-9">
              <TabsTrigger value="3" className="px-2.5 text-xs">3M</TabsTrigger>
              <TabsTrigger value="6" className="px-2.5 text-xs">6M</TabsTrigger>
              <TabsTrigger value="12" className="px-2.5 text-xs">12M</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <MonthlyBarChart data={bars} currency={currency} height={300} />
        </CardContent>
      </Card>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, hint }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <p className="truncate text-lg font-extrabold tabular">{value}</p>
        {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  );
}

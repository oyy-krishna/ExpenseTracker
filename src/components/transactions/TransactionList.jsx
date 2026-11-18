import { groupByDay } from "@/lib/finance";
import { cn, formatCurrency, relativeDayLabel } from "@/lib/utils";
import { useFinance } from "@/context/FinanceContext";
import TransactionItem from "./TransactionItem";

/** Transactions grouped under day headings with each day's net total. */
export default function TransactionList({ transactions }) {
  const { currency } = useFinance();
  const groups = groupByDay(transactions);

  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <section key={g.date} aria-label={relativeDayLabel(g.date)}>
          <div className="mb-1 flex items-center justify-between px-2 sm:px-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {relativeDayLabel(g.date)}
            </h3>
            <span className={cn("text-xs font-semibold tabular", g.net >= 0 ? "text-income" : "text-muted-foreground")}>
              {g.net >= 0 ? "+" : "−"}
              {formatCurrency(Math.abs(g.net), currency)}
            </span>
          </div>
          <ul className="space-y-0.5">
            {g.items.map((t) => (
              <TransactionItem key={t.id} tx={t} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

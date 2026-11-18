import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Small KPI tile. `change` is a fraction (0.12 = +12%) vs last month;
 * `goodWhenUp` decides whether an increase is shown as positive.
 */
export default function StatCard({ label, value, icon: Icon, tint = "pink", change = null, goodWhenUp = true, hint }) {
  const tints = {
    pink: "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300",
    teal: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
    violet: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  };
  const up = change !== null && change >= 0;
  const good = change !== null && (up === goodWhenUp || change === 0);

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className={cn("grid h-10 w-10 place-items-center rounded-2xl", tints[tint])}>
          <Icon className="h-5 w-5" />
        </span>
        {change !== null && Number.isFinite(change) && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold",
              good ? "bg-income/10 text-income" : "bg-destructive/10 text-destructive"
            )}
            title="Compared with last month"
          >
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(change * 100).toFixed(0)}%
          </span>
        )}
      </div>
      <p className="mt-3 text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-xl font-extrabold tracking-tight tabular sm:text-2xl">{value}</p>
      {hint && <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{hint}</p>}
    </Card>
  );
}

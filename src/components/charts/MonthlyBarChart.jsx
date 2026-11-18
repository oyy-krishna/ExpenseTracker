import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useChartTheme } from "./chartTheme";

function BarTooltip({ active, payload, currency, colors }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const net = d.income - d.expense;
  return (
    <div className="min-w-[180px] rounded-xl border bg-popover px-3 py-2.5 text-sm shadow-lg">
      <p className="mb-1.5 font-semibold">{d.fullLabel}</p>
      <p className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colors.income }} /> Income
        </span>
        <span className="font-semibold tabular">{formatCurrency(d.income, currency)}</span>
      </p>
      <p className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colors.expense }} /> Expenses
        </span>
        <span className="font-semibold tabular">{formatCurrency(d.expense, currency)}</span>
      </p>
      <p className="mt-1.5 flex items-center justify-between gap-4 border-t pt-1.5">
        <span className="text-muted-foreground">Saved</span>
        <span className="font-bold tabular">
          {net < 0 ? "−" : ""}
          {formatCurrency(Math.abs(net), currency)}
        </span>
      </p>
    </div>
  );
}

/** Grouped bars: income vs expenses per month. `data` from monthlySeries(). */
export default function MonthlyBarChart({ data, currency, height = 260 }) {
  const colors = useChartTheme();

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-xs font-semibold text-muted-foreground" aria-hidden>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colors.income }} /> Income
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colors.expense }} /> Expenses
        </span>
      </div>
      <div style={{ height }} role="img" aria-label="Monthly income and expenses bar chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2} barCategoryGap="28%" margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={colors.grid} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: colors.axis, fontSize: 12 }}
              dy={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={56}
              tick={{ fill: colors.axis, fontSize: 11 }}
              tickFormatter={(v) => formatCurrency(v, currency, { compact: true })}
            />
            <Tooltip
              cursor={{ fill: colors.cursor, radius: 8 }}
              content={<BarTooltip currency={currency} colors={colors} />}
            />
            <Bar dataKey="income" name="Income" fill={colors.income} radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="expense" name="Expenses" fill={colors.expense} radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

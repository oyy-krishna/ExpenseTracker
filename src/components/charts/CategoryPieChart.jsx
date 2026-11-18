import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useChartTheme } from "./chartTheme";

function PieTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border bg-popover px-3 py-2 text-sm shadow-lg">
      <p className="flex items-center gap-2 font-semibold">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
        {d.emoji} {d.name}
      </p>
      <p className="mt-0.5 tabular text-muted-foreground">
        {formatCurrency(d.value, currency)} · {(d.percent * 100).toFixed(1)}%
      </p>
    </div>
  );
}

/**
 * Donut of spending by category with a labelled legend (identity never relies
 * on colour alone). `data` comes from spendingByCategory().
 */
export default function CategoryPieChart({ data, currency, height = 220, showLegend = true }) {
  const theme = useChartTheme();
  const [activeId, setActiveId] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const active = data.find((d) => d.id === activeId);

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
      <div className="relative mx-auto w-full max-w-[240px] shrink-0" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="64%"
              outerRadius="96%"
              paddingAngle={data.length > 1 ? 2 : 0}
              cornerRadius={6}
              stroke={theme.surface}
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
              isAnimationActive
              onMouseEnter={(_, i) => setActiveId(data[i]?.id ?? null)}
              onMouseLeave={() => setActiveId(null)}
            >
              {data.map((d) => (
                <Cell
                  key={d.id}
                  fill={d.color}
                  opacity={activeId && activeId !== d.id ? 0.35 : 1}
                  style={{ transition: "opacity 150ms", outline: "none" }}
                />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip currency={currency} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-muted-foreground">{active ? active.name : "Total spent"}</span>
          <span className="max-w-[70%] truncate text-lg font-extrabold tabular">
            {formatCurrency(active ? active.value : total, currency, { compact: (active ? active.value : total) >= 1e6 })}
          </span>
          {active && <span className="text-xs font-semibold text-muted-foreground">{(active.percent * 100).toFixed(0)}%</span>}
        </div>
      </div>

      {showLegend && (
        <ul className="grid flex-1 gap-1" aria-label="Spending by category">
          {data.map((d) => (
            <li
              key={d.id}
              onMouseEnter={() => setActiveId(d.id)}
              onMouseLeave={() => setActiveId(null)}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm transition-colors hover:bg-muted/60"
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="min-w-0 flex-1 truncate font-medium">
                <span aria-hidden>{d.emoji}</span> {d.name}
              </span>
              <span className="text-xs font-semibold text-muted-foreground tabular">{(d.percent * 100).toFixed(0)}%</span>
              <span className="w-24 text-right font-semibold tabular">{formatCurrency(d.value, currency, { compact: d.value >= 1e5 })}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

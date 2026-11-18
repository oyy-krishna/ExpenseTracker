import { monthKey, toISODate } from "./utils";

export const OTHER_COLOR = "#94a3b8";

export function totals(transactions) {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, balance: income - expense };
}

export function filterByMonth(transactions, key) {
  return transactions.filter((t) => monthKey(t.date) === key);
}

export function currentMonthKey() {
  return toISODate(new Date()).slice(0, 7);
}

export function previousMonthKey(key = currentMonthKey()) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Spending grouped by category, sorted largest first.
 * Beyond `maxSlices`, the remainder folds into a single "Other" slice
 * (never invent extra hues for a long tail).
 */
export function spendingByCategory(transactions, getCategory, maxSlices = 6) {
  const map = new Map();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
  }
  const rows = [...map.entries()]
    .map(([id, value]) => {
      const c = getCategory(id, "expense");
      return { id, name: c.name, emoji: c.emoji, color: c.color, value };
    })
    .sort((a, b) => b.value - a.value);

  const total = rows.reduce((s, r) => s + r.value, 0);
  let result = rows;
  if (rows.length > maxSlices) {
    const head = rows.slice(0, maxSlices - 1);
    const rest = rows.slice(maxSlices - 1);
    result = [
      ...head,
      {
        id: "__other",
        name: `${rest.length} more`,
        emoji: "✨",
        color: OTHER_COLOR,
        value: rest.reduce((s, r) => s + r.value, 0),
      },
    ];
  }
  return result.map((r) => ({ ...r, percent: total ? r.value / total : 0 }));
}

/** Income vs expense for the last `count` months (oldest first). */
export function monthlySeries(transactions, count = 6) {
  const now = new Date();
  const months = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString(undefined, { month: "short" }),
      fullLabel: d.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
      income: 0,
      expense: 0,
    });
  }
  const index = new Map(months.map((m, i) => [m.key, i]));
  for (const t of transactions) {
    const i = index.get(monthKey(t.date));
    if (i === undefined) continue;
    months[i][t.type] += t.amount;
  }
  return months;
}

export function sortTransactions(list) {
  return [...list].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
}

export function groupByDay(list) {
  const groups = [];
  let current = null;
  for (const t of list) {
    if (!current || current.date !== t.date) {
      current = { date: t.date, items: [], net: 0 };
      groups.push(current);
    }
    current.items.push(t);
    current.net += t.type === "income" ? t.amount : -t.amount;
  }
  return groups;
}

export function percentChange(current, previous) {
  if (!previous) return null;
  return (current - previous) / previous;
}

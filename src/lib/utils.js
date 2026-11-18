import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

const formatterCache = new Map();
export function formatCurrency(value, currency = "INR", { compact = false } = {}) {
  const key = `${currency}-${compact}`;
  if (!formatterCache.has(key)) {
    formatterCache.set(
      key,
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        notation: compact ? "compact" : "standard",
        maximumFractionDigits: compact ? 1 : 2,
        minimumFractionDigits: 0,
      })
    );
  }
  return formatterCache.get(key).format(value || 0);
}

export function currencySymbol(currency = "INR") {
  try {
    const part = new Intl.NumberFormat(undefined, { style: "currency", currency, currencyDisplay: "narrowSymbol" })
      .formatToParts(0)
      .find((p) => p.type === "currency");
    return part?.value || currency;
  } catch {
    return currency;
  }
}

export function toISODate(d) {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

/** Today's date as YYYY-MM-DD in local time */
export function todayISO() {
  return toISODate(new Date());
}

/** Parse a YYYY-MM-DD string as a local date (no timezone shift) */
export function parseISODate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(iso, opts = { day: "numeric", month: "short", year: "numeric" }) {
  return parseISODate(iso).toLocaleDateString(undefined, opts);
}

export function monthKey(iso) {
  return iso.slice(0, 7);
}

export function relativeDayLabel(iso) {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (iso === todayISO()) return "Today";
  if (iso === toISODate(y)) return "Yesterday";
  return formatDate(iso, { weekday: "short", day: "numeric", month: "short" });
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

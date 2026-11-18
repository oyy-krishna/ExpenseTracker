import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

/** Gradient hero card showing the all-time balance and this month's flow. */
export default function BalanceCard({ balance, monthIncome, monthExpense, currency, onAdd }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-600 p-6 text-white shadow-xl shadow-pink-500/25 sm:p-8">
      {/* soft decorative blobs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-pink-300/30 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 text-sm font-medium text-white/85">
          <Wallet className="h-4 w-4" /> Current balance
        </div>
        <p className="mt-2 break-words text-4xl font-extrabold tracking-tight tabular sm:text-5xl">
          {balance < 0 ? "−" : ""}
          {formatCurrency(Math.abs(balance), currency)}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onAdd("income")}
            className="rounded-2xl bg-white/15 p-3 text-left backdrop-blur transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:p-4"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/85">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/25">
                <ArrowDownLeft className="h-3 w-3" />
              </span>
              Income · this month
            </span>
            <span className="mt-1 block truncate text-lg font-bold tabular sm:text-xl">{formatCurrency(monthIncome, currency)}</span>
          </button>
          <button
            type="button"
            onClick={() => onAdd("expense")}
            className="rounded-2xl bg-white/15 p-3 text-left backdrop-blur transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:p-4"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/85">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/25">
                <ArrowUpRight className="h-3 w-3" />
              </span>
              Spent · this month
            </span>
            <span className="mt-1 block truncate text-lg font-bold tabular sm:text-xl">{formatCurrency(monthExpense, currency)}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useFinance } from "@/context/FinanceContext";
import { cn, formatCurrency, relativeDayLabel } from "@/lib/utils";

export default function TransactionItem({ tx, showDate = false }) {
  const { getCategory, currency, deleteTransaction, restoreTransaction } = useFinance();
  const cat = getCategory(tx.categoryId, tx.type);
  const isIncome = tx.type === "income";

  const handleDelete = () => {
    deleteTransaction(tx.id);
    toast("Transaction deleted", {
      description: `${cat.emoji} ${tx.note || cat.name} · ${formatCurrency(tx.amount, currency)}`,
      action: { label: "Undo", onClick: () => restoreTransaction(tx) },
      duration: 5000,
    });
  };

  return (
    <li className="group flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-muted/60 sm:px-3">
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl"
        style={{ backgroundColor: `${cat.color}1f` }}
        aria-hidden
      >
        {cat.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{tx.note || cat.name}</p>
        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: cat.color }} />
          {cat.name}
          {showDate && <> · {relativeDayLabel(tx.date)}</>}
        </p>
      </div>
      <p className={cn("shrink-0 text-sm font-bold tabular", isIncome ? "text-income" : "text-foreground")}>
        {isIncome ? "+" : "−"}
        {formatCurrency(tx.amount, currency)}
      </p>
      <button
        type="button"
        onClick={handleDelete}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:opacity-0 sm:group-hover:opacity-100"
        aria-label={`Delete ${tx.note || cat.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}

import { useEffect, useRef, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, CalendarDays, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinance } from "@/context/FinanceContext";
import { cn, currencySymbol, formatCurrency, todayISO } from "@/lib/utils";

const emptyForm = (type) => ({ type, amount: "", categoryId: "", note: "", date: todayISO() });

export default function TransactionDialog({ open, onOpenChange, defaultType = "expense" }) {
  const { expenseCategories, incomeCategories, addTransaction, currency, getCategory } = useFinance();
  const [form, setForm] = useState(() => emptyForm(defaultType));
  const [error, setError] = useState("");
  const amountRef = useRef(null);

  // Reset whenever the sheet opens
  useEffect(() => {
    if (open) {
      setForm(emptyForm(defaultType));
      setError("");
    }
  }, [open, defaultType]);

  const categories = form.type === "expense" ? expenseCategories : incomeCategories;
  const isExpense = form.type === "expense";

  const update = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.amount || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter an amount greater than zero");
      amountRef.current?.focus();
      return;
    }
    if (amount > 1e10) {
      setError("That amount looks too large");
      return;
    }
    if (!form.categoryId) {
      setError("Pick a category");
      return;
    }
    if (!form.date || form.date > todayISO()) {
      setError("Date can't be in the future");
      return;
    }
    try {
      const tx = addTransaction({ ...form, amount });
      const cat = getCategory(tx.categoryId, tx.type);
      toast.success(`${isExpense ? "Expense" : "Income"} added`, {
        description: `${cat.emoji} ${cat.name} · ${formatCurrency(tx.amount, currency)}`,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          // Focus amount without forcing the keyboard open on touch devices
          if (window.matchMedia("(pointer: fine)").matches) amountRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>New transaction</DialogTitle>
          <DialogDescription>Track where your money flows 💸</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
          <Tabs value={form.type} onValueChange={(type) => update({ type, categoryId: "" })}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense" className="data-[state=active]:text-expense">
                <ArrowUpRight className="h-4 w-4" /> Expense
              </TabsTrigger>
              <TabsTrigger value="income" className="data-[state=active]:text-income">
                <ArrowDownLeft className="h-4 w-4" /> Income
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">
                {currencySymbol(currency)}
              </span>
              <Input
                ref={amountRef}
                id="amount"
                inputMode="decimal"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => update({ amount: e.target.value })}
                className={cn(
                  "h-16 pl-12 text-3xl font-extrabold tabular sm:text-3xl",
                  isExpense ? "text-expense" : "text-income"
                )}
                aria-invalid={!!error && !form.amount}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Category">
              {categories.map((c) => {
                const active = form.categoryId === c.id;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={active}
                    key={c.id}
                    onClick={() => update({ categoryId: c.id })}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-2xl border px-1.5 py-2.5 text-center text-[11px] font-semibold leading-tight transition-all hover:border-primary/40 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "border-primary bg-accent text-accent-foreground shadow-sm" : "bg-background/40"
                    )}
                  >
                    <span
                      className="grid h-9 w-9 place-items-center rounded-xl text-lg"
                      style={{ backgroundColor: `${c.color}1f` }}
                      aria-hidden
                    >
                      {c.emoji}
                    </span>
                    <span className="line-clamp-2">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="date" className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> Date
              </Label>
              <Input
                id="date"
                type="date"
                max={todayISO()}
                value={form.date}
                onChange={(e) => update({ date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note" className="flex items-center gap-1.5">
                <StickyNote className="h-3.5 w-3.5" /> Note <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="note"
                maxLength={120}
                placeholder={isExpense ? "e.g. Matcha latte 🍵" : "e.g. Monthly salary"}
                value={form.note}
                onChange={(e) => update({ note: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="-mt-1 rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="lg" className="sm:h-10 sm:px-5 sm:text-sm">
              Add {isExpense ? "expense" : "income"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

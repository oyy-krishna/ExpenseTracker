import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TransactionList from "@/components/transactions/TransactionList";
import EmptyState from "@/components/EmptyState";
import { useFinance } from "@/context/FinanceContext";
import { useTransactionDialog } from "@/context/TransactionDialogContext";
import { totals } from "@/lib/finance";
import { formatCurrency, monthKey, parseISODate } from "@/lib/utils";

export default function Transactions() {
  const { transactions, categories, currency, getCategory } = useFinance();
  const { openDialog } = useTransactionDialog();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [month, setMonth] = useState("all");

  const months = useMemo(() => {
    const set = [...new Set(transactions.map((t) => monthKey(t.date)))];
    return set.map((k) => ({
      key: k,
      label: parseISODate(`${k}-01`).toLocaleDateString(undefined, { month: "long", year: "numeric" }),
    }));
  }, [transactions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (categoryId !== "all" && t.categoryId !== categoryId) return false;
      if (month !== "all" && monthKey(t.date) !== month) return false;
      if (q) {
        const cat = getCategory(t.categoryId, t.type);
        if (!`${t.note} ${cat.name} ${t.amount}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [transactions, type, categoryId, month, query, getCategory]);

  const sum = totals(filtered);
  const visibleCategories = categories.filter((c) => type === "all" || c.type === type);
  const hasFilters = query || type !== "all" || categoryId !== "all" || month !== "all";

  const reset = () => {
    setQuery("");
    setType("all");
    setCategoryId("all");
    setMonth("all");
  };

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">All transactions</h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <Button onClick={() => openDialog("expense")} className="hidden sm:inline-flex">
          <Plus /> Add
        </Button>
      </div>

      {/* Filters live in one row above the list */}
      <Card className="p-3 sm:p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes, categories, amounts…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              aria-label="Search transactions"
            />
          </div>
          <Tabs
            value={type}
            onValueChange={(v) => {
              setType(v);
              setCategoryId("all");
            }}
          >
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 md:flex md:items-center">
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="md:w-56" aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {visibleCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                  {type === "all" && c.locked ? ` (${c.type})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="md:w-56" aria-label="Filter by month">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              {months.map((m) => (
                <SelectItem key={m.key} value={m.key}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={reset} className="col-span-2 md:col-span-1">
              <X /> Clear filters
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <SummaryPill label="Income" value={formatCurrency(sum.income, currency)} className="text-income" />
        <SummaryPill label="Expenses" value={formatCurrency(sum.expense, currency)} className="text-expense" />
        <SummaryPill
          label="Net"
          value={`${sum.balance < 0 ? "−" : ""}${formatCurrency(Math.abs(sum.balance), currency)}`}
        />
      </div>

      <Card>
        <CardContent className="px-2 pt-5 sm:px-3 sm:pt-6">
          {filtered.length ? (
            <TransactionList transactions={filtered} />
          ) : transactions.length ? (
            <EmptyState emoji="🔍" title="Nothing matches" description="Try a different search or clear your filters.">
              <Button variant="outline" onClick={reset}>
                Clear filters
              </Button>
            </EmptyState>
          ) : (
            <EmptyState emoji="🌷" title="No transactions yet" description="Your history will bloom here.">
              <Button onClick={() => openDialog("expense")}>
                <Plus /> Add transaction
              </Button>
            </EmptyState>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryPill({ label, value, className }) {
  return (
    <Card className="px-3 py-3 sm:px-5 sm:py-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-0.5 truncate text-sm font-extrabold tabular sm:text-lg ${className ?? ""}`}>{value}</p>
    </Card>
  );
}

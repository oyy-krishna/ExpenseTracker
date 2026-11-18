import { useMemo, useState } from "react";
import { Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CategoryDialog from "@/components/categories/CategoryDialog";
import { useFinance } from "@/context/FinanceContext";
import { currentMonthKey } from "@/lib/finance";
import { formatCurrency, monthKey } from "@/lib/utils";

export default function Categories() {
  const { categories, transactions, currency, deleteCategory } = useFinance();
  const [type, setType] = useState("expense");
  const [dialog, setDialog] = useState({ open: false, category: null });
  const [toDelete, setToDelete] = useState(null);

  const usage = useMemo(() => {
    const cur = currentMonthKey();
    const map = new Map();
    for (const t of transactions) {
      const u = map.get(t.categoryId) || { count: 0, month: 0, total: 0 };
      u.count += 1;
      u.total += t.amount;
      if (monthKey(t.date) === cur) u.month += t.amount;
      map.set(t.categoryId, u);
    }
    return map;
  }, [transactions]);

  const list = categories.filter((c) => c.type === type);
  const maxMonth = Math.max(1, ...list.map((c) => usage.get(c.id)?.month || 0));

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteCategory(toDelete.id);
    toast.success("Category deleted", { description: "Its transactions moved to “Other”." });
    setToDelete(null);
  };

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Categories</h2>
          <p className="text-sm text-muted-foreground">Organise your money your way</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={type} onValueChange={setType} className="flex-1 sm:flex-none">
            <TabsList className="grid w-full grid-cols-2 sm:w-auto">
              <TabsTrigger value="expense">Expenses</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setDialog({ open: true, category: null })} className="h-11">
            <Plus /> <span className="hidden sm:inline">New category</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => {
          const u = usage.get(c.id) || { count: 0, month: 0, total: 0 };
          return (
            <Card key={c.id} className="group p-4">
              <div className="flex items-start gap-3">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl"
                  style={{ backgroundColor: `${c.color}1f` }}
                  aria-hidden
                >
                  {c.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate font-bold">
                    {c.name}
                    {c.locked && <Lock className="h-3 w-3 text-muted-foreground" aria-label="Default category" />}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {u.count} {u.count === 1 ? "transaction" : "transactions"}
                  </p>
                </div>
                {!c.locked && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setDialog({ open: true, category: c })}
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Edit ${c.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setToDelete(c)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Delete ${c.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="mb-1.5 flex items-baseline justify-between text-xs">
                  <span className="font-medium text-muted-foreground">This month</span>
                  <span className="text-sm font-bold tabular">{formatCurrency(u.month, currency)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(u.month / maxMonth) * 100}%`, backgroundColor: c.color }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <CategoryDialog
        open={dialog.open}
        category={dialog.category}
        defaultType={type}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {toDelete?.emoji} {toDelete?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {usage.get(toDelete?.id)?.count
                ? `${usage.get(toDelete.id).count} transaction(s) will be moved to “Other”. Nothing is lost.`
                : "This category has no transactions."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORY_COLORS, EMOJI_CHOICES } from "@/data/defaults";
import { useFinance } from "@/context/FinanceContext";
import { cn } from "@/lib/utils";

/** Create a new category, or edit an existing one when `category` is passed. */
export default function CategoryDialog({ open, onOpenChange, defaultType = "expense", category = null }) {
  const { categories, addCategory, updateCategory } = useFinance();
  const editing = !!category;
  const [form, setForm] = useState({ name: "", emoji: "🌸", color: CATEGORY_COLORS[0], type: defaultType });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    if (category) setForm({ name: category.name, emoji: category.emoji, color: category.color, type: category.type });
    else setForm({ name: "", emoji: "🌸", color: CATEGORY_COLORS[0], type: defaultType });
  }, [open, category, defaultType]);

  const submit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return setError("Give your category a name");
    const dup = categories.some(
      (c) => c.type === form.type && c.id !== category?.id && c.name.toLowerCase() === name.toLowerCase()
    );
    if (dup) return setError("You already have a category with that name");

    if (editing) {
      updateCategory(category.id, { name: name.slice(0, 32), emoji: form.emoji, color: form.color });
      toast.success("Category updated");
    } else {
      addCategory({ ...form, name });
      toast.success("Category created", { description: `${form.emoji} ${name}` });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle>
          <DialogDescription>Make it yours: pick a name, an emoji and a colour.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-5" noValidate>
          {!editing && (
            <Tabs value={form.type} onValueChange={(type) => setForm((f) => ({ ...f, type }))}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="expense">Expense</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <div className="flex items-center gap-3">
            <span
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl"
              style={{ backgroundColor: `${form.color}24` }}
              aria-hidden
            >
              {form.emoji}
            </span>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                maxLength={32}
                placeholder="e.g. Coffee dates"
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }));
                  setError("");
                }}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Emoji</Label>
            <div className="grid grid-cols-9 gap-1.5 rounded-2xl border bg-background/40 p-2">
              {EMOJI_CHOICES.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                  className={cn(
                    "grid aspect-square place-items-center rounded-lg text-lg transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    form.emoji === e && "bg-accent ring-2 ring-primary"
                  )}
                  aria-label={`Emoji ${e}`}
                  aria-pressed={form.emoji === e}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Colour</Label>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  className="grid h-9 w-9 place-items-center rounded-full ring-offset-2 ring-offset-card transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ backgroundColor: c, boxShadow: form.color === c ? `0 0 0 2px hsl(var(--card)), 0 0 0 4px ${c}` : undefined }}
                  aria-label={`Colour ${c}`}
                  aria-pressed={form.color === c}
                >
                  {form.color === c && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editing ? "Save changes" : "Create category"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

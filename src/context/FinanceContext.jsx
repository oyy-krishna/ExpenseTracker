import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CATEGORY_COLORS, DEFAULT_CATEGORIES, generateSampleTransactions } from "@/data/defaults";
import { sortTransactions } from "@/lib/finance";
import { uid } from "@/lib/utils";

const FinanceContext = createContext(null);

const FALLBACK = { expense: "other-expense", income: "other-income" };
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage("bloom:transactions", []);
  const [categories, setCategories] = useLocalStorage("bloom:categories", DEFAULT_CATEGORIES);
  const [settings, setSettings] = useLocalStorage("bloom:settings", { currency: "INR", name: "" });

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const getCategory = useCallback(
    (id, type = "expense") =>
      categoryMap.get(id) ||
      categoryMap.get(FALLBACK[type]) || { id, name: "Other", emoji: "✨", color: "#94a3b8", type },
    [categoryMap]
  );

  const sorted = useMemo(() => sortTransactions(transactions), [transactions]);

  const addTransaction = useCallback(
    (tx) => {
      const amount = Math.round(Number(tx.amount) * 100) / 100;
      if (!Number.isFinite(amount) || amount <= 0) throw new Error("Amount must be greater than zero");
      if (!DATE_RE.test(tx.date)) throw new Error("Please pick a valid date");
      const record = {
        id: uid(),
        type: tx.type === "income" ? "income" : "expense",
        amount,
        categoryId: tx.categoryId,
        note: (tx.note || "").trim().slice(0, 120),
        date: tx.date,
        createdAt: Date.now(),
      };
      setTransactions((list) => [record, ...list]);
      return record;
    },
    [setTransactions]
  );

  const deleteTransaction = useCallback(
    (id) => setTransactions((list) => list.filter((t) => t.id !== id)),
    [setTransactions]
  );

  const restoreTransaction = useCallback(
    (tx) => setTransactions((list) => (list.some((t) => t.id === tx.id) ? list : [tx, ...list])),
    [setTransactions]
  );

  const addCategory = useCallback(
    ({ name, emoji, type, color }) => {
      const sameType = categories.filter((c) => c.type === type && !c.locked);
      const record = {
        id: uid(),
        name: name.trim().slice(0, 32),
        emoji: emoji || "✨",
        color: color || CATEGORY_COLORS[sameType.length % CATEGORY_COLORS.length],
        type,
        builtIn: false,
      };
      // Keep the locked "Other" bucket last within its type
      setCategories((list) => {
        const idx = list.findIndex((c) => c.id === FALLBACK[type]);
        if (idx === -1) return [...list, record];
        return [...list.slice(0, idx), record, ...list.slice(idx)];
      });
      return record;
    },
    [categories, setCategories]
  );

  const updateCategory = useCallback(
    (id, patch) => setCategories((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    [setCategories]
  );

  /** Deletes a category and moves its transactions into "Other". */
  const deleteCategory = useCallback(
    (id) => {
      const cat = categoryMap.get(id);
      if (!cat || cat.locked) return;
      setCategories((list) => list.filter((c) => c.id !== id));
      setTransactions((list) =>
        list.map((t) => (t.categoryId === id ? { ...t, categoryId: FALLBACK[cat.type] } : t))
      );
    },
    [categoryMap, setCategories, setTransactions]
  );

  const loadSampleData = useCallback(
    () => setTransactions((list) => [...generateSampleTransactions(), ...list]),
    [setTransactions]
  );

  const clearAll = useCallback(() => {
    setTransactions([]);
    setCategories(DEFAULT_CATEGORIES);
  }, [setTransactions, setCategories]);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify({ version: 1, transactions, categories, settings }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bloom-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [transactions, categories, settings]);

  const importData = useCallback(
    (data) => {
      if (!data || !Array.isArray(data.transactions) || !Array.isArray(data.categories)) {
        throw new Error("This file doesn't look like a Bloom backup");
      }
      const valid = data.transactions
        .filter(
          (t) =>
            t && t.id && (t.type === "income" || t.type === "expense") && Number(t.amount) > 0 && DATE_RE.test(t.date)
        )
        .map((t) => ({ ...t, amount: Number(t.amount) }));
      const cats = data.categories.filter((c) => c && c.id && c.name && (c.type === "income" || c.type === "expense"));
      // Always keep the fallback buckets available
      for (const d of DEFAULT_CATEGORIES.filter((c) => c.locked)) {
        if (!cats.some((c) => c.id === d.id)) cats.push(d);
      }
      setTransactions(valid);
      setCategories(cats);
      if (data.settings) setSettings((s) => ({ ...s, ...data.settings }));
      return valid.length;
    },
    [setTransactions, setCategories, setSettings]
  );

  const value = useMemo(
    () => ({
      transactions: sorted,
      categories,
      expenseCategories: categories.filter((c) => c.type === "expense"),
      incomeCategories: categories.filter((c) => c.type === "income"),
      settings,
      currency: settings.currency || "INR",
      setSettings,
      getCategory,
      addTransaction,
      deleteTransaction,
      restoreTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      loadSampleData,
      clearAll,
      exportData,
      importData,
    }),
    [
      sorted, categories, settings, setSettings, getCategory, addTransaction, deleteTransaction,
      restoreTransaction, addCategory, updateCategory, deleteCategory, loadSampleData, clearAll,
      exportData, importData,
    ]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}

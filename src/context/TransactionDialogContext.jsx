import { createContext, useCallback, useContext, useState } from "react";
import TransactionDialog from "@/components/transactions/TransactionDialog";

const TransactionDialogContext = createContext(null);

/** Lets any component open the global "Add transaction" sheet. */
export function TransactionDialogProvider({ children }) {
  const [state, setState] = useState({ open: false, type: "expense" });

  const openDialog = useCallback((type = "expense") => setState({ open: true, type }), []);
  const setOpen = useCallback((open) => setState((s) => ({ ...s, open })), []);

  return (
    <TransactionDialogContext.Provider value={{ openDialog }}>
      {children}
      <TransactionDialog open={state.open} onOpenChange={setOpen} defaultType={state.type} />
    </TransactionDialogContext.Provider>
  );
}

export function useTransactionDialog() {
  const ctx = useContext(TransactionDialogContext);
  if (!ctx) throw new Error("useTransactionDialog must be used within TransactionDialogProvider");
  return ctx;
}

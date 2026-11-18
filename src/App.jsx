import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { FinanceProvider } from "@/context/FinanceContext";
import { TransactionDialogProvider } from "@/context/TransactionDialogContext";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Insights from "@/pages/Insights";
import Categories from "@/pages/Categories";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <BrowserRouter>
          <TransactionDialogProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="insights" element={<Insights />} />
                <Route path="categories" element={<Categories />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </TransactionDialogProvider>
        </BrowserRouter>
        <Toaster />
      </FinanceProvider>
    </ThemeProvider>
  );
}

import { NavLink } from "react-router-dom";
import { Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactionDialog } from "@/context/TransactionDialogContext";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { NAV_ITEMS } from "./nav";

export default function Sidebar() {
  const { openDialog } = useTransactionDialog();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r bg-card/60 px-4 py-6 backdrop-blur-xl lg:flex">
      <div className="px-2">
        <Logo />
      </div>

      <Button className="mt-8 w-full" size="lg" onClick={() => openDialog("expense")}>
        <Plus /> Add transaction
      </Button>

      <nav className="mt-6 flex flex-col gap-1" aria-label="Main">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-gradient-to-br from-pink-100 to-violet-100 p-4 dark:from-pink-500/10 dark:to-violet-500/10">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <p className="mt-2 text-sm font-bold">Made with ❤️ by Kashish</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Everything is saved and secure, your data is private and encrypted.
        </p>
      </div>
    </aside>
  );
}

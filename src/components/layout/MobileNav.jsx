import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTransactionDialog } from "@/context/TransactionDialogContext";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav";

/** Bottom tab bar for phones, with a floating add button in the middle. */
export default function MobileNav() {
  const { openDialog } = useTransactionDialog();
  const items = NAV_ITEMS.slice(0, 4);
  const left = items.slice(0, 2);
  const right = items.slice(2);

  const renderLink = ({ to, short, icon: Icon, end }) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-semibold transition-colors focus-visible:outline-none",
          isActive ? "text-primary" : "text-muted-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className={cn("grid h-8 w-12 place-items-center rounded-full transition-colors", isActive && "bg-accent")}>
            <Icon className="h-5 w-5" />
          </span>
          {short}
        </>
      )}
    </NavLink>
  );

  return (
    <nav
      aria-label="Main"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t bg-card/85 backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto flex max-w-md items-end px-2">
        {left.map(renderLink)}
        <div className="flex flex-1 justify-center">
          <button
            type="button"
            onClick={() => openDialog("expense")}
            className="-mt-6 mb-2 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white shadow-lg shadow-pink-500/40 transition active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30"
            aria-label="Add transaction"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
        {right.map(renderLink)}
      </div>
    </nav>
  );
}

import { Link, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { NAV_ITEMS } from "./nav";

export default function Header() {
  const { pathname } = useLocation();
  const current = NAV_ITEMS.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)));

  return (
    <header className="sticky top-0 z-30 border-b bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pink-400 to-violet-500 text-lg shadow-md shadow-pink-500/30">
            🌸
          </span>
          <span className="text-lg font-extrabold tracking-tight">{current?.label === "Dashboard" ? "Bloom" : current?.label ?? "Bloom"}</span>
        </div>
        <h1 className="hidden text-xl font-extrabold tracking-tight lg:block">{current?.label ?? "Bloom"}</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="icon" className="rounded-xl lg:hidden" aria-label="Settings">
            <Link to="/settings">
              <Settings />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

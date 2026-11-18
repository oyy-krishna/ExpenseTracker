import { LayoutDashboard, PieChart, ReceiptText, Settings, Tags } from "lucide-react";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", short: "Home", icon: LayoutDashboard, end: true },
  { to: "/transactions", label: "Transactions", short: "History", icon: ReceiptText },
  { to: "/insights", label: "Insights", short: "Insights", icon: PieChart },
  { to: "/categories", label: "Categories", short: "Categories", icon: Tags },
  { to: "/settings", label: "Settings", short: "Settings", icon: Settings },
];

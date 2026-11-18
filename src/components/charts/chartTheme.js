import { useTheme } from "@/context/ThemeContext";

/**
 * SVG presentation attributes can't read CSS variables reliably, so charts
 * pull concrete colours for the active theme from here.
 */
export function useChartTheme() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    income: dark ? "#2dd4bf" : "#0d9488",
    expense: dark ? "#f472b6" : "#ec4899",
    grid: dark ? "#2e2433" : "#f3e4ec",
    axis: dark ? "#a698a8" : "#7a6b74",
    surface: dark ? "#1c1520" : "#ffffff",
    cursor: dark ? "rgba(244,114,182,0.08)" : "rgba(236,72,153,0.06)",
  };
}

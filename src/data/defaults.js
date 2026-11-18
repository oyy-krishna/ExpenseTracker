import { toISODate, uid } from "@/lib/utils";

/**
 * Categorical palette, validated for lightness band, chroma, colour-blind
 * separation and normal-vision separation. New categories take the next slot.
 */
export const CATEGORY_COLORS = [
  "#ec4899", // pink
  "#f97316", // orange
  "#8b5cf6", // violet
  "#0d9488", // teal
  "#e11d48", // rose
  "#0284c7", // sky
  "#ca8a04", // amber
  "#6366f1", // indigo
];

export const EMOJI_CHOICES = [
  "🍰", "☕", "🛍️", "💄", "💅", "🧖‍♀️", "✈️", "🏠", "💡", "📱",
  "🩺", "💊", "📚", "🎓", "🎬", "🎧", "🎁", "🐶", "🚕", "🏋️‍♀️",
  "🌸", "👗", "👠", "💍", "🧴", "🍕", "🥗", "🛒", "💼", "💻",
  "💰", "📈", "🎀", "🌷", "🧁", "✨",
];

export const DEFAULT_CATEGORIES = [
  // Expenses
  { id: "food", name: "Food & Cafés", emoji: "☕", color: "#f97316", type: "expense", builtIn: true },
  { id: "shopping", name: "Shopping", emoji: "🛍️", color: "#ec4899", type: "expense", builtIn: true },
  { id: "beauty", name: "Beauty & Skincare", emoji: "💄", color: "#8b5cf6", type: "expense", builtIn: true },
  { id: "selfcare", name: "Self-care & Fitness", emoji: "🧖‍♀️", color: "#0d9488", type: "expense", builtIn: true },
  { id: "bills", name: "Bills & Rent", emoji: "🏠", color: "#6366f1", type: "expense", builtIn: true },
  { id: "travel", name: "Travel & Rides", emoji: "✈️", color: "#0284c7", type: "expense", builtIn: true },
  { id: "health", name: "Health", emoji: "🩺", color: "#e11d48", type: "expense", builtIn: true },
  { id: "education", name: "Education", emoji: "📚", color: "#ca8a04", type: "expense", builtIn: true },
  { id: "fun", name: "Entertainment", emoji: "🎬", color: "#ec4899", type: "expense", builtIn: true },
  { id: "gifts", name: "Gifts", emoji: "🎁", color: "#e11d48", type: "expense", builtIn: true },
  { id: "other-expense", name: "Other", emoji: "✨", color: "#94a3b8", type: "expense", builtIn: true, locked: true },
  // Income
  { id: "salary", name: "Salary", emoji: "💼", color: "#0d9488", type: "income", builtIn: true },
  { id: "freelance", name: "Freelance", emoji: "💻", color: "#8b5cf6", type: "income", builtIn: true },
  { id: "allowance", name: "Allowance", emoji: "💰", color: "#ca8a04", type: "income", builtIn: true },
  { id: "investments", name: "Investments", emoji: "📈", color: "#0284c7", type: "income", builtIn: true },
  { id: "gift-income", name: "Gifts Received", emoji: "🎀", color: "#ec4899", type: "income", builtIn: true },
  { id: "other-income", name: "Other", emoji: "✨", color: "#94a3b8", type: "income", builtIn: true, locked: true },
];

export const CURRENCIES = [
  { code: "INR", label: "Indian Rupee (₹)" },
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "AED", label: "UAE Dirham" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "AUD", label: "Australian Dollar" },
  { code: "JPY", label: "Japanese Yen (¥)" },
];

/** Realistic sample data spanning the last ~5 months, for trying the app out. */
export function generateSampleTransactions() {
  const now = new Date();
  const list = [];
  const add = (monthsAgo, day, type, categoryId, amount, note) => {
    const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
    if (d > now) return;
    list.push({ id: uid(), type, categoryId, amount, note, date: toISODate(d), createdAt: d.getTime() });
  };

  for (let m = 0; m < 5; m++) {
    add(m, 1, "income", "salary", 52000, "Monthly salary");
    add(m, 2, "expense", "bills", 14000, "Rent");
    add(m, 4, "expense", "food", 380 + m * 40, "Iced latte & croissant");
    add(m, 6, "expense", "beauty", 1650 - m * 120, "Skincare restock");
    add(m, 8, "expense", "selfcare", 1500, "Yoga membership");
    add(m, 10, "expense", "shopping", 2800 + (m % 2) * 1900, m % 2 ? "Summer dresses" : "New sneakers");
    add(m, 12, "expense", "food", 1240, "Brunch with the girls");
    add(m, 14, "expense", "bills", 899, "Phone & Wi-Fi");
    add(m, 15, "expense", "travel", 640 + m * 90, "Cab rides");
    add(m, 18, "expense", "fun", 750, "Movie night");
    add(m, 21, "expense", "food", 2100 - m * 100, "Groceries");
    if (m % 2 === 0) add(m, 16, "income", "freelance", 9500, "Design project");
    if (m === 1) add(m, 20, "expense", "travel", 8600, "Weekend getaway 🏖️");
    if (m === 2) add(m, 24, "expense", "gifts", 2200, "Birthday gift for a friend");
    if (m === 3) add(m, 11, "expense", "education", 3499, "Online course");
    if (m === 0) add(m, 3, "expense", "health", 700, "Doctor visit");
    if (m === 2) add(m, 25, "income", "investments", 3200, "Mutual fund returns");
    if (m === 4) add(m, 9, "income", "gift-income", 5000, "Birthday money 🎂");
  }
  return list;
}

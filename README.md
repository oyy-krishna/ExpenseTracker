# 🌸 Bloom: Expense Tracker

A modern, mobile-first expense tracker. Track income and spending, organise categories, and see where your money goes with charts. Everything is saved in your browser's **LocalStorage**: no backend, no database, no account.

## Features

- **Dashboard**: current balance, this month's income and spending, savings rate, daily average, and month-over-month trends
- **Add expenses and income** from a bottom sheet with an emoji category picker
- **Delete transactions**, with a 5-second **Undo**
- **Categories**: built-in ones plus your own (name, emoji, colour). You can edit and delete them; deleting a category moves its transactions to "Other"
- **Pie (donut) chart** of spending by category and a **bar chart** of income vs expenses (3, 6 or 12 months)
- **Transactions page** with search, a type filter, a category filter and a month filter, grouped by day
- **Dark mode toggle** that remembers your choice and has no flash on load
- **Settings**: your name, currency (₹, $, €, £…), JSON export and import backup, sample data, erase all
- Fully responsive, with a sidebar on desktop and a bottom tab bar plus a floating ➕ button on mobile

## Tech stack

React 18 · Vite 5 · Tailwind CSS 3 · shadcn/ui (Radix primitives) · Recharts · lucide-react · sonner · React Router

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (button, card, dialog, select, tabs, …)
│   ├── layout/          # AppLayout, Sidebar, Header, MobileNav, ThemeToggle
│   ├── dashboard/       # BalanceCard, StatCard
│   ├── transactions/    # TransactionDialog, TransactionList, TransactionItem
│   ├── charts/          # CategoryPieChart, MonthlyBarChart, chart theme
│   ├── categories/      # CategoryDialog
│   └── EmptyState.jsx
├── context/             # ThemeContext, FinanceContext, TransactionDialogContext
├── hooks/               # useLocalStorage
├── lib/                 # utils (formatting, dates), finance (aggregations)
├── data/                # default categories, palette, sample data
├── pages/               # Dashboard, Transactions, Insights, Categories, Settings, NotFound
├── App.jsx
├── main.jsx
└── index.css            # Tailwind and theme tokens (light and dark)
```

## Data storage

| Key                  | Contents                         |
| -------------------- | -------------------------------- |
| `bloom:transactions` | array of transactions            |
| `bloom:categories`   | array of categories              |
| `bloom:settings`     | `{ currency, name }`             |
| `bloom:theme`        | `"light"` or `"dark"`            |

Data stays in the browser where it was entered. Use **Settings → Export backup** to move it to another device.

## Deploying

The output is a static single-page app. When you host it on Netlify, Vercel or a similar service, add a rewrite so every path serves `index.html`. That lets routes like `/insights` work after a page refresh.

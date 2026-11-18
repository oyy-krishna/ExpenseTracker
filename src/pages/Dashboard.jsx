import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, PiggyBank, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BalanceCard from "@/components/dashboard/BalanceCard";
import StatCard from "@/components/dashboard/StatCard";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import TransactionItem from "@/components/transactions/TransactionItem";
import EmptyState from "@/components/EmptyState";
import { useFinance } from "@/context/FinanceContext";
import { useTransactionDialog } from "@/context/TransactionDialogContext";
import {
  currentMonthKey,
  filterByMonth,
  monthlySeries,
  percentChange,
  previousMonthKey,
  spendingByCategory,
  totals,
} from "@/lib/finance";
import { formatCurrency, greeting } from "@/lib/utils";

export default function Dashboard() {
  const { transactions, currency, getCategory, settings, loadSampleData } = useFinance();
  const { openDialog } = useTransactionDialog();

  const stats = useMemo(() => {
    const thisMonth = filterByMonth(transactions, currentMonthKey());
    const lastMonth = filterByMonth(transactions, previousMonthKey());
    const all = totals(transactions);
    const cur = totals(thisMonth);
    const prev = totals(lastMonth);
    const day = new Date().getDate();
    return {
      all,
      cur,
      prev,
      savingsRate: cur.income ? (cur.income - cur.expense) / cur.income : null,
      dailyAvg: cur.expense / day,
      pie: spendingByCategory(thisMonth, getCategory, 6),
      bars: monthlySeries(transactions, 6),
    };
  }, [transactions, getCategory]);

  const recent = transactions.slice(0, 6);
  const monthName = new Date().toLocaleDateString(undefined, { month: "long" });

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {greeting()}
          {settings.name ? `, ${settings.name}` : ""} ✨
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Here’s your money glow-up</h2>
      </div>

      <BalanceCard
        balance={stats.all.balance}
        monthIncome={stats.cur.income}
        monthExpense={stats.cur.expense}
        currency={currency}
        onAdd={openDialog}
      />

      {transactions.length === 0 ? (
        <Card>
          <EmptyState
            emoji="💖"
            title="Let’s start your money diary"
            description="Add your first expense or income, or explore Bloom with some sample data. Everything stays on your device."
          >
            <Button onClick={() => openDialog("expense")}>Add first transaction</Button>
            <Button variant="outline" onClick={loadSampleData}>
              <Sparkles /> Try sample data
            </Button>
          </EmptyState>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard
              label={`Income in ${monthName}`}
              value={formatCurrency(stats.cur.income, currency)}
              icon={TrendingUp}
              tint="teal"
              change={percentChange(stats.cur.income, stats.prev.income)}
              goodWhenUp
            />
            <StatCard
              label={`Spent in ${monthName}`}
              value={formatCurrency(stats.cur.expense, currency)}
              icon={TrendingDown}
              tint="pink"
              change={percentChange(stats.cur.expense, stats.prev.expense)}
              goodWhenUp={false}
            />
            <StatCard
              label="Savings rate"
              value={stats.savingsRate === null ? "—" : `${Math.round(stats.savingsRate * 100)}%`}
              icon={PiggyBank}
              tint="violet"
              hint={stats.savingsRate === null ? "Add income to see this" : "of this month’s income"}
            />
            <StatCard
              label="Daily average"
              value={formatCurrency(stats.dailyAvg, currency)}
              icon={CalendarDays}
              tint="amber"
              hint="spent per day this month"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Where it went</CardTitle>
                <CardDescription>Spending by category · {monthName}</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.pie.length ? (
                  <CategoryPieChart data={stats.pie} currency={currency} height={200} />
                ) : (
                  <EmptyState emoji="🧾" title="No spending yet this month" className="py-8" />
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Income vs expenses</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyBarChart data={stats.bars} currency={currency} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/transactions">
                  See all <ArrowRight />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="px-2 sm:px-3">
              <ul className="space-y-0.5">
                {recent.map((t) => (
                  <TransactionItem key={t.id} tx={t} showDate />
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

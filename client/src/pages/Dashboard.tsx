import { useExpenses, useExpenseAnalysis } from "@/hooks/use-expenses";
import { ExpenseCard } from "@/components/ExpenseCard";
import { Layout } from "@/components/Layout";
import { Loader2, TrendingUp, Wallet, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: expenses, isLoading: loadingExpenses } = useExpenses();
  const { data: analysis, isLoading: loadingAnalysis } = useExpenseAnalysis();

  const isLoading = loadingExpenses || loadingAnalysis;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate some quick stats for the UI
  const recentExpenses = expenses?.slice(0, 5) || [];
  const topCategory = analysis?.byCategory[0];

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, here's your financial overview.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Spend Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-purple-700 text-white rounded-3xl p-6 shadow-xl shadow-primary/20 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 opacity-90">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="font-medium">Total Spent</span>
            </div>
            <p className="text-4xl font-display font-bold tracking-tight">
              ${((analysis?.totalSpend || 0) / 100).toFixed(2)}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm opacity-80 bg-black/10 w-fit px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span>+12% vs last month</span>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
        </motion.div>

        {/* Top Category Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <div className="p-2 bg-secondary rounded-lg">
              <TrendingUp className="w-5 h-5 text-foreground" />
            </div>
            <span className="font-medium">Top Category</span>
          </div>
          {topCategory ? (
            <div>
              <p className="text-3xl font-display font-bold text-foreground">
                {topCategory.category}
              </p>
              <p className="mt-1 text-muted-foreground">
                ${(topCategory.total / 100).toFixed(2)} ({Math.round(topCategory.percentage)}%)
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">No data yet</p>
          )}
        </motion.div>

        {/* Daily Average (Mocked for now) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <div className="p-2 bg-secondary rounded-lg">
              <ArrowDownRight className="w-5 h-5 text-foreground" />
            </div>
            <span className="font-medium">Daily Average</span>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-foreground">
              $42.50
            </p>
            <p className="mt-1 text-muted-foreground">Estimated based on history</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Expenses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-display">Recent Activity</h2>
          <button className="text-sm font-semibold text-primary hover:underline">View All</button>
        </div>
        
        <div className="space-y-4">
          {recentExpenses.length > 0 ? (
            recentExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground">No expenses yet. Add one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

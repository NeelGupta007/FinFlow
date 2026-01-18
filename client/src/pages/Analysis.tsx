import { useExpenseAnalysis } from "@/hooks/use-expenses";
import { Layout } from "@/components/Layout";
import { AIInsights } from "@/components/AIInsights";
import { Loader2, PieChart as PieIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'];

export default function Analysis() {
  const { data: analysis, isLoading } = useExpenseAnalysis();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const chartData = analysis?.byCategory.map(c => ({
    name: c.category,
    value: c.total / 100 // Convert to dollars
  })) || [];

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Analysis</h1>
        <p className="text-muted-foreground">Deep dive into your spending habits.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm min-h-[400px]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary rounded-lg">
              <PieIcon className="w-5 h-5 text-foreground" />
            </div>
            <h2 className="text-lg font-bold font-display">Spending by Category</h2>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Breakdown List */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <AIInsights insights={analysis?.aiInsights || []} />

          <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm">
            <h3 className="font-bold text-lg font-display mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {analysis?.byCategory.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="font-medium">{cat.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">${(cat.total / 100).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{Math.round(cat.percentage)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

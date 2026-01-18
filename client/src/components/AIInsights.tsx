import { Sparkles } from "lucide-react";

interface AIInsightsProps {
  insights: string[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-500 text-white rounded-lg shadow-md shadow-indigo-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-lg font-display text-indigo-900 dark:text-indigo-100">
          AI Spending Insights
        </h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex gap-3 bg-white/60 dark:bg-black/20 p-3 rounded-xl backdrop-blur-sm border border-indigo-100/50 dark:border-white/5">
            <span className="text-indigo-500 font-bold">•</span>
            <p className="text-sm text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed">
              {insight}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

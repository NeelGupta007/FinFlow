import { Expense } from "@shared/schema";
import { format } from "date-fns";
import { Coffee, ShoppingBag, Car, Zap, Receipt, Tag } from "lucide-react";
import { clsx } from "clsx";
import { useDeleteExpense } from "@/hooks/use-expenses";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Food: Coffee,
  Shopping: ShoppingBag,
  Transport: Car,
  Entertainment: Zap,
  Bills: Receipt,
  Other: Tag,
};

const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  Shopping: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  Transport: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  Entertainment: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  Bills: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  Other: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export function ExpenseCard({ expense }: { expense: Expense }) {
  const Icon = CATEGORY_ICONS[expense.category] || Tag;
  const colorClass = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;
  
  const deleteExpense = useDeleteExpense();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this expense?")) {
      setIsDeleting(true);
      await deleteExpense.mutateAsync(expense.id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative bg-card p-4 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{expense.description}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{expense.category}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{format(new Date(expense.date), "MMM d")}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right">
          <p className="font-bold font-display text-lg">
            ${(expense.amount / 100).toFixed(2)}
          </p>
          {expense.source === 'ai_parsed' && (
            <span className="text-[10px] uppercase tracking-wider font-bold text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded-md">
              AI
            </span>
          )}
        </div>
      </div>

      {/* Delete Action (visible on hover/group-focus) */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-2 right-2 p-2 rounded-full bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
        aria-label="Delete expense"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}

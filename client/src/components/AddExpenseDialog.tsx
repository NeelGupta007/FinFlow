import { ReactNode, useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { X, Sparkles, Loader2, Calendar as CalendarIcon, DollarSign, Tag, FileText } from "lucide-react";
import { useCreateExpense, useParseExpense } from "@/hooks/use-expenses";
import { clsx } from "clsx";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface AddExpenseDialogProps {
  children: ReactNode;
}

export function AddExpenseDialog({ children }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");
  
  // Form State
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [aiText, setAiText] = useState("");

  const createExpense = useCreateExpense();
  const parseExpense = useParseExpense();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setAmount("");
      setCategory("Food");
      setDescription("");
      setAiText("");
      setActiveTab("manual");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    try {
      await createExpense.mutateAsync({
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        category,
        description,
        date: new Date(date).toISOString(), // Use ISO string for API
        source: activeTab === "ai" ? "ai_parsed" : "manual",
      });
      setOpen(false);
    } catch (err) {
      // Error handled by query client
    }
  };

  const handleParse = async () => {
    if (!aiText) return;
    try {
      const result = await parseExpense.mutateAsync({ text: aiText });
      
      // Populate form with AI results
      if (result.amount) setAmount((result.amount / 100).toFixed(2));
      if (result.category) setCategory(result.category);
      if (result.description) setDescription(result.description);
      if (result.date) setDate(format(new Date(result.date), "yyyy-MM-dd"));
      
      // Switch to manual tab to review
      setActiveTab("manual");
    } catch (err) {
      // Error handled
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-card p-0 shadow-2xl border border-border/50 animate-in zoom-in-95 fade-in slide-in-from-bottom-10 duration-200 focus:outline-none">
          
          <div className="flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-xl font-bold font-display">Add New Expense</Dialog.Title>
            <Dialog.Close className="rounded-full p-2 hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </Dialog.Close>
          </div>

          <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="p-6">
            <Tabs.List className="flex bg-muted rounded-xl p-1 mb-6">
              <Tabs.Trigger 
                value="manual"
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                Manual Entry
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="ai"
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI Magic
              </Tabs.Trigger>
            </Tabs.List>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Tabs.Content value="manual" className="space-y-4 focus:outline-none">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground ml-1">Amount ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <input
                          type="number"
                          step="0.01"
                          required
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all font-mono text-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground ml-1">Description</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          required
                          placeholder="What did you buy?"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Category</label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all appearance-none"
                          >
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Bills">Bills</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Date</label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                          <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={createExpense.isPending}
                        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {createExpense.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Expense"
                        )}
                      </button>
                    </div>
                  </form>
                </Tabs.Content>

                <Tabs.Content value="ai" className="space-y-4 focus:outline-none">
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-lg bg-white shadow-sm text-primary h-fit">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary">AI Auto-Parse</h4>
                        <p className="text-sm text-muted-foreground">Paste any text message, email, or receipt text. Our AI will extract the details.</p>
                      </div>
                    </div>
                  </div>

                  <textarea
                    placeholder="e.g. 'Spent $24.50 on lunch at Chipotle today'"
                    value={aiText}
                    onChange={(e) => setAiText(e.target.value)}
                    className="w-full h-32 p-4 rounded-xl bg-muted/50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all resize-none"
                  />

                  <button
                    onClick={handleParse}
                    disabled={parseExpense.isPending || !aiText}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {parseExpense.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Parse Magic
                      </>
                    )}
                  </button>
                </Tabs.Content>
              </motion.div>
            </AnimatePresence>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

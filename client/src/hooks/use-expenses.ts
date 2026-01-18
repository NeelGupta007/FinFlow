import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { InsertExpense, ParseExpenseRequest } from "@shared/schema";
import { z } from "zod";

// Helper to validate and parse API responses safely
function parseResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error("[Zod] Validation failed:", result.error);
    throw result.error;
  }
  return result.data;
}

// === QUERIES ===

// GET /api/expenses
export function useExpenses() {
  return useQuery({
    queryKey: [api.expenses.list.path],
    queryFn: async () => {
      const res = await fetch(api.expenses.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const data = await res.json();
      return api.expenses.list.responses[200].parse(data);
    },
  });
}

// GET /api/expenses/:id
export function useExpense(id: number) {
  return useQuery({
    queryKey: [api.expenses.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.expenses.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch expense");
      const data = await res.json();
      return api.expenses.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

// GET /api/expenses/analysis
export function useExpenseAnalysis() {
  return useQuery({
    queryKey: [api.expenses.analysis.path],
    queryFn: async () => {
      const res = await fetch(api.expenses.analysis.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch analysis");
      const data = await res.json();
      return api.expenses.analysis.responses[200].parse(data);
    },
  });
}

// === MUTATIONS ===

// POST /api/expenses
export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertExpense) => {
      // Coerce data types before sending if necessary (though zod schema usually handles this)
      const res = await fetch(api.expenses.create.path, {
        method: api.expenses.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create expense");
      }
      return api.expenses.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.expenses.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.expenses.analysis.path] });
    },
  });
}

// PUT /api/expenses/:id
export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertExpense>) => {
      const url = buildUrl(api.expenses.update.path, { id });
      const res = await fetch(url, {
        method: api.expenses.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update expense");
      return api.expenses.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.expenses.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.expenses.analysis.path] });
    },
  });
}

// DELETE /api/expenses/:id
export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.expenses.delete.path, { id });
      const res = await fetch(url, { 
        method: api.expenses.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete expense");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.expenses.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.expenses.analysis.path] });
    },
  });
}

// POST /api/expenses/parse (AI Feature)
export function useParseExpense() {
  return useMutation({
    mutationFn: async (data: ParseExpenseRequest) => {
      const res = await fetch(api.expenses.parse.path, {
        method: api.expenses.parse.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to parse expense text");
      const json = await res.json();
      return api.expenses.parse.responses[200].parse(json);
    },
  });
}

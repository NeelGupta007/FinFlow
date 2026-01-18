import { expenses, type Expense, type InsertExpense, type CategoryAnalysis, users, type User } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";
import { authStorage } from "./replit_integrations/auth/storage"; // Import auth storage

export interface IStorage {
  // Expense Operations
  getExpenses(userId: string): Promise<Expense[]>;
  getExpense(id: number): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense & { userId: string }): Promise<Expense>;
  updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense>;
  deleteExpense(id: number): Promise<void>;
  
  // Analysis Operations
  getCategoryAnalysis(userId: string): Promise<CategoryAnalysis[]>;
  getTotalSpend(userId: string): Promise<number>;

  // User Operations (delegated/shared)
  getUser(id: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getExpenses(userId: string): Promise<Expense[]> {
    return await db.select()
      .from(expenses)
      .where(eq(expenses.userId, userId))
      .orderBy(desc(expenses.date));
  }

  async getExpense(id: number): Promise<Expense | undefined> {
    const [expense] = await db.select().from(expenses).where(eq(expenses.id, id));
    return expense;
  }

  async createExpense(insertExpense: InsertExpense & { userId: string }): Promise<Expense> {
    const [expense] = await db
      .insert(expenses)
      .values(insertExpense)
      .returning();
    return expense;
  }

  async updateExpense(id: number, updates: Partial<InsertExpense>): Promise<Expense> {
    const [expense] = await db
      .update(expenses)
      .set(updates)
      .where(eq(expenses.id, id))
      .returning();
    return expense;
  }

  async deleteExpense(id: number): Promise<void> {
    await db.delete(expenses).where(eq(expenses.id, id));
  }

  async getCategoryAnalysis(userId: string): Promise<CategoryAnalysis[]> {
    // Basic aggregation
    // Note: amount is in cents
    const result = await db.select({
        category: expenses.category,
        total: sql<number>`sum(${expenses.amount})`.mapWith(Number),
      })
      .from(expenses)
      .where(eq(expenses.userId, userId))
      .groupBy(expenses.category);

    const totalSpend = await this.getTotalSpend(userId);
    
    return result.map(row => ({
      category: row.category,
      total: row.total,
      percentage: totalSpend > 0 ? (row.total / totalSpend) * 100 : 0
    }));
  }

  async getTotalSpend(userId: string): Promise<number> {
    const [result] = await db.select({
      total: sql<number>`sum(${expenses.amount})`.mapWith(Number)
    })
    .from(expenses)
    .where(eq(expenses.userId, userId));
    
    return result?.total || 0;
  }

  // Delegate to auth storage
  async getUser(id: string): Promise<User | undefined> {
    return authStorage.getUser(id);
  }
}

export const storage = new DatabaseStorage();

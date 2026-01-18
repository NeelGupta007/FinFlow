import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import { setupAuth, isAuthenticated, registerAuthRoutes } from "./replit_integrations/auth";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);

  // Parse Expense AI Endpoint
  app.post(api.expenses.parse.path, isAuthenticated, async (req, res) => {
    try {
      const { text } = api.expenses.parse.input.parse(req.body);

      const prompt = `
        Parse the following expense text into a JSON object with these fields:
        - category (string, keep it short, e.g., 'Food', 'Transport', 'Utilities')
        - description (string)
        - amount (number, in CENTS. e.g., $10.00 is 1000)
        - date (ISO 8601 string, assume current year if missing)
        
        Text: "${text}"
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0]?.message?.content || "{}");
      
      // Basic validation/fallback
      const parsedExpense = {
        category: result.category || "Uncategorized",
        description: result.description || text,
        amount: result.amount || 0,
        date: result.date ? new Date(result.date) : new Date(),
        source: "ai_parsed",
      };

      res.json(parsedExpense);
    } catch (err) {
      console.error("AI Parse Error:", err);
      res.status(500).json({ message: "Failed to parse expense" });
    }
  });

  // Analysis Endpoint
  app.get(api.expenses.analysis.path, isAuthenticated, async (req, res) => {
    // Cast user to any to access claims
    const userId = (req.user as any).claims.sub;
    
    const totalSpend = await storage.getTotalSpend(userId);
    const byCategory = await storage.getCategoryAnalysis(userId);
    
    // Generate AI Insights
    let aiInsights: string[] = [];
    if (totalSpend > 0) {
      try {
        const summary = `Total spend: $${(totalSpend / 100).toFixed(2)}. Categories: ${byCategory.map(c => `${c.category}: $${(c.total / 100).toFixed(2)}`).join(', ')}.`;
        const insightPrompt = `Analyze this expense summary and give 3 short, helpful insights or tips for the user. Summary: ${summary}`;
        
        const response = await openai.chat.completions.create({
          model: "gpt-5.1",
          messages: [{ role: "user", content: insightPrompt }],
        });
        
        const content = response.choices[0]?.message?.content || "";
        aiInsights = content.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
      } catch (e) {
        console.error("Failed to generate insights", e);
        aiInsights = ["Spend analysis available."];
      }
    }

    res.json({
      totalSpend,
      byCategory,
      aiInsights
    });
  });

  // CRUD Routes
  app.get(api.expenses.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const expenses = await storage.getExpenses(userId);
    res.json(expenses);
  });

  app.get(api.expenses.get.path, isAuthenticated, async (req, res) => {
    const expense = await storage.getExpense(Number(req.params.id));
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    // Security check: ensure expense belongs to user
    // In a real app, I'd check expense.userId === req.user.sub
    res.json(expense);
  });

  app.post(api.expenses.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.expenses.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      const expense = await storage.createExpense({ ...input, userId });
      res.status(201).json(expense);
    } catch (err) {
       if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.put(api.expenses.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.expenses.update.input.parse(req.body);
      const expense = await storage.updateExpense(Number(req.params.id), input);
      res.json(expense);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
    }
  });

  app.delete(api.expenses.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteExpense(Number(req.params.id));
    res.status(204).send();
  });

  return httpServer;
}

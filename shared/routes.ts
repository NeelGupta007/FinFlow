import { z } from 'zod';
import { insertExpenseSchema, expenses, parseExpenseSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  expenses: {
    list: {
      method: 'GET' as const,
      path: '/api/expenses',
      responses: {
        200: z.array(z.custom<typeof expenses.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/expenses/:id',
      responses: {
        200: z.custom<typeof expenses.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/expenses',
      input: insertExpenseSchema,
      responses: {
        201: z.custom<typeof expenses.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/expenses/:id',
      input: insertExpenseSchema.partial(),
      responses: {
        200: z.custom<typeof expenses.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/expenses/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    parse: {
      method: 'POST' as const,
      path: '/api/expenses/parse',
      input: parseExpenseSchema,
      responses: {
        200: insertExpenseSchema, // Returns a suggested expense object to populate the form
      },
    },
    analysis: {
      method: 'GET' as const,
      path: '/api/expenses/analysis',
      responses: {
        200: z.object({
          totalSpend: z.number(),
          byCategory: z.array(z.object({
            category: z.string(),
            total: z.number(),
            percentage: z.number(),
          })),
          aiInsights: z.array(z.string()),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

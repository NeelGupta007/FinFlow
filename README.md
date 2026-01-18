# SmartSpend - AI-Powered Expense Tracker

## Overview

SmartSpend is a personal finance management application that helps users track and analyze their spending habits. The core feature is AI-powered expense parsing - users can paste receipt text or expense descriptions, and the app uses OpenAI to automatically categorize and extract expense details. The application includes a dashboard for viewing recent expenses, category-based spending analysis with charts, and Replit Auth for user authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and UI animations
- **Charts**: Recharts for spending visualizations (pie charts, trends)
- **Build Tool**: Vite with hot module replacement

The frontend follows a mobile-first design pattern with bottom navigation on small screens and a sidebar on desktop. All expenses are stored in cents and formatted for display using utility functions.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for validation
- **Database ORM**: Drizzle ORM with PostgreSQL
- **AI Integration**: OpenAI API via Replit AI Integrations for expense parsing
- **Session Management**: express-session with connect-pg-simple for PostgreSQL-backed sessions

### Authentication
- **Method**: Replit Auth (OpenID Connect)
- Uses Passport.js with custom Replit OIDC strategy
- Sessions stored in PostgreSQL `sessions` table
- User data stored in `users` table with automatic upsert on login

### Database Schema
- **users**: User profiles (id, email, name, profile image)
- **sessions**: Authentication sessions for Replit Auth
- **expenses**: User expenses (amount in cents, category, description, date, source)
- **conversations/messages**: Chat storage for AI conversations (available but not primary feature)

### Key API Endpoints
- `POST /api/expenses/parse` - AI-powered expense text parsing
- `GET/POST/PUT/DELETE /api/expenses` - CRUD operations for expenses
- `GET /api/expenses/analysis` - Category breakdown and spending totals
- `GET /api/auth/user` - Current authenticated user

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components (Layout, ExpenseCard, AddExpenseDialog)
    pages/        # Route pages (Dashboard, Analysis, Landing)
    hooks/        # Custom hooks (use-auth, use-expenses)
server/           # Express backend
  replit_integrations/  # Auth, chat, audio, image utilities
shared/           # Shared types, schemas, route definitions
  models/         # Database model definitions
  schema.ts       # Drizzle schema exports
  routes.ts       # API route contracts with Zod
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- Managed through Drizzle ORM with migrations in `/migrations`

### AI Services
- **OpenAI API**: Used for expense text parsing via Replit AI Integrations
- Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
- Model: gpt-5.1 with JSON response format

### Authentication
- **Replit Auth**: OpenID Connect authentication
- Environment variables: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`

### Third-Party Libraries
- `date-fns`: Date formatting and manipulation
- `recharts`: Chart visualizations
- `framer-motion`: Animations
- `zod`: Schema validation for API contracts
- `drizzle-zod`: Automatic Zod schema generation from Drizzle models

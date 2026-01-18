import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, PieChart, Plus, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { clsx } from "clsx";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Home" },
    { href: "/analysis", icon: PieChart, label: "Analysis" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 border-r bg-card z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            SmartSpend
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={clsx("w-5 h-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.firstName?.[0] || <User className="w-5 h-5" />}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.firstName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-50 px-6 py-2 pb-safe">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={clsx("w-6 h-6", isActive && "fill-current/20")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          {/* FAB for Mobile */}
          <div className="relative -top-6">
            <AddExpenseDialog>
              <button className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                <Plus className="w-8 h-8" />
              </button>
            </AddExpenseDialog>
          </div>
          
          <button 
            onClick={() => logout()}
            className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Desktop Add Button (Fixed Bottom Right) */}
      <div className="hidden md:block fixed bottom-8 right-8 z-50">
        <AddExpenseDialog>
          <button className="flex items-center gap-2 h-14 px-6 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all font-semibold">
            <Plus className="w-6 h-6" />
            Add Expense
          </button>
        </AddExpenseDialog>
      </div>
    </div>
  );
}

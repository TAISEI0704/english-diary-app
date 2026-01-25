import { Calendar, BookOpen, type LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";
import type { ViewType } from "../types/diary";

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const navItems: Array<{ view: ViewType; label: string; icon: LucideIcon }> = [
    { view: "calendar", label: "カレンダー", icon: Calendar },
    { view: "knowledge", label: "ナレッジ", icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map(({ view, label, icon: Icon }) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={cn(
              "flex flex-col items-center justify-center py-3 px-6 transition-colors",
              currentView === view || (currentView === "diary" && view === "calendar")
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

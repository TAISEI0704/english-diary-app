import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { cn } from "../lib/utils";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export function CalendarView({
  currentDate,
  completedDates,
  streak,
  monthlyCount,
  onDateSelect,
  onMonthChange,
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const goToPrevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const formatDateStr = (day) => {
    return `\${year}-\${String(month + 1).padStart(2, "0")}-\${String(day).padStart(2, "0")}`;
  };

  const isToday = (day) => formatDateStr(day) === todayStr;

  const isFuture = (day) => {
    const dateStr = formatDateStr(day);
    return dateStr > todayStr;
  };

  const isCompleted = (day) => completedDates.has(formatDateStr(day));

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Stats */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Flame className="h-4 w-4 text-accent" />
          <span className="text-sm">{streak}日連続</span>
        </div>
        <div className="text-sm text-muted-foreground">
          今月 <span className="font-medium text-foreground">{monthlyCount}</span> 日完了
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevMonth}
          className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-medium">
          {year}年 {month + 1}月
        </h2>
        <button
          onClick={goToNextMonth}
          className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={cn(
              "text-center text-xs font-medium py-2",
              i === 0 && "text-destructive/70",
              i === 6 && "text-accent/70"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-\${index}`} className="aspect-square" />;
          }

          const dateStr = formatDateStr(day);
          const completed = isCompleted(day);
          const todayDate = isToday(day);
          const future = isFuture(day);
          const dayOfWeek = (startOffset + day - 1) % 7;

          return (
            <button
              key={dateStr}
              onClick={() => !future && onDateSelect(dateStr)}
              disabled={future}
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center text-sm transition-all relative",
                "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                future && "opacity-30 cursor-not-allowed hover:bg-transparent",
                todayDate && "ring-2 ring-accent ring-offset-1",
                completed && "bg-accent/15",
                dayOfWeek === 0 && "text-destructive/80",
                dayOfWeek === 6 && "text-accent/80"
              )}
            >
              <span className={cn(todayDate && "font-semibold")}>{day}</span>
              {completed && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {/* Today Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            onMonthChange(today);
            onDateSelect(todayStr);
          }}
          className="inline-flex items-center justify-center rounded-md text-xs h-9 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          今日の日記を書く
        </button>
      </div>
    </div>
  );
}

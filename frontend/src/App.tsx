import { useState, useCallback, useMemo } from "react";
import { CalendarView } from "./components/calendar-view";
import { DiaryEditor } from "./components/diary-editor";
import { KnowledgeView } from "./components/knowledge-view";
import { BottomNav } from "./components/bottom-nav";
import {
  getEntries,
  getEntryByDate,
  saveEntry,
  deleteEntry,
  getCompletedDates,
  getStreak,
  getMonthlyCount,
  extractWords,
} from "./lib/diary-store";
import type { ViewType, DateString } from "./types/diary";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("calendar");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<DateString | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const entries = useMemo(() => getEntries(), [refreshKey]);
  const completedDates = useMemo(() => getCompletedDates(), [refreshKey]);
  const streak = useMemo(() => getStreak(), [refreshKey]);
  const monthlyCount = useMemo(
    () => getMonthlyCount(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth, refreshKey]
  );
  const words = useMemo(() => extractWords(), [refreshKey]);
  const selectedEntry = useMemo(
    () => (selectedDate ? getEntryByDate(selectedDate) : undefined),
    [selectedDate, refreshKey]
  );

  const handleDateSelect = useCallback((date: DateString): void => {
    setSelectedDate(date);
    setCurrentView("diary");
  }, []);

  const handleMonthChange = useCallback((date: Date): void => {
    setCurrentMonth(date);
  }, []);

  const handleSave = useCallback(
    (content: string, englishPhrase: string): void => {
      if (selectedDate) {
        saveEntry({ date: selectedDate, content, englishPhrase });
        setRefreshKey((k) => k + 1);
        setCurrentView("calendar");
      }
    },
    [selectedDate]
  );

  const handleDelete = useCallback((): void => {
    if (selectedDate) {
      deleteEntry(selectedDate);
      setRefreshKey((k) => k + 1);
      setCurrentView("calendar");
    }
  }, [selectedDate]);

  const handleBack = useCallback((): void => {
    setCurrentView("calendar");
    setSelectedDate(null);
  }, []);

  const handleViewChange = useCallback((view: ViewType): void => {
    setCurrentView(view);
    if (view !== "diary") {
      setSelectedDate(null);
    }
  }, []);

  const handlePhraseClick = useCallback((date: DateString): void => {
    setSelectedDate(date);
    setCurrentView("diary");
  }, []);

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border/30 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-base font-medium text-center tracking-wide">Daily English Journal</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6">
        {currentView === "calendar" && (
          <CalendarView
            currentDate={currentMonth}
            completedDates={completedDates}
            streak={streak}
            monthlyCount={monthlyCount}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
          />
        )}

        {currentView === "diary" && selectedDate && (
          <DiaryEditor
            date={selectedDate}
            existingEntry={selectedEntry}
            onSave={handleSave}
            onDelete={handleDelete}
            onBack={handleBack}
          />
        )}

        {currentView === "knowledge" && (
          <KnowledgeView
            entries={entries}
            words={words}
            onPhraseClick={handlePhraseClick}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} onViewChange={handleViewChange} />
    </main>
  );
}

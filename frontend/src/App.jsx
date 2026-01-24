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

export default function App() {
  const [currentView, setCurrentView] = useState("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const entries = useMemo(() => getEntries(), [refreshKey]);
  const completedDates = useMemo(() => getCompletedDates(), [refreshKey]);
  const streak = useMemo(() => getStreak(), [refreshKey]);
  const monthlyCount = useMemo(
    () => getMonthlyCount(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth, refreshKey]
  );
  const words = useMemo(() => extractWords([]), [refreshKey]);
  const selectedEntry = useMemo(
    () => (selectedDate ? getEntryByDate(selectedDate) : undefined),
    [selectedDate, refreshKey]
  );

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
    setCurrentView("diary");
  }, []);

  const handleMonthChange = useCallback((date) => {
    setCurrentMonth(date);
  }, []);

  const handleSave = useCallback(
    (content, englishPhrase) => {
      if (selectedDate) {
        saveEntry({ date: selectedDate, content, englishPhrase });
        setRefreshKey((k) => k + 1);
        setCurrentView("calendar");
      }
    },
    [selectedDate]
  );

  const handleDelete = useCallback(() => {
    if (selectedDate) {
      deleteEntry(selectedDate);
      setRefreshKey((k) => k + 1);
      setCurrentView("calendar");
    }
  }, [selectedDate]);

  const handleBack = useCallback(() => {
    setCurrentView("calendar");
    setSelectedDate(null);
  }, []);

  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
    if (view !== "diary") {
      setSelectedDate(null);
    }
  }, []);

  const handlePhraseClick = useCallback((date) => {
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

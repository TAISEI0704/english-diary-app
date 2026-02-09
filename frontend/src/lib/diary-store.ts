import type { DiaryEntry, DiaryEntryInput, WordData, DateString } from "../types/diary";

// Sample data for demonstration
const sampleEntries: DiaryEntry[] = [
  {
    id: "1",
    date: "2026-01-20",
    content: "今日は朝から雨だった。カフェで本を読んで過ごした。静かな時間が心地よかった。",
    englishPhrase: "The rain reminded me of the importance of slowing down.",
    createdAt: new Date("2026-01-20"),
    updatedAt: new Date("2026-01-20"),
  },
  {
    id: "2",
    date: "2026-01-21",
    content: "新しいプロジェクトが始まった。チームメンバーとのミーティングで良いアイデアが出た。",
    englishPhrase: "Collaboration brings out the best ideas.",
    createdAt: new Date("2026-01-21"),
    updatedAt: new Date("2026-01-21"),
  },
  {
    id: "3",
    date: "2026-01-22",
    content: "久しぶりに友人と会った。変わらない笑顔に安心した。",
    englishPhrase: "True friendship stands the test of time.",
    createdAt: new Date("2026-01-22"),
    updatedAt: new Date("2026-01-22"),
  },
  {
    id: "4",
    date: "2026-01-23",
    content: "英語の勉強を少しずつ続けている。毎日の積み重ねが大切だと感じる。",
    englishPhrase: "Small steps lead to great achievements.",
    createdAt: new Date("2026-01-23"),
    updatedAt: new Date("2026-01-23"),
  },
];

let entries: DiaryEntry[] = [...sampleEntries];

export function getEntries(): DiaryEntry[] {
  return entries;
}

export function getEntryByDate(date: DateString): DiaryEntry | undefined {
  return entries.find((e) => e.date === date);
}

export function saveEntry(entry: DiaryEntryInput): DiaryEntry {
  const existing = entries.find((e) => e.date === entry.date);
  if (existing) {
    const updated: DiaryEntry = {
      ...existing,
      ...entry,
      updatedAt: new Date(),
    };
    entries = entries.map((e) => (e.id === existing.id ? updated : e));
    return updated;
  }
  const newEntry: DiaryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  entries = [...entries, newEntry];
  return newEntry;
}

export function deleteEntry(date: DateString): void {
  entries = entries.filter((e) => e.date !== date);
}

export function getCompletedDates(): Set<DateString> {
  return new Set(entries.map((e) => e.date));
}

export function getStreak(): number {
  const today = new Date();
  const sortedDates = entries
    .map((e) => e.date)
    .sort()
    .reverse();

  if (sortedDates.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().split("T")[0] as DateString;
    if (sortedDates.includes(dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

export function getMonthlyCount(year: number, month: number): number {
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
  return entries.filter((e) => e.date.startsWith(monthStr)).length;
}

export function extractWords(): WordData[] {
  const wordMap = new Map<string, Omit<WordData, 'word'>>();

  entries.forEach((entry) => {
    const words = entry.englishPhrase
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2);

    words.forEach((word) => {
      const existing = wordMap.get(word);
      if (existing) {
        existing.count++;
        if (!existing.examples.find((ex) => ex.date === entry.date)) {
          existing.examples.push({ phrase: entry.englishPhrase, date: entry.date });
        }
      } else {
        wordMap.set(word, {
          count: 1,
          examples: [{ phrase: entry.englishPhrase, date: entry.date }],
        });
      }
    });
  });

  return Array.from(wordMap.entries())
    .map(([word, data]) => ({ word, ...data }))
    .sort((a, b) => b.count - a.count);
}

export function searchPhrases(query: string): DiaryEntry[] {
  if (!query.trim()) return entries;
  const lowerQuery = query.toLowerCase();
  return entries.filter((e) => e.englishPhrase.toLowerCase().includes(lowerQuery));
}

export function searchWords(query: string): WordData[] {
  const words = extractWords();
  if (!query.trim()) return words;
  const lowerQuery = query.toLowerCase();
  return words.filter((w) => w.word.includes(lowerQuery));
}

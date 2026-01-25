import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { cn } from "../lib/utils";
import type { DiaryEntry, WordData, DateString } from "../types/diary";

type TabType = 'phrases' | 'words';

interface KnowledgeViewProps {
  entries: DiaryEntry[];
  words: WordData[];
  onPhraseClick: (date: DateString) => void;
}

export function KnowledgeView({ entries, words, onPhraseClick }: KnowledgeViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("phrases");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);

  const filteredPhrases = entries.filter((e) =>
    e.englishPhrase.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWords = words.filter((w) =>
    w.word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: DateString): string => {
    const [, month, day] = dateStr.split("-");
    return `${parseInt(month)}/${parseInt(day)}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-1">ナレッジ</h2>
        <p className="text-sm text-muted-foreground">あなたが書いた英語の蓄積</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6">
        <button
          onClick={() => {
            setActiveTab("phrases");
            setSelectedWord(null);
            setSearchQuery("");
          }}
          className={cn(
            "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors",
            activeTab === "phrases"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          フレーズ一覧
        </button>
        <button
          onClick={() => {
            setActiveTab("words");
            setSelectedWord(null);
            setSearchQuery("");
          }}
          className={cn(
            "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors",
            activeTab === "words"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          単語帳
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={activeTab === "phrases" ? "フレーズを検索..." : "単語を検索..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 h-10 rounded-md border border-border/50 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>

      {/* Content */}
      {activeTab === "phrases" ? (
        <div className="space-y-3">
          {filteredPhrases.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">まだフレーズがありません</p>
              <p className="text-xs mt-1">日記を書いて英語フレーズを蓄積しましょう</p>
            </div>
          ) : (
            filteredPhrases.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onPhraseClick(entry.date)}
                className="w-full text-left p-4 bg-card rounded-lg border border-border/50 hover:border-accent/50 transition-colors group"
              >
                <p className="text-sm font-mono leading-relaxed">{entry.englishPhrase}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))
          )}
        </div>
      ) : selectedWord ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedWord(null)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← 単語一覧に戻る
          </button>

          <div className="p-4 bg-card rounded-lg border border-border/50">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-xl font-mono font-medium">{selectedWord.word}</h3>
              <span className="text-sm text-muted-foreground">{selectedWord.count}回使用</span>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                あなたの例文
              </p>
              {selectedWord.examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => onPhraseClick(example.date)}
                  className="w-full text-left p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors group"
                >
                  <p className="text-sm font-mono leading-relaxed">{example.phrase}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{formatDate(example.date)}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredWords.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">まだ単語がありません</p>
              <p className="text-xs mt-1">英語フレーズを書くと、単語が自動で抽出されます</p>
            </div>
          ) : (
            filteredWords.map((word) => (
              <button
                key={word.word}
                onClick={() => setSelectedWord(word)}
                className="w-full flex items-center justify-between p-3 bg-card rounded-lg border border-border/50 hover:border-accent/50 transition-colors"
              >
                <span className="font-mono text-sm">{word.word}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {word.count}回
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

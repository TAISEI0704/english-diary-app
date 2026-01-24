import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";

export function DiaryEditor({ date, existingEntry, onSave, onDelete, onBack }) {
  const [content, setContent] = useState(existingEntry?.content || "");
  const [englishPhrase, setEnglishPhrase] = useState(existingEntry?.englishPhrase || "");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setContent(existingEntry?.content || "");
    setEnglishPhrase(existingEntry?.englishPhrase || "");
    setHasChanges(false);
  }, [existingEntry, date]);

  const handleContentChange = (value) => {
    setContent(value);
    setHasChanges(true);
  };

  const handlePhraseChange = (value) => {
    setEnglishPhrase(value);
    setHasChanges(true);
  };

  const handleSave = useCallback(() => {
    if (content.trim() || englishPhrase.trim()) {
      onSave(content, englishPhrase);
      setHasChanges(false);
    }
  }, [content, englishPhrase, onSave]);

  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm("変更が保存されていません。破棄してもよろしいですか？")) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  const handleDelete = () => {
    if (window.confirm("この日記を削除しますか？この操作は取り消せません。")) {
      onDelete();
    }
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    return `\${year}年\${parseInt(month)}月\${parseInt(day)}日（\${weekdays[d.getDay()]}）`;
  };

  const canSave = content.trim() || englishPhrase.trim();

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-base font-medium">{formatDate(date)}</h2>
        <div className="w-8" />
      </div>

      {/* Diary Content */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="diary-content" className="text-sm font-medium text-muted-foreground">
            今日の日記
          </label>
          <textarea
            id="diary-content"
            placeholder="今日あったこと、感じたこと..."
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="min-h-[140px] w-full rounded-md border border-border/50 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-accent resize-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="english-phrase" className="text-sm font-medium text-muted-foreground">
            今日の英語フレーズ
          </label>
          <textarea
            id="english-phrase"
            placeholder="Write one English phrase..."
            value={englishPhrase}
            onChange={(e) => handlePhraseChange(e.target.value)}
            className="min-h-[80px] w-full rounded-md border border-border/50 bg-card px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-accent resize-none"
          />
          <p className="text-xs text-muted-foreground/70">
            日記の内容に関連した英語を1つ書いてみましょう
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
        {existingEntry ? (
          <button
            onClick={handleDelete}
            className="inline-flex items-center justify-center rounded-md text-sm h-9 px-3 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            削除
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleSave}
          disabled={!canSave}
          className="inline-flex items-center justify-center rounded-md text-sm h-10 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          保存する
        </button>
      </div>
    </div>
  );
}

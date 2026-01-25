export type DateString = string

export interface DiaryEntry {
  id: string
  date: DateString
  content: string
  englishPhrase: string
  createdAt: Date
  updatedAt: Date
}

export interface DiaryEntryInput {
  date: DateString
  content: string
  englishPhrase: string
}

export interface WordData {
  word: string
  count: number
  examples: Array<{
    phrase: string
    date: DateString
  }>
}

export type ViewType = 'calendar' | 'diary' | 'knowledge'

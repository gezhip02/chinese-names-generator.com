

export type Gender = 'random' | 'male' | 'female';

export interface NameMeaning {
  zh: string;
  en: string;
  fil: string;
  hi: string;
}

export interface GeneratedName {
  pinyin: string;
  characters: string;
  meaning: string;
}

export interface ApiResponse {
  error?: string;
  data?: GeneratedName[];
}

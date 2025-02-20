export type Gender = 'random' | 'male' | 'female';

export interface GeneratedName {
  pinyin: string;
  characters: string;
  meaning: string;
}

export interface ApiResponse {
  data: GeneratedName;
  error?: string;
}
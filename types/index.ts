export type Gender = 'random' | 'male' | 'female';

export interface GeneratedName {
  pinyin: string;
  characters: string;
  meaning: string;
}

// 需要添加的请求参数接口
export interface NameGenerationRequest {
  gender: Gender;
  surname?: string;
  englishName?: string;
  keywords?: string;
  includeSurname?: boolean;
}

// 如果有API响应类型定义，也可以更新
export interface ApiResponse {
  error?: string;
  data?: GeneratedName[];
}
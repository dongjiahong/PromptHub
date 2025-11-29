/**
 * 设置类型定义
 */

export interface Settings {
  theme: Theme;
  language: Language;
  autoSave: boolean;
  defaultFolderId?: string;
}

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'zh';

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  language: 'zh',
  autoSave: true,
};

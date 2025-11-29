import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';

// 获取系统语言
const getSystemLanguage = (): string => {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  return 'en';
};

// 获取保存的语言设置 (从 zustand persist store 读取)
const getSavedLanguage = (): string | null => {
  try {
    const stored = localStorage.getItem('prompthub-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.language || null;
    }
    return null;
  } catch {
    return null;
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    lng: getSavedLanguage() || getSystemLanguage(),
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
  });

// 切换语言
export const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
};

export default i18n;

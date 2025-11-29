import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { changeLanguage } from '../i18n';

// 主题色 - 莫兰迪色系 + 经典宝蓝
export const MORANDI_THEMES = [
  { id: 'royal-blue', hue: 220, saturation: 70, name: '宝蓝' },
  { id: 'blue', hue: 210, saturation: 35, name: '雾蓝' },
  { id: 'purple', hue: 260, saturation: 30, name: '烟紫' },
  { id: 'green', hue: 150, saturation: 30, name: '豆绿' },
  { id: 'orange', hue: 25, saturation: 40, name: '杏橘' },
  { id: 'teal', hue: 175, saturation: 30, name: '青黛' },
];

export const FONT_SIZES = [
  { id: 'small', value: 14, name: '小' },
  { id: 'medium', value: 16, name: '中' },
  { id: 'large', value: 18, name: '大' },
];

// 主题模式
export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  // 显示设置
  themeMode: ThemeMode;
  isDarkMode: boolean;
  themeColor: string;
  themeHue: number;
  themeSaturation: number;
  fontSize: string;
  
  // 常规设置
  autoSave: boolean;
  showLineNumbers: boolean;
  launchAtStartup: boolean;
  minimizeOnLaunch: boolean;
  
  // 通知设置
  enableNotifications: boolean;
  showCopyNotification: boolean;
  showSaveNotification: boolean;
  
  // 隐私设置
  sendAnalytics: boolean;
  sendCrashReports: boolean;
  
  // 语言设置
  language: 'zh' | 'en';
  
  // 数据路径
  dataPath: string;
  
  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  setDarkMode: (isDark: boolean) => void;
  setThemeColor: (colorId: string) => void;
  setFontSize: (size: string) => void;
  setAutoSave: (enabled: boolean) => void;
  setShowLineNumbers: (enabled: boolean) => void;
  setLaunchAtStartup: (enabled: boolean) => void;
  setMinimizeOnLaunch: (enabled: boolean) => void;
  setEnableNotifications: (enabled: boolean) => void;
  setShowCopyNotification: (enabled: boolean) => void;
  setShowSaveNotification: (enabled: boolean) => void;
  setSendAnalytics: (enabled: boolean) => void;
  setSendCrashReports: (enabled: boolean) => void;
  setLanguage: (lang: 'zh' | 'en') => void;
  setDataPath: (path: string) => void;
  applyTheme: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // 默认值
      themeMode: 'system' as ThemeMode,
      isDarkMode: true,
      themeColor: 'royal-blue',
      themeHue: 220,
      themeSaturation: 70,
      fontSize: 'medium',
      autoSave: true,
      showLineNumbers: false,
      launchAtStartup: false,
      minimizeOnLaunch: false,
      enableNotifications: true,
      showCopyNotification: true,
      showSaveNotification: true,
      sendAnalytics: false,
      sendCrashReports: false,
      language: 'zh',
      dataPath: '~/Library/Application Support/PromptHub',
      
      setThemeMode: (mode) => {
        set({ themeMode: mode });
        if (mode === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set({ isDarkMode: prefersDark });
          document.documentElement.classList.toggle('dark', prefersDark);
        } else {
          const isDark = mode === 'dark';
          set({ isDarkMode: isDark });
          document.documentElement.classList.toggle('dark', isDark);
        }
      },
      
      setDarkMode: (isDark) => {
        set({ isDarkMode: isDark, themeMode: isDark ? 'dark' : 'light' });
        document.documentElement.classList.toggle('dark', isDark);
      },
      
      setThemeColor: (colorId) => {
        const theme = MORANDI_THEMES.find(t => t.id === colorId);
        if (theme) {
          set({ 
            themeColor: colorId, 
            themeHue: theme.hue,
            themeSaturation: theme.saturation 
          });
          document.documentElement.style.setProperty('--theme-hue', String(theme.hue));
          document.documentElement.style.setProperty('--theme-saturation', String(theme.saturation));
        }
      },
      
      setFontSize: (size) => {
        set({ fontSize: size });
        const fontConfig = FONT_SIZES.find(f => f.id === size);
        if (fontConfig) {
          document.documentElement.style.setProperty('--base-font-size', `${fontConfig.value}px`);
        }
      },
      
      setAutoSave: (enabled) => set({ autoSave: enabled }),
      setShowLineNumbers: (enabled) => set({ showLineNumbers: enabled }),
      setLaunchAtStartup: (enabled) => set({ launchAtStartup: enabled }),
      setMinimizeOnLaunch: (enabled) => set({ minimizeOnLaunch: enabled }),
      setEnableNotifications: (enabled) => set({ enableNotifications: enabled }),
      setShowCopyNotification: (enabled) => set({ showCopyNotification: enabled }),
      setShowSaveNotification: (enabled) => set({ showSaveNotification: enabled }),
      setSendAnalytics: (enabled) => set({ sendAnalytics: enabled }),
      setSendCrashReports: (enabled) => set({ sendCrashReports: enabled }),
      setLanguage: (lang) => {
        set({ language: lang });
        changeLanguage(lang);
      },
      setDataPath: (path) => set({ dataPath: path }),
      
      applyTheme: () => {
        const state = get();
        // 处理主题模式
        let isDark = state.isDarkMode;
        if (state.themeMode === 'system') {
          isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
          isDark = state.themeMode === 'dark';
        }
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.style.setProperty('--theme-hue', String(state.themeHue));
        document.documentElement.style.setProperty('--theme-saturation', String(state.themeSaturation));
        const fontConfig = FONT_SIZES.find(f => f.id === state.fontSize);
        if (fontConfig) {
          document.documentElement.style.setProperty('--base-font-size', `${fontConfig.value}px`);
        }
      },
    }),
    {
      name: 'prompthub-settings',
    }
  )
);

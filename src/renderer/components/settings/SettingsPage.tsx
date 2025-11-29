import { useState } from 'react';
import {
  SettingsIcon,
  PaletteIcon,
  DatabaseIcon,
  KeyboardIcon,
  InfoIcon,
  GlobeIcon,
  BellIcon,
  ShieldIcon,
  ArrowLeftIcon,
  CheckIcon,
  FolderIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { downloadBackup, restoreFromFile, clearDatabase } from '../../services/database';
import { useSettingsStore, MORANDI_THEMES, FONT_SIZES, ThemeMode } from '../../stores/settings.store';
import { useToast } from '../ui/Toast';

interface SettingsPageProps {
  onBack: () => void;
}

// 设置菜单项
const SETTINGS_MENU = [
  { id: 'general', label: '常规设置', icon: SettingsIcon },
  { id: 'appearance', label: '显示设置', icon: PaletteIcon },
  { id: 'data', label: '数据设置', icon: DatabaseIcon },
  { id: 'shortcuts', label: '快捷键', icon: KeyboardIcon },
  { id: 'language', label: '语言', icon: GlobeIcon },
  { id: 'notifications', label: '通知', icon: BellIcon },
  { id: 'privacy', label: '隐私', icon: ShieldIcon },
  { id: 'about', label: '关于', icon: InfoIcon },
];

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState('general');
  const { t } = useTranslation();
  const { showToast } = useToast();
  
  // 使用 settings store
  const settings = useSettingsStore();

  const handleExportData = async () => {
    try {
      await downloadBackup();
      showToast('数据导出成功', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showToast('数据导出失败', 'error');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          await restoreFromFile(file);
          showToast('数据导入成功，即将刷新页面', 'success');
          setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
          console.error('Import failed:', error);
          showToast('数据导入失败', 'error');
        }
      }
    };
    input.click();
  };

  const handleClearData = async () => {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
      try {
        await clearDatabase();
        showToast('数据已清空，即将刷新页面', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        console.error('Clear failed:', error);
        showToast('清空数据失败', 'error');
      }
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <SettingSection title="启动设置">
              <SettingItem
                label="开机自启动"
                description="系统启动时自动运行 PromptHub"
              >
                <ToggleSwitch 
                  checked={settings.launchAtStartup}
                  onChange={settings.setLaunchAtStartup}
                />
              </SettingItem>
              <SettingItem
                label="启动时最小化"
                description="启动后最小化到系统托盘"
              >
                <ToggleSwitch 
                  checked={settings.minimizeOnLaunch}
                  onChange={settings.setMinimizeOnLaunch}
                />
              </SettingItem>
            </SettingSection>

            <SettingSection title="编辑器设置">
              <SettingItem
                label="自动保存"
                description="编辑时自动保存更改"
              >
                <ToggleSwitch 
                  checked={settings.autoSave}
                  onChange={settings.setAutoSave}
                />
              </SettingItem>
              <SettingItem
                label="显示行号"
                description="在编辑器中显示行号"
              >
                <ToggleSwitch 
                  checked={settings.showLineNumbers}
                  onChange={settings.setShowLineNumbers}
                />
              </SettingItem>
            </SettingSection>
          </div>
        );

      case 'appearance':
        const themeModes: { id: ThemeMode; name: string }[] = [
          { id: 'light', name: '浅色' },
          { id: 'dark', name: '深色' },
          { id: 'system', name: '跟随系统' },
        ];
        return (
          <div className="space-y-6">
            <SettingSection title="外观模式">
              <div className="flex gap-2 p-3">
                {themeModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => settings.setThemeMode(mode.id)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      settings.themeMode === mode.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted/60 text-foreground hover:bg-muted'
                    }`}
                  >
                    {mode.name}
                  </button>
                ))}
              </div>
            </SettingSection>

            <SettingSection title="主题色">
              <div className="p-3">
                <div className="grid grid-cols-6 gap-3">
                  {MORANDI_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => settings.setThemeColor(theme.id)}
                      className="group flex flex-col items-center gap-2"
                      title={theme.name}
                    >
                      <div 
                        className={`w-12 h-12 rounded-xl transition-all shadow-sm ${
                          settings.themeColor === theme.id 
                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' 
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: `hsl(${theme.hue}, ${theme.saturation}%, 50%)` }}
                      >
                        {settings.themeColor === theme.id && (
                          <CheckIcon className="w-5 h-5 text-white m-auto mt-3.5" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </SettingSection>

            <SettingSection title="字体大小">
              <div className="flex gap-2 p-3">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => settings.setFontSize(size.id)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      settings.fontSize === size.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted/60 text-foreground hover:bg-muted'
                    }`}
                  >
                    {size.name}
                    <span className="block text-xs opacity-70 mt-0.5">{size.value}px</span>
                  </button>
                ))}
              </div>
            </SettingSection>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <SettingSection title="存储位置">
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <FolderIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">数据目录</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {settings.dataPath}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newPath = prompt('输入新的数据目录路径:', settings.dataPath);
                      if (newPath) {
                        settings.setDataPath(newPath);
                      }
                    }}
                    className="h-8 px-3 rounded-lg bg-muted text-sm hover:bg-muted/80 transition-colors"
                  >
                    更改
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  更改路径后需要重启应用，数据不会自动迁移。
                </p>
              </div>
            </SettingSection>

            <SettingSection title="数据管理">
              <SettingItem
                label="导出数据"
                description="将所有 Prompt 和设置导出为 JSON 文件"
              >
                <button
                  onClick={handleExportData}
                  className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  导出
                </button>
              </SettingItem>
              <SettingItem
                label="导入数据"
                description="从 JSON 文件恢复数据"
              >
                <button
                  onClick={handleImportData}
                  className="h-9 px-4 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  导入
                </button>
              </SettingItem>
              <SettingItem
                label="清空数据"
                description="删除所有本地数据（不可恢复）"
              >
                <button
                  onClick={handleClearData}
                  className="h-9 px-4 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors"
                >
                  清空
                </button>
              </SettingItem>
            </SettingSection>

            <SettingSection title="数据库信息">
              <div className="p-4 text-sm text-muted-foreground space-y-1">
                <p>• 存储类型: IndexedDB</p>
                <p>• 数据库名称: PromptHubDB</p>
                <p>• 支持自动备份和恢复</p>
              </div>
            </SettingSection>
          </div>
        );

      case 'shortcuts':
        return (
          <div className="space-y-6">
            <SettingSection title="全局快捷键">
              <ShortcutItem label="新建 Prompt" shortcut="⌘ N" />
              <ShortcutItem label="搜索" shortcut="⌘ K" />
              <ShortcutItem label="设置" shortcut="⌘ ," />
              <ShortcutItem label="切换主题" shortcut="⌘ ⇧ T" />
            </SettingSection>
            <SettingSection title="编辑器快捷键">
              <ShortcutItem label="保存" shortcut="⌘ S" />
              <ShortcutItem label="复制 Prompt" shortcut="⌘ ⇧ C" />
              <ShortcutItem label="预览" shortcut="⌘ P" />
              <ShortcutItem label="撤销" shortcut="⌘ Z" />
              <ShortcutItem label="重做" shortcut="⌘ ⇧ Z" />
            </SettingSection>
            <SettingSection title="导航快捷键">
              <ShortcutItem label="上一个 Prompt" shortcut="↑" />
              <ShortcutItem label="下一个 Prompt" shortcut="↓" />
              <ShortcutItem label="收藏/取消收藏" shortcut="⌘ D" />
              <ShortcutItem label="删除" shortcut="⌘ ⌫" />
            </SettingSection>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <SettingSection title="界面语言">
              <SettingItem
                label="语言"
                description="选择界面显示语言"
              >
                <select 
                  className="h-9 px-3 rounded-lg bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={settings.language}
                  onChange={(e) => settings.setLanguage(e.target.value as 'zh' | 'en')}
                >
                  <option value="zh">简体中文</option>
                  <option value="en">English</option>
                </select>
              </SettingItem>
            </SettingSection>
            <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              更改语言后需要重启应用才能生效。
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <SettingSection title="通知设置">
              <SettingItem
                label="启用通知"
                description="允许应用发送桌面通知"
              >
                <ToggleSwitch 
                  checked={settings.enableNotifications}
                  onChange={settings.setEnableNotifications}
                />
              </SettingItem>
              <SettingItem
                label="复制成功提示"
                description="复制 Prompt 后显示提示"
              >
                <ToggleSwitch 
                  checked={settings.showCopyNotification}
                  onChange={settings.setShowCopyNotification}
                />
              </SettingItem>
              <SettingItem
                label="保存成功提示"
                description="保存更改后显示提示"
              >
                <ToggleSwitch 
                  checked={settings.showSaveNotification}
                  onChange={settings.setShowSaveNotification}
                />
              </SettingItem>
            </SettingSection>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <SettingSection title="隐私设置">
              <SettingItem
                label="发送匿名使用数据"
                description="帮助我们改进产品（不包含任何个人信息）"
              >
                <ToggleSwitch 
                  checked={settings.sendAnalytics}
                  onChange={settings.setSendAnalytics}
                />
              </SettingItem>
              <SettingItem
                label="崩溃报告"
                description="自动发送崩溃报告以帮助修复问题"
              >
                <ToggleSwitch 
                  checked={settings.sendCrashReports}
                  onChange={settings.setSendCrashReports}
                />
              </SettingItem>
            </SettingSection>
            <SettingSection title="数据安全">
              <div className="px-4 py-3 text-sm text-muted-foreground space-y-2">
                <p>• 所有数据都存储在本地，不会上传到任何服务器</p>
                <p>• 你可以随时导出或删除所有数据</p>
                <p>• 我们不会收集你的 Prompt 内容</p>
              </div>
            </SettingSection>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center">
                <span className="text-white text-2xl font-bold">P</span>
              </div>
              <h2 className="text-xl font-semibold">PromptHub</h2>
              <p className="text-muted-foreground mt-1">版本 0.1.0</p>
            </div>
            <SettingSection title="关于">
              <div className="space-y-2 text-sm text-muted-foreground px-4 py-3">
                <p>PromptHub 是一个本地优先的 Prompt 管理工具，帮助你高效管理和组织 AI 提示词。</p>
              </div>
            </SettingSection>
            <SettingSection title="链接">
              <SettingItem label="GitHub 仓库" description="查看源代码和提交问题">
                <a 
                  href="https://github.com/legeling/PromptHub" 
                  target="_blank"
                  className="text-primary text-sm hover:underline"
                >
                  打开
                </a>
              </SettingItem>
              <SettingItem label="检查更新" description="当前已是最新版本">
                <button className="h-8 px-3 rounded-lg bg-muted text-sm hover:bg-muted/80 transition-colors">
                  检查
                </button>
              </SettingItem>
            </SettingSection>
            <SettingSection title="开源协议">
              <div className="px-4 py-3 text-sm text-muted-foreground">
                MIT License © 2024 PromptHub
              </div>
            </SettingSection>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* 设置侧边栏 */}
      <div className="w-56 bg-card border-r border-border flex flex-col">
        {/* 返回按钮 */}
        <div className="p-3 border-b border-border">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>返回</span>
          </button>
        </div>

        {/* 菜单列表 */}
        <nav className="flex-1 overflow-y-auto p-2">
          {SETTINGS_MENU.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeSection === item.id
                  ? 'bg-primary text-white'
                  : 'text-foreground/80 hover:bg-muted'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 设置内容区 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl">
          <h1 className="text-xl font-semibold mb-6">
            {SETTINGS_MENU.find((m) => m.id === activeSection)?.label}
          </h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// 设置区块组件
function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">{title}</h3>
      <div className="space-y-1 bg-card rounded-xl border border-border overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// 设置项组件
function SettingItem({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
        )}
      </div>
      {children}
    </div>
  );
}

// 开关组件
interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
}

function ToggleSwitch({ checked, onChange, defaultChecked = false }: ToggleSwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleClick = () => {
    const newValue = !isChecked;
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        isChecked ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          isChecked ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  );
}

// 快捷键项组件
function ShortcutItem({ label, shortcut }: { label: string; shortcut: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0">
      <span className="text-sm">{label}</span>
      <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono">{shortcut}</kbd>
    </div>
  );
}

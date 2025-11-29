import { globalShortcut, BrowserWindow } from 'electron';

/**
 * 注册全局快捷键
 */
export function registerShortcuts(): void {
  // 这里可以注册全局快捷键
  // 注意：大部分快捷键应该在渲染进程中处理，这里只处理需要全局响应的快捷键
}

/**
 * 注销所有全局快捷键
 */
export function unregisterShortcuts(): void {
  globalShortcut.unregisterAll();
}

/**
 * 发送快捷键事件到渲染进程
 */
export function sendShortcutToRenderer(channel: string): void {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.send(channel);
  }
}

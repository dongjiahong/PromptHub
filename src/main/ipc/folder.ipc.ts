import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import { FolderDB } from '../database/folder';
import type { CreateFolderDTO, UpdateFolderDTO } from '../../shared/types';

/**
 * 注册文件夹相关 IPC 处理器
 */
export function registerFolderIPC(db: FolderDB): void {
  // 创建文件夹
  ipcMain.handle(IPC_CHANNELS.FOLDER_CREATE, async (_event, data: CreateFolderDTO) => {
    return db.create(data);
  });

  // 获取所有文件夹
  ipcMain.handle(IPC_CHANNELS.FOLDER_GET_ALL, async () => {
    return db.getAll();
  });

  // 更新文件夹
  ipcMain.handle(IPC_CHANNELS.FOLDER_UPDATE, async (_event, id: string, data: UpdateFolderDTO) => {
    return db.update(id, data);
  });

  // 删除文件夹
  ipcMain.handle(IPC_CHANNELS.FOLDER_DELETE, async (_event, id: string) => {
    return db.delete(id);
  });

  // 重新排序文件夹
  ipcMain.handle(IPC_CHANNELS.FOLDER_REORDER, async (_event, ids: string[]) => {
    db.reorder(ids);
    return true;
  });
}

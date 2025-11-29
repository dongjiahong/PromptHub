import { useState } from 'react';
import { StarIcon, HashIcon, PlusIcon, LayoutGridIcon, LinkIcon, SettingsIcon } from 'lucide-react';
import { useFolderStore } from '../../stores/folder.store';
import { usePromptStore } from '../../stores/prompt.store';
import { ResourcesModal } from '../resources/ResourcesModal';

type PageType = 'home' | 'settings';

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, count, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
        transition-all duration-150
        ${active
          ? 'bg-sidebar-accent text-sidebar-foreground'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
        }
      `}
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-sidebar-accent text-sidebar-foreground/60">
          {count}
        </span>
      )}
    </button>
  );
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const folders = useFolderStore((state) => state.folders);
  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const selectFolder = useFolderStore((state) => state.selectFolder);
  const prompts = usePromptStore((state) => state.prompts);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const favoriteCount = prompts.filter((p) => p.isFavorite).length;
  const allTags = prompts.flatMap((p) => p.tags);
  const uniqueTags = [...new Set(allTags)];

  return (
    <aside className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* 顶部留白区域 - 给窗口控制按钮留空间 */}
      <div className="h-10 titlebar-drag shrink-0" />

      {/* 导航区域 */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {/* 主导航 */}
        <div className="space-y-1">
          <NavItem
            icon={<LayoutGridIcon className="w-5 h-5" />}
            label="全部 Prompts"
            count={prompts.length}
            active={selectedFolderId === null}
            onClick={() => selectFolder(null)}
          />
          <NavItem
            icon={<StarIcon className="w-5 h-5" />}
            label="收藏"
            count={favoriteCount}
            active={selectedFolderId === 'favorites'}
            onClick={() => selectFolder('favorites')}
          />
        </div>

        {/* 文件夹区域 */}
        <div className="pt-4">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              文件夹
            </span>
            <button className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-primary transition-colors">
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-0.5">
            {folders.map((folder) => (
              <NavItem
                key={folder.id}
                icon={<span className="text-base">{folder.icon || '📁'}</span>}
                label={folder.name}
                active={selectedFolderId === folder.id}
                onClick={() => selectFolder(folder.id)}
              />
            ))}
            {folders.length === 0 && (
              <p className="px-3 py-4 text-sm text-sidebar-foreground/50 text-center">
                暂无文件夹
              </p>
            )}
          </div>
        </div>

        {/* 标签区域 */}
        {uniqueTags.length > 0 && (
          <div className="pt-4">
            <div className="flex items-center px-3 mb-2">
              <span className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                标签
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 px-3">
              {uniqueTags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                    bg-sidebar-accent text-sidebar-foreground/70 hover:bg-primary hover:text-white
                    transition-colors duration-200"
                >
                  <HashIcon className="w-3 h-3" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* 底部操作 */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        <button
          onClick={() => setIsResourcesOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <LinkIcon className="w-4 h-4" />
          <span>推荐资源</span>
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            currentPage === 'settings'
              ? 'bg-sidebar-accent text-sidebar-foreground'
              : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>设置</span>
        </button>
      </div>

      {/* 推荐资源弹窗 */}
      <ResourcesModal
        isOpen={isResourcesOpen}
        onClose={() => setIsResourcesOpen(false)}
      />
    </aside>
  );
}

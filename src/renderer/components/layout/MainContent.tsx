import { useState } from 'react';
import { usePromptStore } from '../../stores/prompt.store';
import { useFolderStore } from '../../stores/folder.store';
import { StarIcon, CopyIcon, HistoryIcon, HashIcon, ClockIcon, SparklesIcon, EditIcon, TrashIcon, CheckIcon } from 'lucide-react';
import { EditPromptModal, VersionHistoryModal } from '../prompt';
import { useToast } from '../ui/Toast';
import type { PromptVersion } from '../../../shared/types';

export function MainContent() {
  const prompts = usePromptStore((state) => state.prompts);
  const selectedId = usePromptStore((state) => state.selectedId);
  const selectPrompt = usePromptStore((state) => state.selectPrompt);
  const toggleFavorite = usePromptStore((state) => state.toggleFavorite);
  const deletePrompt = usePromptStore((state) => state.deletePrompt);
  const updatePrompt = usePromptStore((state) => state.updatePrompt);
  const searchQuery = usePromptStore((state) => state.searchQuery);
  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleRestoreVersion = async (version: PromptVersion) => {
    if (selectedPrompt) {
      await updatePrompt(selectedPrompt.id, {
        systemPrompt: version.systemPrompt,
        userPrompt: version.userPrompt,
      });
      showToast('已恢复到历史版本', 'success');
    }
  };

  // 过滤 Prompts
  let filteredPrompts = prompts;

  if (selectedFolderId === 'favorites') {
    filteredPrompts = filteredPrompts.filter((p) => p.isFavorite);
  } else if (selectedFolderId) {
    filteredPrompts = filteredPrompts.filter((p) => p.folderId === selectedFolderId);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredPrompts = filteredPrompts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.userPrompt.toLowerCase().includes(query)
    );
  }

  const selectedPrompt = prompts.find((p) => p.id === selectedId);

  return (
    <main className="flex-1 flex overflow-hidden bg-background">
      {/* Prompt 列表 - iOS 风格卡片 */}
      <div className="w-80 border-r border-border overflow-y-auto bg-card/50">
        {filteredPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <SparklesIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-foreground mb-1">暂无 Prompt</p>
            <p className="text-sm text-muted-foreground">点击「新建」创建第一个 Prompt</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filteredPrompts.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => selectPrompt(prompt.id)}
                className={`
                  w-full text-left p-4 rounded-2xl
                  transition-all duration-200 ease-out
                  ${selectedId === prompt.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                    : 'bg-card hover:bg-accent hover:shadow-md active:scale-[0.98]'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold truncate">{prompt.title}</h3>
                  {prompt.isFavorite && (
                    <StarIcon className={`w-4 h-4 flex-shrink-0 ${
                      selectedId === prompt.id ? 'fill-white text-white' : 'fill-yellow-400 text-yellow-400'
                    }`} />
                  )}
                </div>
                {prompt.description && (
                  <p className={`text-sm truncate mb-2 ${
                    selectedId === prompt.id ? 'text-white/80' : 'text-muted-foreground'
                  }`}>
                    {prompt.description}
                  </p>
                )}
                <div className={`flex items-center gap-3 text-xs ${
                  selectedId === prompt.id ? 'text-white/60' : 'text-muted-foreground'
                }`}>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {new Date(prompt.updatedAt).toLocaleDateString()}
                  </span>
                  <span>v{prompt.version}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Prompt 详情 - iOS 风格 */}
      <div className="flex-1 overflow-y-auto">
        {selectedPrompt ? (
          <div className="max-w-3xl mx-auto p-8">
            {/* 标题区域 */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">{selectedPrompt.title}</h2>
                {selectedPrompt.description && (
                  <p className="text-muted-foreground">{selectedPrompt.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleFavorite(selectedPrompt.id)}
                  className={`
                    p-2.5 rounded-xl transition-all duration-200
                    ${selectedPrompt.isFavorite
                      ? 'text-yellow-500 bg-yellow-500/10'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }
                    active:scale-95
                  `}
                >
                  <StarIcon className={`w-5 h-5 ${selectedPrompt.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2.5 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 active:scale-95"
                >
                  <EditIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 标签 */}
            {selectedPrompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPrompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-accent text-accent-foreground"
                  >
                    <HashIcon className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* System Prompt */}
            {selectedPrompt.systemPrompt && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    System Prompt
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-card border border-border font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedPrompt.systemPrompt}
                </div>
              </div>
            )}

            {/* User Prompt */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  User Prompt
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-card border border-border font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {selectedPrompt.userPrompt}
              </div>
            </div>

            {/* 操作按钮 - iOS 风格 */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  const text = selectedPrompt.systemPrompt 
                    ? `System: ${selectedPrompt.systemPrompt}\n\nUser: ${selectedPrompt.userPrompt}`
                    : selectedPrompt.userPrompt;
                  navigator.clipboard.writeText(text);
                  setCopied(true);
                  showToast('已复制到剪贴板', 'success');
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="
                  flex items-center gap-2 h-11 px-6 rounded-xl
                  bg-primary text-white text-sm font-semibold
                  shadow-sm shadow-primary/25
                  hover:shadow-md hover:shadow-primary/30 hover:scale-[1.02]
                  active:scale-[0.98]
                  transition-all duration-200
                "
              >
                {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                <span>{copied ? '已复制' : '复制 Prompt'}</span>
              </button>
              <button 
                onClick={() => setIsVersionModalOpen(true)}
                className="
                  flex items-center gap-2 h-11 px-6 rounded-xl
                  bg-card border border-border text-sm font-medium
                  hover:bg-accent hover:scale-[1.02]
                  active:scale-[0.98]
                  transition-all duration-200
                "
              >
                <HistoryIcon className="w-4 h-4" />
                <span>历史版本</span>
              </button>
              <button 
                onClick={async () => {
                  if (confirm('确定要删除这个 Prompt 吗？')) {
                    await deletePrompt(selectedPrompt.id);
                    showToast('Prompt 已删除', 'success');
                  }
                }}
                className="
                  flex items-center gap-2 h-11 px-6 rounded-xl
                  bg-card border border-destructive/30 text-destructive text-sm font-medium
                  hover:bg-destructive/10 hover:scale-[1.02]
                  active:scale-[0.98]
                  transition-all duration-200
                "
              >
                <TrashIcon className="w-4 h-4" />
                <span>删除</span>
              </button>
            </div>

            {/* 编辑弹窗 */}
            <EditPromptModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              prompt={selectedPrompt}
            />

            {/* 历史版本弹窗 */}
            <VersionHistoryModal
              isOpen={isVersionModalOpen}
              onClose={() => setIsVersionModalOpen(false)}
              prompt={selectedPrompt}
              onRestore={handleRestoreVersion}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
              <SparklesIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">选择一个 Prompt</h3>
            <p className="text-muted-foreground max-w-sm">
              从左侧列表选择一个 Prompt 查看详情，或点击「新建」创建新的 Prompt
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

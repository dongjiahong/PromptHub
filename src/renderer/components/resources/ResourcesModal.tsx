import { Modal } from '../ui';
import { ExternalLinkIcon, BookOpenIcon, CodeIcon, BrainIcon, PenToolIcon } from 'lucide-react';

interface ResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RESOURCES = [
  {
    category: 'Prompt 工程指南',
    icon: BookOpenIcon,
    items: [
      { name: 'OpenAI Prompt Engineering', url: 'https://platform.openai.com/docs/guides/prompt-engineering', desc: 'OpenAI 官方指南' },
      { name: 'Anthropic Prompt Design', url: 'https://docs.anthropic.com/claude/docs/prompt-design', desc: 'Claude 提示词设计' },
      { name: 'Learn Prompting', url: 'https://learnprompting.org/', desc: '免费 Prompt 教程' },
    ],
  },
  {
    category: 'Prompt 模板库',
    icon: PenToolIcon,
    items: [
      { name: 'Awesome ChatGPT Prompts', url: 'https://github.com/f/awesome-chatgpt-prompts', desc: 'GitHub 热门 Prompt 集合' },
      { name: 'FlowGPT', url: 'https://flowgpt.com/', desc: 'Prompt 分享社区' },
      { name: 'PromptBase', url: 'https://promptbase.com/', desc: 'Prompt 市场' },
    ],
  },
  {
    category: 'AI 开发工具',
    icon: CodeIcon,
    items: [
      { name: 'LangChain', url: 'https://www.langchain.com/', desc: 'LLM 应用开发框架' },
      { name: 'Semantic Kernel', url: 'https://github.com/microsoft/semantic-kernel', desc: '微软 AI 编排框架' },
      { name: 'Guidance', url: 'https://github.com/guidance-ai/guidance', desc: '结构化生成控制' },
    ],
  },
  {
    category: 'AI 模型服务',
    icon: BrainIcon,
    items: [
      { name: 'OpenAI API', url: 'https://platform.openai.com/', desc: 'GPT-4, DALL-E 等' },
      { name: 'Anthropic Claude', url: 'https://www.anthropic.com/', desc: 'Claude 系列模型' },
      { name: 'Google AI Studio', url: 'https://aistudio.google.com/', desc: 'Gemini 模型' },
    ],
  },
];

export function ResourcesModal({ isOpen, onClose }: ResourcesModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="推荐资源" size="lg">
      <div className="space-y-6">
        {RESOURCES.map((category) => (
          <div key={category.category} className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <category.icon className="w-4 h-4 text-primary" />
              {category.category}
            </h3>
            <div className="grid gap-2">
              {category.items.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-accent transition-colors group"
                >
                  <div>
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <ExternalLinkIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

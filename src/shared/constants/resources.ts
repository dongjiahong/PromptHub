/**
 * 推荐资源链接
 */

export interface Resource {
  title: string;
  url: string;
  description: string;
}

export const RECOMMENDED_RESOURCES = {
  learning: [
    {
      title: 'Prompt Engineering Guide',
      url: 'https://www.promptingguide.ai/',
      description: '最全面的 Prompt 工程指南',
    },
    {
      title: 'Learn Prompting',
      url: 'https://learnprompting.org/',
      description: '免费 Prompt 课程',
    },
    {
      title: 'OpenAI Prompt Engineering',
      url: 'https://platform.openai.com/docs/guides/prompt-engineering',
      description: 'OpenAI 官方指南',
    },
    {
      title: 'Anthropic Prompt Library',
      url: 'https://docs.anthropic.com/claude/prompt-library',
      description: 'Claude 官方 Prompt 库',
    },
  ] as Resource[],

  collections: [
    {
      title: 'Awesome ChatGPT Prompts',
      url: 'https://github.com/f/awesome-chatgpt-prompts',
      description: 'GitHub 10w+ Star',
    },
    {
      title: 'FlowGPT',
      url: 'https://flowgpt.com/',
      description: 'Prompt 分享社区',
    },
    {
      title: 'PromptHero',
      url: 'https://prompthero.com/',
      description: 'AI 图像 Prompt 库',
    },
    {
      title: 'Snack Prompt',
      url: 'https://snackprompt.com/',
      description: 'Prompt 收藏分享',
    },
  ] as Resource[],

  tools: [
    {
      title: 'PromptLayer',
      url: 'https://www.promptlayer.com/',
      description: '企业级 Prompt 管理',
    },
    {
      title: 'PromptWorks',
      url: 'https://github.com/YellowSeaa/PromptWorks',
      description: '开源 Prompt 工具',
    },
    {
      title: 'Langfuse',
      url: 'https://langfuse.com/',
      description: '开源 LLM 观测平台',
    },
  ] as Resource[],
};

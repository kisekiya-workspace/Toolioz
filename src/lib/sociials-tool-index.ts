import { TOOLS } from '@/data/sociials-tools';

export const importedTools = TOOLS.map((tool) => ({
  name: tool.title,
  url: tool.href,
  description: tool.description,
  category: tool.category,
}));

export const importedToolItems = importedTools.map(({ name, url, description }) => ({
  name,
  url,
  description,
}));

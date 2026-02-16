import type { ThinkingFlowNodeDto } from '@generated/hooks/drafts'

export const THINKING_FLOW_NODE_MOCKS: ThinkingFlowNodeDto[] = [
  {
    id: 'thinking-flow-node-break',
    title: 'Problem',
    description: 'Опиши, что ломается в текущем подходе.',
    hint: 'Например: рекурсивный подсчет без кэша растет экспоненциально.',
    icon: 'flowBreak',
  },
  {
    id: 'thinking-flow-node-control',
    title: 'Control',
    description: 'Запиши проверку или метрику, которая держит систему.',
    hint: 'Например: мемоизация через Map фиксирует повторные вызовы.',
    icon: 'flowControl',
  },
  {
    id: 'thinking-flow-node-insight',
    title: 'Insight',
    description: 'Сформулируй главный вывод после правки.',
    hint: 'Например: сложность падает с O(2^n) до O(n).',
    icon: 'flowInsight',
  },
]

export type OutputMode = 'default' | 'prompt' | 'doc';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  images?: string[];
  duration?: number;
  mode?: OutputMode;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: string;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  vision: boolean;
}

export type ApiContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export type ApiMessage = {
  role: string;
  content: string | ApiContentPart[];
};

export const AVAILABLE_MODELS: Model[] = [
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', vision: true },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', vision: true },
  { id: 'openai/o3-mini', name: 'o3 Mini', provider: 'OpenAI', vision: false },
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', vision: true },
  { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic', vision: true },
  { id: 'google/gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google', vision: true },
  { id: 'google/gemini-2.0-flash-lite-001', name: 'Gemini 2.0 Flash Lite', provider: 'Google', vision: true },
  { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick', provider: 'Meta', vision: true },
  { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', vision: false },
  { id: 'qwen/qwq-32b', name: 'QwQ 32B', provider: 'Qwen', vision: false },
  { id: 'mistralai/mistral-large', name: 'Mistral Large', provider: 'Mistral', vision: true },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', provider: 'DeepSeek', vision: false },
];

import { useState, useCallback, useRef } from 'react';
import type { Conversation, Message, ApiMessage, ApiContentPart, OutputMode } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { sendMessage } from '../services/openrouter';
import { generateId, truncateText } from '../utils/helpers';

const STORAGE_KEY = 'magnumai-conversations';

function buildApiMessages(prev: Message[], latestUserMsg: Message): ApiMessage[] {
  const all = [...prev, latestUserMsg];
  return all.map((m) => {
    if (m.role === 'user' && m.images?.length) {
      const parts: ApiContentPart[] = [{ type: 'text', text: m.content }];
      for (const img of m.images) {
        parts.push({ type: 'image_url', image_url: { url: img } });
      }
      return { role: 'user', content: parts };
    }
    return { role: m.role, content: m.content };
  });
}

export function useChat() {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>(STORAGE_KEY, []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef(false);
  const convRef = useRef<Map<string, Conversation>>(new Map());
  convRef.current = new Map(conversations.map((c) => [c.id, c]));

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  const createConversation = useCallback(
    (model: string) => {
      const id = generateId();
      const now = Date.now();
      const conv: Conversation = {
        id,
        title: 'New conversation',
        messages: [],
        createdAt: now,
        updatedAt: now,
        model,
      };
      setConversations((prev) => [conv, ...prev]);
      setActiveId(id);
      convRef.current.set(id, conv);
      return id;
    },
    [setConversations]
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      setActiveId((prev) => (prev === id ? null : prev));
      convRef.current.delete(id);
    },
    [setConversations]
  );

  const clearConversations = useCallback(() => {
    setConversations([]);
    setActiveId(null);
    convRef.current.clear();
  }, [setConversations]);

  const sendUserMessage = useCallback(
    async (content: string, apiKey: string, overrideConvId?: string, images?: string[], mode?: OutputMode) => {
      const convId = overrideConvId || activeId;
      if (!convId || !apiKey) return;

      setIsLoading(true);
      setStreamingContent('');
      const startTime = Date.now();

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: Date.now(),
        images,
        mode,
      };

      const existing = convRef.current.get(convId);
      if (!existing) {
        setIsLoading(false);
        return;
      }

      const prevMessages = existing.messages;
      const modelName = existing.model;
      const isNew = existing.title === 'New conversation';

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [...c.messages, userMessage],
                title: isNew ? truncateText(content || '(image)', 50) : c.title,
                updatedAt: Date.now(),
              }
            : c
        )
      );

      const apiMessages = buildApiMessages(prevMessages, userMessage);

      abortRef.current = false;

      try {
        const fullContent = await sendMessage(apiMessages, modelName, apiKey, {
          onToken: (token) => {
            if (!abortRef.current) {
              setStreamingContent((prev) => prev + token);
            }
          },
          onError: (err) => {
            setIsLoading(false);
            setStreamingContent('');
            throw err;
          },
        });

        if (!abortRef.current) {
          const assistantMessage: Message = {
            id: generateId(),
            role: 'assistant',
            content: fullContent,
            timestamp: Date.now(),
            duration: (Date.now() - startTime) / 1000,
            mode,
          };

          setConversations((prev) =>
            prev.map((c) =>
              c.id === convId
                ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: Date.now() }
                : c
            )
          );
          setStreamingContent('');
        }
      } catch (err) {
        const errorMsg: Message = {
          id: generateId(),
          role: 'assistant',
          content: `Error: ${err instanceof Error ? err.message : 'Request failed'}`,
          timestamp: Date.now(),
        };
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? { ...c, messages: [...c.messages, errorMsg], updatedAt: Date.now() }
              : c
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeId, setConversations]
  );

  const retryLast = useCallback(
    async (apiKey: string) => {
      const convId = activeId;
      if (!convId || !apiKey) return;

      const conv = convRef.current.get(convId);
      if (!conv) return;

      const msgs = conv.messages;
      if (msgs.length < 2) return;

      let lastUserIndex = -1;
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === 'user') {
          lastUserIndex = i;
          break;
        }
      }
      if (lastUserIndex === -1) return;
      const lastUserMsg = msgs[lastUserIndex];

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: c.messages.slice(0, lastUserIndex + 1),
                updatedAt: Date.now(),
              }
            : c
        )
      );

      await sendUserMessage(lastUserMsg.content, apiKey, convId, lastUserMsg.images, lastUserMsg.mode);
    },
    [activeId, sendUserMessage]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current = true;
    setIsLoading(false);
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const shareConversation = useCallback(() => {
    const conv = activeConversation;
    if (!conv) return;
    const text = conv.messages
      .map((m) => `**${m.role === 'user' ? 'You' : 'AI'}:** ${m.content}`)
      .join('\n\n');
    navigator.clipboard.writeText(text).catch(() => {});
  }, [activeConversation]);

  return {
    conversations,
    activeConversation,
    activeId,
    isLoading,
    streamingContent,
    createConversation,
    deleteConversation,
    clearConversations,
    sendUserMessage,
    retryLast,
    stopStreaming,
    selectConversation,
    shareConversation,
  };
}

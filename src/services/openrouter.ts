import type { ApiMessage } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete?: () => void;
  onError: (error: Error) => void;
}

export async function sendMessage(
  messages: ApiMessage[],
  model: string,
  apiKey: string,
  callbacks?: StreamCallbacks
): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'MagnumAI',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: !!callbacks,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  if (callbacks && response.body) {
    return handleStream(response.body, callbacks);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function handleStream(
  body: ReadableStream<Uint8Array>,
  callbacks: StreamCallbacks
): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let fullContent = '';

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    done = streamDone;

    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6).trim();

        if (data === '[DONE]') {
          break;
        }

        try {
          const parsed = JSON.parse(data);
          const token = parsed.choices?.[0]?.delta?.content || '';
          if (token) {
            fullContent += token;
            callbacks.onToken(token);
          }
        } catch {
          // skip malformed chunks
        }
      }
    }
  }

  callbacks.onComplete?.();
  return fullContent;
}

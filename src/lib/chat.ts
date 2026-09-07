/**
 * Client for the drive.8n.ai chat workflow.
 *
 * The Pattaya app is a static export, so there is no server to proxy through:
 * the browser talks to the workflow webhook directly and the endpoint has to be
 * inlined at build time via `NEXT_PUBLIC_CHAT_ENDPOINT`. With no endpoint set
 * the UI runs in demo mode instead of firing requests at a guessed URL.
 */

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  at: number;
};

export type ChatErrorCode = 'offline' | 'timeout' | 'http' | 'empty';

export class ChatError extends Error {
  readonly code: ChatErrorCode;

  constructor(code: ChatErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'ChatError';
    this.code = code;
  }
}

export const chatEndpoint = process.env.NEXT_PUBLIC_CHAT_ENDPOINT ?? '';

/** False until an endpoint is configured — the UI then answers in demo mode. */
export const isChatLive = chatEndpoint.length > 0;

const REQUEST_TIMEOUT_MS = 45_000;

/** How much of the conversation travels with each turn. */
const HISTORY_LIMIT = 12;

/**
 * Keys a workflow can answer under. `output` comes first because that is what
 * an n8n AI agent node returns; the rest cover hand-rolled Respond to Webhook
 * nodes, which every author spells differently.
 */
const REPLY_KEYS = [
  'output',
  'reply',
  'response',
  'answer',
  'text',
  'message',
  'content',
  'result',
  'data',
  'json',
] as const;

function pickReply(payload: unknown, depth = 0): string {
  if (depth > 6) return '';
  if (typeof payload === 'string') return payload.trim();

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const reply = pickReply(item, depth + 1);
      if (reply) return reply;
    }
    return '';
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    for (const key of REPLY_KEYS) {
      if (!(key in record)) continue;
      const reply = pickReply(record[key], depth + 1);
      if (reply) return reply;
    }
  }

  return '';
}

export function newMessageId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

type SendOptions = {
  message: string;
  /** Stable per browser, so the workflow can keep its own memory of the chat. */
  sessionId: string;
  locale: string;
  history?: ChatMessage[];
  signal?: AbortSignal;
};

export async function sendChatMessage({
  message,
  sessionId,
  locale,
  history = [],
  signal,
}: SendOptions): Promise<string> {
  if (!isChatLive) {
    throw new ChatError('offline', 'No chat endpoint configured');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort, { once: true });

  let response: Response;
  try {
    response = await fetch(chatEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // The field names n8n's chat trigger expects, plus what the workflow
        // needs to answer in the visitor's language.
        action: 'sendMessage',
        sessionId,
        chatInput: message,
        message,
        locale,
        history: history.slice(-HISTORY_LIMIT).map(({ role, content }) => ({ role, content })),
      }),
      signal: controller.signal,
    });
  } catch (error) {
    // A caller-driven abort is not a failure to report — let it through as is.
    if (signal?.aborted) throw error;
    if (controller.signal.aborted) throw new ChatError('timeout');
    throw new ChatError('offline', error instanceof Error ? error.message : undefined);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }

  if (!response.ok) {
    throw new ChatError('http', `Chat endpoint answered ${response.status}`);
  }

  // Read as text first: workflows answer with JSON, with plain text, and with
  // JSON served under the wrong content type.
  const body = await response.text();
  let reply = '';
  try {
    reply = pickReply(JSON.parse(body));
  } catch {
    reply = body.trim();
  }

  if (!reply) throw new ChatError('empty');
  return reply;
}

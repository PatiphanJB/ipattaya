'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, Bot, RotateCcw, Send, Sparkles, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from '@/i18n/navigation';
import {
  ChatError,
  isChatLive,
  newMessageId,
  sendChatMessage,
  type ChatErrorCode,
  type ChatMessage,
} from '@/lib/chat';

const STORAGE_KEY = 'ipattaya:chat:v1';
const SUGGESTION_KEYS = ['s1', 's2', 's3', 's4'] as const;
const DEMO_DELAY_MS = 600;
const MAX_COMPOSER_HEIGHT = 160;

type Stored = { sessionId?: unknown; messages?: unknown };

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as Partial<ChatMessage>;
  return (
    typeof message.id === 'string' &&
    typeof message.content === 'string' &&
    (message.role === 'user' || message.role === 'assistant')
  );
}

export function ChatView() {
  const t = useTranslations('chat');
  const locale = useLocale();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [errorCode, setErrorCode] = useState<ChatErrorCode | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const sessionRef = useRef('');
  const requestRef = useRef<AbortController | null>(null);
  const retryRef = useRef<{ text: string; history: ChatMessage[] } | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Restore the transcript before the first paint the user can interact with.
  // A blocked or corrupt store is not an error — it just means a fresh chat.
  useEffect(() => {
    let stored: Stored = {};
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw) as Stored;
    } catch {
      stored = {};
    }

    sessionRef.current =
      typeof stored.sessionId === 'string' && stored.sessionId ? stored.sessionId : newMessageId();
    if (Array.isArray(stored.messages)) {
      setMessages(stored.messages.filter(isChatMessage));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ sessionId: sessionRef.current, messages })
      );
    } catch {
      // Private mode and full quotas both end up here; the chat still works.
    }
  }, [hydrated, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [messages, sending]);

  // Drop an answer nobody is waiting for any more.
  useEffect(() => () => requestRef.current?.abort(), []);

  const deliver = useCallback(
    async (text: string, history: ChatMessage[]) => {
      setSending(true);
      setErrorCode(null);
      retryRef.current = { text, history };

      const controller = new AbortController();
      requestRef.current?.abort();
      requestRef.current = controller;

      try {
        const reply = isChatLive
          ? await sendChatMessage({
              message: text,
              sessionId: sessionRef.current,
              locale,
              history,
              signal: controller.signal,
            })
          : await new Promise<string>((resolve) => {
              setTimeout(() => resolve(t('demoReply')), DEMO_DELAY_MS);
            });

        if (controller.signal.aborted) return;
        setMessages((prev) => [
          ...prev,
          { id: newMessageId(), role: 'assistant', content: reply, at: Date.now() },
        ]);
        retryRef.current = null;
      } catch (error) {
        if (controller.signal.aborted) return;
        setErrorCode(error instanceof ChatError ? error.code : 'offline');
      } finally {
        if (requestRef.current === controller) {
          requestRef.current = null;
          setSending(false);
        }
      }
    },
    [locale, t]
  );

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      const history = messages;
      setMessages((prev) => [
        ...prev,
        { id: newMessageId(), role: 'user', content: trimmed, at: Date.now() },
      ]);
      setInput('');
      if (composerRef.current) composerRef.current.style.height = 'auto';
      void deliver(trimmed, history);
    },
    [deliver, messages, sending]
  );

  const retry = useCallback(() => {
    const pending = retryRef.current;
    if (!pending || sending) return;
    void deliver(pending.text, pending.history);
  }, [deliver, sending]);

  const clear = useCallback(() => {
    requestRef.current?.abort();
    requestRef.current = null;
    retryRef.current = null;
    sessionRef.current = newMessageId();
    setMessages([]);
    setErrorCode(null);
    setSending(false);
  }, []);

  const isEmpty = messages.length === 0;

  return (
    <div className="mx-auto flex h-[calc(100dvh-5rem)] w-full max-w-3xl flex-col px-4 py-3 lg:h-dvh lg:py-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3">
        <Link
          href="/more"
          aria-label={t('back')}
          className="p-1 -ml-1 rounded-lg text-text-secondary hover:bg-bg-elevated transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-text truncate">{t('title')}</h1>
          <p className="text-[11px] text-text-muted truncate">
            {isChatLive ? t('subtitle') : t('demoBadge')}
          </p>
        </div>
        {!isEmpty && (
          <button
            type="button"
            onClick={clear}
            aria-label={t('clear')}
            className="p-2 rounded-lg text-text-muted hover:bg-bg-elevated hover:text-text transition-colors"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {!isChatLive && (
        <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-700">
          {t('demoNotice')}
        </p>
      )}

      {/* Transcript */}
      <div
        role="log"
        aria-live="polite"
        aria-label={t('title')}
        className="flex flex-1 flex-col overflow-y-auto pb-2"
      >
        {/* Short transcripts sit on the composer, the way a chat should. */}
        <div className="mt-auto space-y-3">
          {isEmpty && (
            <div className="flex gap-2.5 animate-fade-in">
              <Avatar />
              <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-bg-card border border-border px-3.5 py-2.5">
                <p className="text-sm leading-relaxed text-text whitespace-pre-wrap">{t('greeting')}</p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                'flex gap-2.5 animate-fade-in',
                message.role === 'user' && 'justify-end'
              )}
            >
              {message.role === 'assistant' && <Avatar />}
              <div
                className={clsx(
                  'max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
                  message.role === 'assistant'
                    ? 'rounded-2xl rounded-tl-md bg-bg-card border border-border text-text'
                    : 'rounded-2xl rounded-tr-md bg-primary text-white'
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex gap-2.5">
              <Avatar />
              <div className="rounded-2xl rounded-tl-md bg-bg-card border border-border px-4 py-3">
                <span className="sr-only">{t('thinking')}</span>
                <span className="flex items-center gap-1" aria-hidden="true">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}

          {errorCode && (
            <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-3 py-2">
              <p className="flex-1 text-xs text-danger">
                {errorCode === 'timeout' ? t('errorTimeout') : t('errorNetwork')}
              </p>
              <button
                type="button"
                onClick={retry}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-danger hover:bg-danger/10 transition-colors"
              >
                <RotateCcw size={12} />
                {t('retry')}
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestions */}
      {isEmpty && !sending && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {SUGGESTION_KEYS.map((key) => {
            const suggestion = t(`suggestions.${key}`);
            return (
              <button
                key={key}
                type="button"
                onClick={() => send(suggestion)}
                className="flex-shrink-0 rounded-full border border-border bg-bg-card px-3 py-1.5 text-xs text-text-secondary hover:border-primary/40 hover:text-primary transition-colors"
              >
                {suggestion}
              </button>
            );
          })}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2 rounded-2xl border border-border bg-bg-card p-2"
      >
        <textarea
          ref={composerRef}
          value={input}
          rows={1}
          aria-label={t('placeholder')}
          placeholder={t('placeholder')}
          onChange={(event) => {
            setInput(event.target.value);
            const field = event.target;
            field.style.height = 'auto';
            field.style.height = `${Math.min(field.scrollHeight, MAX_COMPOSER_HEIGHT)}px`;
          }}
          onKeyDown={(event) => {
            // Enter sends, but never mid-composition: Thai, Japanese, Korean and
            // Chinese input methods all use Enter to accept a candidate.
            if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
            event.preventDefault();
            send(input);
          }}
          className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          aria-label={t('send')}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-dark disabled:bg-bg-elevated disabled:text-text-muted"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

function Avatar() {
  return (
    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-bg-elevated border border-border">
      <Bot size={14} className="text-primary" />
    </div>
  );
}

import { setRequestLocale } from 'next-intl/server';
import { ChatView } from '@/components/chat/ChatView';

type Props = { params: Promise<{ locale: string }> };

export default async function ChatPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ChatView />;
}

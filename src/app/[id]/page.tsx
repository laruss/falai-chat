'use server';

import { getChat } from '@/lib/chat-store';
import { Message } from '@/lib/types';

import Chat from './chat';

type ChatPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const messages = (await getChat<Message>(id)) || [];

  return <Chat initMessages={messages} id={id} />;
}

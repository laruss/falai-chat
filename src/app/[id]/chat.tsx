'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect } from 'react';

import { ChatInput } from '@/components/chat/chat-input';
import { Conversation } from '@/components/chat/conversation';
import { DragNDrop } from '@/components/chat/drag-n-drop';
import { Header } from '@/components/chat/header';
import { ImageModal } from '@/components/chat/image-modal';
import { useFalAiModel } from '@/lib/hooks/useFalAiModel';
import { useMode } from '@/lib/hooks/useMode';
import { useAppStore } from '@/lib/state/store';
import { Message } from '@/lib/types';

type ChatProps = Readonly<{
  initMessages: Message[];
  id: string;
}>;

export default function Chat({ initMessages, id }: ChatProps) {
  const mode = useMode();
  const model = useFalAiModel({ mode });
  const { setStatus, setError, attachedImages } = useAppStore();

  const { messages, sendMessage, status, error, regenerate, setMessages } =
    useChat<Message>({
      transport: new DefaultChatTransport({
        api: '/api/chat',
      }),
      id,
      messages: initMessages,
    });

  useEffect(() => {
    setStatus(status);
  }, [status, setStatus]);

  useEffect(() => {
    setError(error);
  }, [error, setError]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header selectedModel={model} />

      <Conversation
        messages={messages}
        status={status}
        regenerate={regenerate}
        setMessages={setMessages}
      />

      <ChatInput
        status={status}
        messages={messages}
        sendMessage={sendMessage}
      />

      <ImageModal messages={messages} />
      {Boolean(messages.length || attachedImages.length) && <DragNDrop />}
    </div>
  );
}

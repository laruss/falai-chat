'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ChatInput } from '@/components/chat/chat-input';
import { Conversation } from '@/components/chat/conversation';
import { Header } from '@/components/chat/header';
import { ImageModal } from '@/components/chat/image-modal';
import { FalAiModels, MODEL_CAPABILITIES } from '@/lib/falai';
import { IMAGE_SIZES, MODELS } from '@/lib/falai/constants';
import { ImageSize } from '@/lib/falai/types';
import { convertFilesToDataURLs } from '@/lib/helpers';
import { Message } from '@/lib/types';

type ChatProps = Readonly<{
  initMessages: Message[];
  id: string;
}>;

export default function Chat({ initMessages, id }: ChatProps) {
  const { messages, sendMessage, status, error } = useChat<Message>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    id,
    messages: initMessages,
  });
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null);
  const [attachedImages, setAttachedImages] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState<FalAiModels>(MODELS.SANA);
  const [imageSize, setImageSize] = useState<ImageSize>(IMAGE_SIZES.SQUARE_HD);

  useEffect(() => {
    if (status === 'error' && error) {
      toast.error(error.message || 'An error occurred');
    }
  }, [error, status]);

  useEffect(() => {
    if (!MODEL_CAPABILITIES[selectedModel].canEditImages) {
      setAttachedImages([]);
      setSelectedImage(null);
      const toasts = toast.getToasts();
      if (toasts.length > 0) {
        toasts.forEach((t) => toast.dismiss(t.id));
      }
      toast(
        'The selected model does not support image editing. Attaching and replying to images has been disabled.'
      );
    } else {
      const toasts = toast.getToasts();
      if (toasts.length > 0) {
        toasts.forEach((t) => toast.dismiss(t.id));
      }
      toast(
        'The selected model supports image editing. Attaching and replying to images has been enabled.'
      );
    }
  }, [selectedModel]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === 'ready') {
      const fileParts =
        attachedImages.length > 0
          ? await convertFilesToDataURLs(attachedImages)
          : [];

      await sendMessage({
        role: 'user',
        parts: [{ type: 'text', text: input }, ...fileParts],
        metadata: {
          model: selectedModel,
          useMessageId: replyToMessageId || undefined,
          settings: {
            image_size: imageSize,
          },
        },
      });
      setInput('');
      setReplyToMessageId(null);
      setAttachedImages([]);
    }
  };

  const handleAttachImages = (files: File[]) => {
    setAttachedImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setAttachedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header selectedModel={selectedModel} onModelChange={setSelectedModel} />

      <Conversation
        messages={messages}
        status={status}
        onImageClick={setSelectedImage}
        canReplyToMessage={MODEL_CAPABILITIES[selectedModel].canEditImages}
        onReplyToMessage={setReplyToMessageId}
      />

      <ChatInput
        input={input}
        status={status}
        messages={messages}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        replyToMessageId={replyToMessageId}
        onClearReply={() => setReplyToMessageId(null)}
        attachedImages={attachedImages}
        canAttachImages={MODEL_CAPABILITIES[selectedModel].canEditImages}
        canGenerateImage={MODEL_CAPABILITIES[selectedModel].canGenerateImages}
        onAttachImages={handleAttachImages}
        onRemoveImage={handleRemoveImage}
        imageSize={imageSize}
        onImageSizeChange={setImageSize}
      />

      <ImageModal
        imageUrl={selectedImage}
        messages={messages}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}

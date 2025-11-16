'use client';

import { ChatStatus } from 'ai';
import { Paperclip, Send, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';

import { Attachments } from '@/components/chat/attachments';
import { useImageSize } from '@/components/chat/chat-input/useImageSize';
import { ImageSizeSelector } from '@/components/chat/image-size-selector';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MODES } from '@/lib/falai';
import { useAppStore } from '@/lib/state/store';
import { Message } from '@/lib/types';

import { useHandleSubmit, UseHandleSubmitProps } from './useHandleSubmit';
import { useReplyImageUrl } from './useReplyImageUrl';

interface ChatInputProps {
  status: ChatStatus;
  messages: Message[];
  sendMessage: UseHandleSubmitProps['sendMessage'];
}

export function ChatInput({ status, messages, sendMessage }: ChatInputProps) {
  const {
    setReplyMessageId,
    mode,
    replyMessageId,
    attachedImages,
    editingMessageId,
  } = useAppStore();
  const [input, setInput] = useState('');
  const { imageSize, setImageSize } = useImageSize();
  const canAttachImages = mode !== MODES.GENERATE;
  const isEditingMessage = Boolean(editingMessageId);

  const replyImageUrl = useReplyImageUrl({ messages });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onSubmit = useHandleSubmit({
    sendMessage,
    input,
    setInput,
    imageSize,
  });

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    const lineHeight = 24; // Approximate line height
    const minLines = 3;
    const maxLines = 8;
    const lines = Math.min(
      Math.max(Math.ceil(textarea.scrollHeight / lineHeight), minLines),
      maxLines
    );
    textarea.style.height = `${lines * lineHeight}px`;
  };

  const handleSubmit = async (e: FormEvent) => {
    const promise = onSubmit(e);
    // Reset textarea height after submit
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${3 * 24}px`; // Reset to minLines
    }
    await promise;
  };

  if (
    mode !== MODES.GENERATE &&
    messages.length === 0 &&
    attachedImages.length === 0
  ) {
    return null;
  }

  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm p-4">
      <div className="max-w-4xl mx-auto">
        {replyImageUrl && (
          <div className="mb-2 flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
            <span className="text-sm text-gray-600">Using image</span>
            <div className="relative">
              <Image
                src={replyImageUrl}
                alt="Reply to image"
                width={40}
                height={40}
                className="rounded object-cover"
              />
            </div>
            <button
              onClick={() => setReplyMessageId()}
              className="ml-auto p-1 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Cancel reply"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        )}
        <Attachments ref={fileInputRef} canAttachImages={canAttachImages} />
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 items-start relative"
        >
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={
                !['ready', 'error'].includes(status) || isEditingMessage
              }
              placeholder={
                isEditingMessage
                  ? 'Editing message...'
                  : 'Input your prompt... (Shift+Enter for new line)'
              }
              className="flex-1 min-h-[72px] max-h-[192px] resize-none pr-10"
              rows={3}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <ImageSizeSelector
                imageSize={imageSize}
                onImageSizeChange={setImageSize}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={
                      status !== 'ready' || !canAttachImages || isEditingMessage
                    }
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Attach file"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {!canAttachImages
                    ? 'Attaching images is disabled for the selected model'
                    : 'Attach image'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Button
            type="submit"
            disabled={
              status !== 'ready' ||
              !input.trim() ||
              (canAttachImages && !attachedImages?.length && !replyMessageId) ||
              isEditingMessage
            }
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </footer>
  );
}

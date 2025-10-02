import { ChatStatus } from 'ai';
import { Paperclip, Send, X } from 'lucide-react';
import Image from 'next/image';
import { FormEvent, useMemo, useRef } from 'react';

import { Attachments } from '@/components/chat/attachments';
import { ImageSizeSelector } from '@/components/chat/image-size-selector';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ImageSize } from '@/lib/falai/types';
import { Message } from '@/lib/types';

interface ChatInputProps {
  input: string;
  status: ChatStatus;
  messages: Message[];
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  replyToMessageId?: string | null;
  onClearReply?: () => void;
  attachedImages?: File[];
  onAttachImages?: (files: File[]) => void;
  onRemoveImage?: (index: number) => void;
  canAttachImages: boolean;
  canGenerateImage: boolean;
  imageSize: ImageSize;
  onImageSizeChange: (size: ImageSize) => void;
}

export function ChatInput({
  input,
  status,
  messages,
  onInputChange,
  onSubmit,
  replyToMessageId,
  onClearReply,
  attachedImages = [],
  canAttachImages,
  canGenerateImage,
  onAttachImages,
  onRemoveImage,
  imageSize,
  onImageSizeChange,
}: ChatInputProps) {
  const replyToImage = useMemo(() => {
    if (!replyToMessageId) return null;

    const message = messages.find((msg) => msg.id === replyToMessageId);
    if (!message) return null;

    const imagePart = message.parts.find(
      (part) => part.type === 'file' && part.mediaType?.startsWith('image/')
    );

    return imagePart?.type === 'file' ? imagePart.url : null;
  }, [replyToMessageId, messages]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);

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

  const handleSubmit = (e: React.FormEvent) => {
    onSubmit(e);
    // Reset textarea height after submit
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${3 * 24}px`; // Reset to minLines
    }
  };

  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm p-4">
      <div className="max-w-4xl mx-auto">
        {replyToImage && (
          <div className="mb-2 flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
            <span className="text-sm text-gray-600">Using image</span>
            <div className="relative">
              <Image
                src={replyToImage}
                alt="Reply to image"
                width={40}
                height={40}
                className="rounded object-cover"
              />
            </div>
            {onClearReply && (
              <button
                onClick={onClearReply}
                className="ml-auto p-1 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Cancel reply"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        )}
        <Attachments
          ref={fileInputRef}
          attachedImages={attachedImages}
          onAttachImages={onAttachImages}
          onRemoveImage={onRemoveImage}
          canAttachImages={canAttachImages}
          disabled={status !== 'ready'}
        />
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
              disabled={!['ready', 'error'].includes(status)}
              placeholder="Input your prompt... (Shift+Enter for new line)"
              className="flex-1 min-h-[72px] max-h-[192px] resize-none pr-10"
              rows={3}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <ImageSizeSelector
                imageSize={imageSize}
                onImageSizeChange={onImageSizeChange}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={status !== 'ready' || !canAttachImages}
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
              (!canGenerateImage &&
                !attachedImages?.length &&
                !replyToMessageId)
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

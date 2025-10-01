import { ChatStatus } from 'ai';
import { Paperclip, Send, X } from 'lucide-react';
import Image from 'next/image';
import { FormEvent, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  const [isDragging, setIsDragging] = useState(false);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canAttachImages) return;

    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length > 0 && onAttachImages) {
      onAttachImages(imageFiles);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!canAttachImages) return;

    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!canAttachImages) return;

    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length > 0 && onAttachImages) {
      onAttachImages(imageFiles);
    }
  };

  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm p-4">
      <div
        className="max-w-4xl mx-auto"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
        {attachedImages.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachedImages.map((file, index) => (
              <div
                key={index}
                className="relative group bg-gray-100 rounded-lg p-1"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
                {onRemoveImage && (
                  <button
                    onClick={() => onRemoveImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 items-start relative"
        >
          {isDragging && (
            <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center z-10 pointer-events-none">
              <p className="text-blue-600 font-medium">Drop images here</p>
            </div>
          )}
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
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={status !== 'ready' || !canAttachImages}
                  className="absolute right-2 bottom-2 p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
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

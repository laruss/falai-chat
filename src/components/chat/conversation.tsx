import {
  Check,
  Download,
  Loader2,
  Pen,
  Reply,
  RotateCw,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useCanReplyOnMessages } from '@/lib/hooks/useCanReplyOnMessages';
import { useAppStore } from '@/lib/state/store';
import { Message } from '@/lib/types';

import { ConversationEmpty } from './conversation-empty';

interface ConversationProps {
  messages: Message[];
  status: 'ready' | 'submitted' | 'streaming' | 'error';
  regenerate: () => void;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void;
}

export function Conversation({
  messages,
  status,
  regenerate,
  setMessages,
}: ConversationProps) {
  const {
    setOpenedImage,
    setReplyMessageId,
    attachedImages,
    editingMessageId,
    setEditingMessageId,
  } = useAppStore();
  const canReplyToMessage = useCanReplyOnMessages();

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);
  const [editText, setEditText] = useState<string>('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (editingMessageId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingMessageId]);

  const handleStartEdit = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setEditText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingMessageId();
    setEditText('');
  };

  const handleSubmitEdit = () => {
    if (!editingMessageId || !editText.trim()) return;

    // Find the index of the message being edited
    const messageIndex = messages.findIndex(
      (msg) => msg.id === editingMessageId
    );
    if (messageIndex === -1) return;

    // Update the message with new text
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const message = updatedMessages[messageIndex];

      // Update the text part
      const textPartIndex = message.parts.findIndex((p) => p.type === 'text');
      if (textPartIndex !== -1) {
        updatedMessages[messageIndex] = {
          ...message,
          parts: message.parts.map((part, idx) =>
            idx === textPartIndex ? { ...part, text: editText.trim() } : part
          ),
        };
      }

      // Remove all messages after the edited one
      return updatedMessages.slice(0, messageIndex + 1);
    });

    // Clear edit state
    setEditingMessageId();
    setEditText('');

    // Regenerate AI response
    setTimeout(() => {
      regenerate();
    }, 100);
  };

  const lastUserMessage = messages.filter((m) => m.role === 'user').pop();

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-4 p-4 max-w-4xl mx-auto">
          {messages.length === 0 &&
            status === 'ready' &&
            attachedImages.length === 0 && <ConversationEmpty />}
          {messages.map((message, messageIndex) => {
            if (message.parts.length === 0) return null;

            const isLastMessage = messageIndex === messages.length - 1;
            const isLastUserMessage = lastUserMessage?.id === message.id;
            const isAssistantMessage = message.role === 'assistant';

            return (
              <div
                key={message.id}
                data-message-id={message.id}
                className={`flex gap-3 items-end transition-all duration-300 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                } ${
                  highlightedMessageId === message.id
                    ? 'bg-white -mx-2 px-2 py-1'
                    : ''
                }`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback
                    className={
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-500 text-white'
                    }
                  >
                    {message.role === 'user' ? 'U' : 'AI'}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`relative flex flex-col gap-2 max-w-[70%] ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                  onMouseEnter={() =>
                    message.role === 'user' &&
                    isLastUserMessage &&
                    setHoveredMessageId(message.id)
                  }
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  {message.metadata?.useMessageId &&
                    (() => {
                      const replyToMessage = messages.find(
                        (msg) => msg.id === message.metadata?.useMessageId
                      );
                      if (!replyToMessage) return null;

                      const textPart = replyToMessage.parts.find(
                        (p) => p.type === 'text'
                      );
                      const imagePart = replyToMessage.parts.find(
                        (p) =>
                          p.type === 'file' && p.mediaType?.startsWith('image/')
                      );

                      return (
                        <button
                          onClick={() => {
                            const messageId = message.metadata?.useMessageId;
                            if (!messageId) return;

                            const replyElement = document.querySelector(
                              `[data-message-id="${messageId}"]`
                            );
                            replyElement?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center',
                            });

                            // Highlight the message
                            setHighlightedMessageId(messageId);
                            setTimeout(
                              () => setHighlightedMessageId(null),
                              1000
                            );
                          }}
                          className={`text-xs bg-gray-100 hover:bg-gray-200 rounded-lg p-2 flex items-start gap-2 max-w-[300px] transition-colors ${
                            message.role === 'user' ? 'self-end' : 'self-start'
                          }`}
                        >
                          <Reply className="h-3 w-3 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 text-left overflow-hidden">
                            <div className="text-gray-500 font-medium mb-1">
                              {replyToMessage.role === 'user' ? 'You' : 'AI'}
                            </div>
                            {textPart && (
                              <div className="text-gray-700 truncate">
                                {textPart.text}
                              </div>
                            )}
                            {imagePart && imagePart.type === 'file' && (
                              <div className="text-gray-500 italic">
                                📷 Image
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })()}
                  {message.role === 'user'
                    ? // User message: show text + image previews in one bubble
                      (() => {
                        const isEditing = editingMessageId === message.id;
                        const showEditIcon =
                          isLastUserMessage &&
                          hoveredMessageId === message.id &&
                          !editingMessageId &&
                          (status === 'ready' || status === 'error');

                        const textPart = message.parts.find(
                          (p) => p.type === 'text'
                        );
                        const imageParts = message.parts.filter(
                          (p) =>
                            p.type === 'file' &&
                            p.mediaType.startsWith('image/')
                        );

                        return (
                          <div className="relative">
                            {isEditing ? (
                              <div className="flex flex-col gap-2 min-w-[300px]">
                                <Textarea
                                  ref={textareaRef}
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleSubmitEdit();
                                    } else if (e.key === 'Escape') {
                                      e.preventDefault();
                                      handleCancelEdit();
                                    }
                                  }}
                                  className="min-h-[72px] resize-none bg-blue-500 text-white border-blue-400 focus:border-blue-300 placeholder:text-blue-200"
                                  placeholder="Edit your message..."
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={handleCancelEdit}
                                    className="p-2 hover:bg-blue-400 rounded-full transition-colors bg-blue-500"
                                    aria-label="Cancel edit"
                                  >
                                    <X className="h-4 w-4 text-white" />
                                  </button>
                                  <button
                                    onClick={handleSubmitEdit}
                                    disabled={!editText.trim()}
                                    className="p-2 hover:bg-blue-400 rounded-full transition-colors bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Save edit"
                                  >
                                    <Check className="h-4 w-4 text-white" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-lg bg-blue-500 text-white">
                                <div className="px-4 py-2">
                                  {/* Image previews */}
                                  {imageParts.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {imageParts.map((part, idx) => (
                                        <div
                                          key={idx}
                                          className="relative cursor-pointer hover:opacity-90 transition-opacity"
                                          onClick={() =>
                                            part.type === 'file' &&
                                            setOpenedImage(part.url)
                                          }
                                        >
                                          <Image
                                            src={
                                              part.type === 'file'
                                                ? part.url
                                                : ''
                                            }
                                            alt="Attached image"
                                            width={80}
                                            height={80}
                                            className="rounded object-cover w-20 h-20"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {/* Text content */}
                                  {textPart && textPart.type === 'text' && (
                                    <div>{textPart.text}</div>
                                  )}
                                </div>
                                {/* Footer - always visible */}
                                <div className="px-2 pb-2 pt-1 flex justify-start">
                                  {isLastUserMessage && (
                                    <button
                                      onClick={() =>
                                        handleStartEdit(
                                          message.id,
                                          textPart && textPart.type === 'text'
                                            ? textPart.text
                                            : ''
                                        )
                                      }
                                      className={`p-1 hover:bg-blue-400 rounded-full transition-all ${
                                        showEditIcon
                                          ? 'opacity-100'
                                          : 'opacity-0 pointer-events-none'
                                      }`}
                                      aria-label="Edit message"
                                    >
                                      <Pen className="h-3 w-3 text-white" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()
                    : // Assistant message: render parts separately (existing behavior)
                      message.parts.map((part, index) => {
                        if (part.type === 'text') {
                          return (
                            <div
                              key={index}
                              className="rounded-lg px-4 py-2 bg-gray-200 text-gray-900"
                            >
                              {part.text}
                            </div>
                          );
                        } else if (
                          part.type === 'file' &&
                          part.mediaType.startsWith('image/')
                        ) {
                          return (
                            <div
                              key={index}
                              className="relative group"
                              onMouseEnter={() => setHoveredImage(part.url)}
                              onMouseLeave={() => setHoveredImage(null)}
                            >
                              <Image
                                width={400}
                                height={400}
                                src={part.url}
                                alt="Generated image"
                                className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setOpenedImage(part.url)}
                              />
                              {hoveredImage === part.url && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const link = document.createElement('a');
                                    link.href = part.url;
                                    link.download = `image-${Date.now()}.png`;
                                    link.click();
                                  }}
                                  className="absolute top-2 left-2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                                  aria-label="Download image"
                                >
                                  <Download className="h-4 w-4 text-gray-700" />
                                </button>
                              )}
                              {hoveredImage === part.url &&
                                canReplyToMessage && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setReplyMessageId(message.id);
                                    }}
                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                                    aria-label="Reply to this image"
                                  >
                                    <Reply className="h-4 w-4 text-gray-700" />
                                  </button>
                                )}
                              {hoveredImage === part.url &&
                                isLastMessage &&
                                isAssistantMessage &&
                                (status === 'ready' || status === 'error') && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      regenerate();
                                    }}
                                    className="absolute bottom-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                                    aria-label="Regenerate image"
                                  >
                                    <RotateCw className="h-4 w-4 text-gray-700" />
                                  </button>
                                )}
                            </div>
                          );
                        }
                      })}
                </div>
              </div>
            );
          })}

          {status === 'submitted' ||
            (status === 'streaming' && (
              <div className="flex gap-3 items-end">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gray-500 text-white">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 rounded-lg px-4 py-2 bg-gray-200">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">
                    Generating image...
                  </span>
                </div>
              </div>
            ))}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>
    </div>
  );
}

import { Loader2, Reply } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EMPTY_CHAT_CAPTION } from '@/constants';
import { Message } from '@/lib/types';

interface ConversationProps {
  messages: Message[];
  status: 'ready' | 'submitted' | 'streaming' | 'error';
  onImageClick: (url: string) => void;
  canReplyToMessage: boolean;
  onReplyToMessage?: (messageId: string) => void;
}

export function Conversation({
  messages,
  status,
  onImageClick,
  onReplyToMessage,
  canReplyToMessage,
}: ConversationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-4 p-4 max-w-4xl mx-auto">
          {messages.length === 0 && status === 'ready' && (
            <div className="flex items-center justify-center h-[60vh]">
              <p className="text-gray-400 text-lg">{EMPTY_CHAT_CAPTION}</p>
            </div>
          )}
          {messages.map((message) => {
            if (message.parts.length === 0) return null;

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
                  className={`flex flex-col gap-2 max-w-[70%] ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  }`}
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
                  {message.parts.map((part, index) => {
                    if (part.type === 'text') {
                      return (
                        <div
                          key={index}
                          className={`rounded-lg px-4 py-2 ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
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
                            onClick={() => onImageClick(part.url)}
                          />
                          {hoveredImage === part.url &&
                            canReplyToMessage &&
                            onReplyToMessage && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onReplyToMessage(message.id);
                                }}
                                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                                aria-label="Reply to this image"
                              >
                                <Reply className="h-4 w-4 text-gray-700" />
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

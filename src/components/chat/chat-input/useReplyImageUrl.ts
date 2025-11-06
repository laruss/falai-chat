import { useMemo } from 'react';

import { useAppStore } from '@/lib/state/store';
import { Message } from '@/lib/types';

type Props = Readonly<{
  messages: Array<Message>;
}>;

export const useReplyImageUrl = ({ messages }: Props) => {
  const { replyMessageId } = useAppStore();

  return useMemo(() => {
    if (!replyMessageId) return null;

    const message = messages.find((msg) => msg.id === replyMessageId);
    if (!message) return null;

    const imagePart = message.parts.find(
      (part) => part.type === 'file' && part.mediaType?.startsWith('image/')
    );

    return imagePart?.type === 'file' ? imagePart.url : null;
  }, [replyMessageId, messages]);
};

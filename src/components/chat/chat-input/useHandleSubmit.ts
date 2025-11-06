import { UseChatHelpers } from '@ai-sdk/react';
import { FormEvent, useCallback } from 'react';

import { ImageSize } from '@/lib/falai';
import { convertFilesToDataURLs } from '@/lib/helpers';
import { useAppStore } from '@/lib/state/store';
import { Message } from '@/lib/types';

export type UseHandleSubmitProps = Readonly<{
  sendMessage: UseChatHelpers<Message>['sendMessage'];
  input: string;
  setInput: (value: string) => void;
  imageSize: ImageSize;
}>;

export const useHandleSubmit = ({
  sendMessage,
  input,
  setInput,
  imageSize,
}: UseHandleSubmitProps) => {
  const {
    status,
    model,
    replyMessageId,
    setReplyMessageId,
    attachedImages,
    setAttachedImages,
  } = useAppStore();

  return useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!model) {
        return;
      }

      if (input.trim() && status === 'ready') {
        const fileParts =
          attachedImages.length > 0
            ? await convertFilesToDataURLs(attachedImages)
            : [];

        const promise = sendMessage({
          role: 'user',
          parts: [{ type: 'text', text: input }, ...fileParts],
          metadata: {
            model,
            useMessageId: replyMessageId,
            settings: {
              image_size: imageSize,
            },
          },
        });
        setInput('');
        setReplyMessageId();
        setAttachedImages([]);
        await promise;
      }
    },
    [
      sendMessage,
      input,
      status,
      attachedImages,
      model,
      replyMessageId,
      imageSize,
      setInput,
      setReplyMessageId,
      setAttachedImages,
    ]
  );
};

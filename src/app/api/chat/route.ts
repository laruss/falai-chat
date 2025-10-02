'use server';

import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { file } from 'bun';

import { STATIC_FOLDER } from '@/constants';
import { saveChat } from '@/lib/chat-store';
import { generateImage } from '@/lib/falai';
import { tryCatch } from '@/lib/helpers';
import { ApiRequest, Message } from '@/lib/types';

import {
  createErrorResponse,
  getLastMessageData,
  getSettings,
} from './helpers';

export async function POST(req: ApiRequest) {
  const { messages, id } =
    await req.json<Readonly<{ messages: Message[]; id: string }>>();

  const settings = getSettings(messages);

  const { result: messageData, error } = await tryCatch(async () =>
    getLastMessageData(messages)
  );
  if (error) {
    return createErrorResponse(error);
  }

  const stream = createUIMessageStream<Message>({
    originalMessages: messages,
    execute: async ({ writer }) => {
      // Write start event
      writer.write({ type: 'start' });

      const { image } = await generateImage({
        model: messageData.model,
        prompt: messageData.text,
        options: {
          ...settings,
          image_urls: messageData.media.map((file) => file.url),
        },
      });

      const filename = `image-${Date.now()}.png`;
      const imageFile = file(`${STATIC_FOLDER}/${filename}`);
      await imageFile.write(image.uint8Array);

      writer.write({
        type: 'file',
        url: `data:${image.mediaType};base64,${image.base64}`,
        mediaType: image.mediaType,
      });
    },
    onError: (error) => {
      return error instanceof Error
        ? error.message
        : 'An error occurred while generating the image';
    },
    onFinish: async ({ messages }) => {
      await saveChat(id, messages);
    },
  });

  return createUIMessageStreamResponse({ stream });
}

'use server';

import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  GeneratedFile,
} from 'ai';
import { file } from 'bun';

import { STATIC_FOLDER } from '@/constants';
import { saveChat } from '@/lib/chat-store';
import {
  FLUX_KONTEXT_ASPECT_RATIO_IMAGE_SIZE_MAPPER,
  FluxKontextAspectRatio,
  generateImage,
  ImageSizeVariants,
  MODELS,
} from '@/lib/falai';
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

      let image: GeneratedFile;

      const {
        image_size,
        enable_safety_checker,
        negative_prompt,
        acceleration,
        ...fluxSettings
      } = settings;

      // separate flow to handle flux kontext
      if (messageData?.model === MODELS.FLUX_KONTEXT) {
        let aspect_ratio: FluxKontextAspectRatio = '1:1';
        if (
          FLUX_KONTEXT_ASPECT_RATIO_IMAGE_SIZE_MAPPER[
            image_size as ImageSizeVariants
          ]
        ) {
          aspect_ratio =
            FLUX_KONTEXT_ASPECT_RATIO_IMAGE_SIZE_MAPPER[
              image_size as ImageSizeVariants
            ];
        }
        const result = await generateImage({
          model: MODELS.FLUX_KONTEXT,
          prompt: messageData.text,
          options: {
            ...fluxSettings,
            safety_tolerance: '6' as const,
            enhance_prompt: false,
            aspect_ratio,
            image_url: messageData.media[0].url,
          },
        });
        console.warn('flux kontext result', result);
        image = result.image;
      } else {
        const result = await generateImage({
          model: messageData.model,
          prompt: messageData.text,
          options: {
            ...settings,
            ...(messageData.model === MODELS.FLUX_2_FLEX
              ? { safety_tolerance: '5' as const }
              : {}),
            image_urls: messageData.media.map((file) => file.url),
          },
        });
        image = result.image;
      }

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

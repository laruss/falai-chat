import { UIMessage } from 'ai';
import { z } from 'zod';

import { IMAGE_SIZES, MODELS } from '@/lib/falai';

export interface ApiRequest extends Request {
  json: <T>() => Promise<T>;
}

export const imageSizeSchema = z
  .enum([...Object.values(IMAGE_SIZES)])
  .or(z.object({ width: z.number(), height: z.number() }));

export const settingsSchema = z
  .object({
    image_size: imageSizeSchema.optional().default(IMAGE_SIZES.SQUARE_HD),
    num_inference_steps: z.number().optional(),
    seed: z.number().optional(),
    guidance_scale: z.number().optional(),
    num_images: z.number().optional().default(1),
    enable_safety_checker: z.boolean().optional().default(false),
    output_format: z.enum(['jpeg', 'png']).optional().default('png'),
    negative_prompt: z.string().optional(),
    acceleration: z.enum(['none', 'regular']).optional().default('regular'),
  })
  .partial();

export const messageMetadataSchema = z.object({
  model: z.enum(Object.values(MODELS)),
  useMessageId: z.string().optional(),
  settings: settingsSchema.optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type Message = UIMessage<MessageMetadata>;

export type MaybePromise<T> = T | Promise<T>;

import { UIMessage } from 'ai';
import { z } from 'zod';

import { MODELS } from '@/lib/falai';

export interface ApiRequest extends Request {
  json: <T>() => Promise<T>;
}

export const messageMetadataSchema = z.object({
  model: z.enum(Object.values(MODELS)),
  useMessageId: z.string().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type Message = UIMessage<MessageMetadata>;

export type MaybePromise<T> = T | Promise<T>;

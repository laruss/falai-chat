import { FileUIPart } from 'ai';

import { FalAiModels } from '@/lib/falai';
import { Message } from '@/lib/types';

const getMediaFromMessage = (message: Message) => {
  return message.parts.filter((part) => part.type === 'file');
};

const getTextFromMessage = (message: Message) =>
  message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('');

/**
 * Extracts and returns the data of the last message in a given array of messages.
 *
 * This function retrieves metadata from the last message, including the model type,
 * text content, and associated media files. If the last message specifies a dependency
 * on another message (via `useMessageId`), the corresponding media from that message
 * is also included in the response.
 *
 * Throws an error if the last message has no metadata or if the specified `useMessageId`
 * does not correspond to an existing message.
 *
 * @param {Array<Message>} messages - An array of message objects. Each message is expected
 *                                    to have a metadata property containing information
 *                                    relevant to the processing of the last message.
 * @returns An object containing the following properties:
 *  - `model` {FalAiModels}: The model type specified in the last message's metadata.
 *  - `text` {string}: The text content of the last message.
 *  - `media` {Array<FileUIPart>}: An array of media files associated with the last message,
 *                                  including any media from a linked `useMessageId` if applicable.
 * @throws {Error} Throws an error if the last message does not contain metadata or if a
 *                 message specified by `useMessageId` is not found in the array.
 */
export const getLastMessageData = (messages: Array<Message>) => {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage.metadata) {
    throw new Error('No metadata found in the last message');
  }
  const allMedia = [] as Array<FileUIPart>;

  const model = lastMessage.metadata.model as FalAiModels;
  const useMessageId = lastMessage.metadata.useMessageId;
  if (useMessageId) {
    const message = messages.find((msg) => msg.id === useMessageId);
    if (!message) {
      throw new Error(`Message with useMessageId ${useMessageId} not found`);
    }
    const media = getMediaFromMessage(message);
    allMedia.push(...media);
  }
  const media = getMediaFromMessage(lastMessage);
  allMedia.push(...media);

  return {
    model,
    text: getTextFromMessage(lastMessage),
    media: allMedia,
  };
};

/**
 * Constructs an HTTP error response object with a JSON-formatted error message.
 *
 * @param {Error} error - The error object whose message will be included in the response.
 * @param {number} [status=500] - The HTTP status code for the response. Defaults to 500 if not specified.
 * @returns {Response} A Response object containing the error message and specified HTTP status code.
 */
export const createErrorResponse = (
  error: Error,
  status: number = 500
): Response =>
  new Response(JSON.stringify({ error: error.message }), { status });

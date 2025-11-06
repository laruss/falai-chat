'use server';

import { readdir } from 'node:fs/promises';

import { UIMessage } from 'ai';
import { BunFile, file } from 'bun';

import { STATIC_FOLDER } from '@/constants';

const CHATS_FOLDER = `${STATIC_FOLDER}/chats`;

const getChatFile = (id: string) => file(`${CHATS_FOLDER}/${id}.json`);

export async function createChat(id: string) {
  const chatFile = getChatFile(id);
  await chatFile.write('[]');
}

export async function getChat<T extends UIMessage>(
  id: string
): Promise<T[] | null> {
  try {
    const chatFile = getChatFile(id);
    return ((await chatFile.json()) as T[]) || null;
  } catch (error) {
    console.warn(`Error reading chat file for id ${id}:`, error);
    return null;
  }
}

export async function getChatIds(): Promise<string[]> {
  try {
    return (await readdir(CHATS_FOLDER))
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => fileName.replace('.json', ''));
  } catch (error) {
    console.error('Error reading chat files:', error);
    return [];
  }
}

export async function saveChat<T extends UIMessage>(
  id: string,
  chat: T[]
): Promise<void> {
  let chatFile: BunFile | undefined;
  try {
    chatFile = getChatFile(id);
  } catch (error) {
    console.warn(
      `Error reading chat file for id ${id}:`,
      error,
      'Creating new chat file.'
    );
    await createChat(id);
    chatFile = getChatFile(id);
  }
  await chatFile.write(JSON.stringify(chat, null, 2));
}

export async function deleteChat(id: string): Promise<void> {
  const chatFile = getChatFile(id);
  await chatFile.delete();
}

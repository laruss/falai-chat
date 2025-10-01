'use server';

import { readdir } from 'node:fs/promises';

import { generateId, UIMessage } from 'ai';
import { file } from 'bun';

import { STATIC_FOLDER } from '@/constants';

const CHATS_FOLDER = `${STATIC_FOLDER}/chats`;

const getChatFile = (id: string) => file(`${CHATS_FOLDER}/${id}.json`);

export async function createChat(): Promise<string> {
  const id = generateId();
  const chatFile = getChatFile(id);
  await chatFile.write('[]');
  return id;
}

export async function getChat<T extends UIMessage>(
  id: string
): Promise<T[] | null> {
  const chatFile = getChatFile(id);
  return ((await chatFile.json()) as T[]) || null;
}

export async function getChatIds(): Promise<string[]> {
  try {
    return (await readdir(CHATS_FOLDER))
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => fileName.replace('.json', ''));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error reading chat files:', error);
    return [];
  }
}

export async function saveChat<T extends UIMessage>(
  id: string,
  chat: T[]
): Promise<void> {
  const chatFile = getChatFile(id);
  await chatFile.write(JSON.stringify(chat, null, 2));
}

export async function deleteChat(id: string): Promise<void> {
  const chatFile = getChatFile(id);
  await chatFile.delete();
}

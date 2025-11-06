import { stat } from 'node:fs/promises';

import { STATIC_FOLDER } from '@/constants';
import { getChatIds } from '@/lib/chat-store';

import MainPageClient from './main-page-client';

export default async function MainPage() {
  const chatIds = await getChatIds();

  // Get last 3 chats sorted by modification time (newest last)
  const chatsWithTime = await Promise.all(
    chatIds.map(async (id) => {
      try {
        const stats = await stat(`${STATIC_FOLDER}/chats/${id}.json`);
        return { id, mtime: stats.mtime.getTime() };
      } catch {
        return { id, mtime: 0 };
      }
    })
  );

  const recentChats = chatsWithTime
    .sort((a, b) => a.mtime - b.mtime) // oldest first
    .slice(-3) // get last 3
    .map((chat) => chat.id);

  return <MainPageClient recentChats={recentChats} />;
}

'use server';

import { Plus, Trash } from '@mynaui/icons-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createChat, deleteChat, getChatIds } from '@/lib/chat-store';

export default async function MainPage() {
  const chatIds = await getChatIds();

  async function createNewChat() {
    'use server';
    const newId = await createChat();
    redirect(`/${newId}`);
  }

  async function handleDeleteChat(id: string) {
    'use server';
    await deleteChat(id);
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold" data-heading-tag="H1">
            Chat Sessions
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your AI chat sessions
          </p>
        </div>

        <div className="space-y-4">
          {chatIds.length > 0 ? (
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-2">
                {chatIds.map((id) => (
                  <div
                    key={id}
                    className="p-3 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center justify-between gap-2"
                  >
                    <Link href={`/${id}`} className="flex-1">
                      <p className="font-medium">Chat {id}</p>
                    </Link>
                    <form>
                      <Button
                        formAction={handleDeleteChat.bind(null, id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-sm">No chats found</p>
            </div>
          )}

          <form>
            <Button
              formAction={createNewChat}
              className="w-full gap-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Create New Chat
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

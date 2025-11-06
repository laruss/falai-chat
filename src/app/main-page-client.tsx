'use client';

import { Edit, Image, Maximize } from '@mynaui/icons-react';
import { generateId } from 'ai';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

import { FalAiModels, Mode, MODEL_UI_OPTIONS, MODES } from '@/lib/falai';
import { useAppStore } from '@/lib/state/store';

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'Good morning!';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon!';
  } else if (hour >= 17 && hour < 22) {
    return 'Good evening!';
  } else {
    return 'Good night!';
  }
}

interface MainPageClientProps {
  recentChats: string[];
}

function createNewChat(mode: Mode, model: FalAiModels) {
  const newId = generateId();
  const url = new URL(`${window.location.origin}/${newId}`);
  url.searchParams.set('mode', mode);
  url.searchParams.set('model', model);
  redirect(url.toString());
}

const cards = [
  {
    id: MODES.GENERATE,
    title: 'Create an image',
    icon: Image,
    backgroundImage: '/adventure.jpg',
    className: 'col-span-2',
    onClick: () => {
      const model = MODEL_UI_OPTIONS.filter((model) =>
        (model.modes as Array<Mode>).includes(MODES.GENERATE)
      )[0].value;
      createNewChat(MODES.GENERATE, model);
    },
  },
  {
    id: MODES.EDIT,
    title: 'Edit images',
    icon: Edit,
    backgroundImage: '/road.jpg',
    className: 'col-span-1',
    onClick: () => {
      const model = MODEL_UI_OPTIONS.filter((model) =>
        (model.modes as Array<Mode>).includes(MODES.EDIT)
      )[0].value;
      createNewChat(MODES.EDIT, model);
    },
  },
  {
    id: MODES.UPSCALE,
    title: 'Upscale images',
    icon: Maximize,
    backgroundImage: '/waterfall.jpg',
    className: 'col-span-1',
    onClick: () => {
      const model = MODEL_UI_OPTIONS.filter((model) =>
        (model.modes as Array<Mode>).includes(MODES.UPSCALE)
      )[0].value;
      createNewChat(MODES.UPSCALE, model);
    },
    disabled: true,
  },
];

export default function MainPageClient({ recentChats }: MainPageClientProps) {
  const [greeting, setGreeting] = useState('Hello!');
  const { setAttachedImages } = useAppStore();

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Greeting Header - Top of page */}
      <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-6xl font-bold mb-3" data-heading-tag="H1">
            {greeting}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Ready to create something amazing?
          </p>
        </div>
      </div>

      {/* Main Content - Middle of page */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-12">
        {/* Recent Chats */}
        {recentChats.length > 0 && (
          <div className="text-center space-y-2">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Continue your previous chats
            </h2>
            <div className="flex flex-col gap-1">
              {recentChats.map((id) => (
                <Link
                  key={id}
                  href={`/${id}`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:underline transition-colors"
                >
                  Chat {id}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="w-full max-w-4xl">
          {/* Action Cards */}
          <div className="grid grid-cols-2 gap-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    if (!card.disabled) {
                      setAttachedImages([]);
                      card.onClick();
                    }
                  }}
                  disabled={card.disabled}
                  className={`
                  ${card.className}
                  group relative overflow-hidden rounded-2xl
                  h-48 transition-all duration-500 ease-out
                  border-2
                  ${
                    card.disabled
                      ? 'bg-gray-300 dark:bg-gray-700 border-gray-400 dark:border-gray-600 cursor-not-allowed opacity-60'
                      : 'border-gray-200 dark:border-gray-800 hover:scale-[1.02] hover:shadow-2xl cursor-pointer'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                `}
                >
                  {/* Background Image - Only show if not disabled */}
                  {!card.disabled && (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                        style={{
                          backgroundImage: `url(${card.backgroundImage})`,
                        }}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  )}

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center gap-4 p-6">
                    <Icon
                      className={`h-12 w-12 transition-colors duration-500 ${
                        card.disabled
                          ? 'text-gray-500 dark:text-gray-600'
                          : 'text-gray-700 dark:text-gray-300 group-hover:text-white'
                      }`}
                    />
                    <h2
                      className={`text-2xl font-semibold transition-colors duration-500 ${
                        card.disabled
                          ? 'text-gray-600 dark:text-gray-500'
                          : 'text-gray-900 dark:text-gray-100 group-hover:text-white'
                      }`}
                    >
                      {card.title}
                    </h2>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

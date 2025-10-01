import Link from 'next/link';

import { ModelSelect } from '@/components/chat/model-select';
import { Separator } from '@/components/ui/separator';
import { PROJECT_NAME } from '@/constants';
import { FalAiModels } from '@/lib/falai';

interface HeaderProps {
  selectedModel: FalAiModels;
  onModelChange: (model: FalAiModels) => void;
}

export function Header({ selectedModel, onModelChange }: HeaderProps) {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center gap-4">
        <Link href="/">
          <h1 className="text-2xl font-bold" suppressHydrationWarning>
            {PROJECT_NAME}
          </h1>
        </Link>
        <Separator
          orientation="vertical"
          className="min-h-6 w-1 bg-secondary-foreground/30"
        />
        <ModelSelect value={selectedModel} onValueChange={onModelChange} />
      </div>
    </header>
  );
}

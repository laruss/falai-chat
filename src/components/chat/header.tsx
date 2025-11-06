import Link from 'next/link';

import { ModelSelect } from '@/components/chat/model-select';
import { Separator } from '@/components/ui/separator';
import { PROJECT_NAME } from '@/constants';
import { FalAiModels, Mode, MODEL_UI_OPTIONS } from '@/lib/falai';
import { useAppStore } from '@/lib/state/store';

interface HeaderProps {
  selectedModel?: FalAiModels;
}

export function Header({ selectedModel }: HeaderProps) {
  const { setModel, mode, setMode } = useAppStore();

  const onModelChange = (model: FalAiModels) => {
    setModel(model);
    const url = new URL(window.location.href);
    const modelMode: Array<Mode> | undefined = MODEL_UI_OPTIONS.find(
      (m) => m.value === model
    )?.modes;
    if (!modelMode?.includes(mode!)) {
      const newMode = modelMode ? modelMode[0] : 'generate';
      setMode(newMode);
      url.searchParams.set('mode', newMode);
    }
    url.searchParams.set('model', model);
    window.history.replaceState({}, '', url.toString());
  };

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
        <div className="inline-flex items-center gap-2">
          <ModelSelect value={selectedModel} onValueChange={onModelChange} />
          <Separator
            orientation="vertical"
            className="min-h-6 w-1 bg-secondary-foreground/30"
          />
          <div>Mode: {mode}</div>
        </div>
      </div>
    </header>
  );
}

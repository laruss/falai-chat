import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { FalAiModels, Mode, MODEL_UI_OPTIONS } from '@/lib/falai';
import { useAppStore } from '@/lib/state/store';

export const useFalAiModel = ({ mode }: { mode?: Mode }) => {
  const searchParams = useSearchParams();
  const { model, setModel } = useAppStore();

  useEffect(() => {
    const modelParam = searchParams.get('model') as FalAiModels | null;
    if (modelParam && model !== modelParam) {
      setModel(modelParam);
      return;
    } else {
      const modelByMode = MODEL_UI_OPTIONS.find((m) =>
        (m.modes as Array<Mode>).includes(mode as Mode)
      );
      if (modelByMode && model !== modelByMode.value) {
        setModel(modelByMode.value);
      }
    }
  }, [searchParams, mode, model, setModel]);

  return model;
};

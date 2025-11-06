'use client';

import { useMemo } from 'react';

import { Mode, MODEL_UI_OPTIONS, MODES } from '@/lib/falai';
import { useAppStore } from '@/lib/state/store';

export const useCanReplyOnMessages = () => {
  const { model: modelName } = useAppStore();
  return useMemo(() => {
    const model = MODEL_UI_OPTIONS.find((m) => m.value === modelName);
    if (!model) return false;

    const modes = model.modes as Array<Mode>;
    return [MODES.UPSCALE, MODES.EDIT].some((m) => modes.includes(m));
  }, [modelName]);
};

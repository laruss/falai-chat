'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { Mode } from '@/lib/falai';
import { useAppStore } from '@/lib/state/store';

export const useMode = () => {
  const searchParams = useSearchParams();
  const { mode, setMode } = useAppStore();

  useEffect(() => {
    const paramsMode = searchParams.get('mode') as Mode | null;
    if (paramsMode && mode !== paramsMode) {
      setMode(paramsMode);
    }
  }, [searchParams, mode, setMode]);

  return mode;
};

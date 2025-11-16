import { create } from 'zustand';

import { MODELS, MODES } from '@/lib/falai';
import { State } from '@/lib/state/types';

export const useAppStore = create<State>()((set) => ({
  mode: MODES.GENERATE,
  model: MODELS.FLUX_DEV,
  attachedImages: [],
  setModel: (model) => set(() => ({ model })),
  setMode: (mode) => set(() => ({ mode })),
  setOpenedImage: (url) => set(() => ({ openedImage: url })),
  setReplyMessageId: (id) => set(() => ({ replyMessageId: id })),
  setStatus: (status) => set(() => ({ status })),
  setError: (error) => set(() => ({ error })),
  setAttachedImages: (images) => set(() => ({ attachedImages: images })),
  setEditingMessageId: (id) => set(() => ({ editingMessageId: id })),
}));

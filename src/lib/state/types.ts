import { ChatStatus } from 'ai';

import { FalAiModels, Mode } from '@/lib/falai';

export type State = {
  model?: FalAiModels;
  setModel: (model: FalAiModels) => void;
  mode?: Mode;
  setMode: (mode: Mode) => void;
  openedImage?: string;
  setOpenedImage: (url?: string) => void;
  replyMessageId?: string;
  setReplyMessageId: (id?: string) => void;
  status?: ChatStatus;
  setStatus: (status: ChatStatus) => void;
  error?: Error;
  setError: (error?: Error) => void;
  attachedImages: Array<File>;
  setAttachedImages: (images: Array<File>) => void;
  editingMessageId?: string;
  setEditingMessageId: (id?: string) => void;
};

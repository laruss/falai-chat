import { FalAiModels, ModelCapability, ModelUiOption } from './types';

export const MODELS = {
  /**
   * Price: $0.03 per megapixel
   * Model for both creating images and editing them.
   */
  QWEN_IMAGE_EDIT_PLUS: 'fal-ai/qwen-image-edit-plus',
  /**
   * Price: $0.025 per megapixel
   * Model for creating images.
   */
  FLUX_DEV: 'fal-ai/flux/dev',
  /**
   * Price: $0.01 per megapixel (CHEAPEST MODEL)
   * Model for creating images.
   */
  SANA: 'fal-ai/sana/v1.5/4.8b',
} as const satisfies Record<string, FalAiModels>;

export const MODEL_CAPABILITIES = {
  [MODELS.QWEN_IMAGE_EDIT_PLUS]: {
    canGenerateImages: false,
    canEditImages: true,
  },
  [MODELS.FLUX_DEV]: {
    canGenerateImages: true,
    canEditImages: false,
  },
  [MODELS.SANA]: {
    canGenerateImages: true,
    canEditImages: false,
  },
} as const satisfies Record<FalAiModels, ModelCapability>;

export const MODEL_UI_OPTIONS = [
  {
    value: MODELS.QWEN_IMAGE_EDIT_PLUS,
    label: 'Qwen Image Edit Plus',
    description: '$0.03/MP, can only edit images',
  },
  {
    value: MODELS.FLUX_DEV,
    label: 'Flux Dev',
    description: '$0.025/MP, can only generate images',
  },
  {
    value: MODELS.SANA,
    label: 'Sana',
    description: '$0.01/MP, can only generate images',
  },
] as const satisfies ReadonlyArray<ModelUiOption>;

import {
  FalAiModels,
  ImageSizeUiOption,
  ImageSizeVariants,
  ModelCapability,
  ModelUiOption,
} from './types';

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

export const IMAGE_SIZES = {
  SQUARE_HD: 'square_hd',
  SQUARE: 'square',
  PORTRAIT_4_3: 'portrait_4_3',
  PORTRAIT_16_9: 'portrait_16_9',
  LANDSCAPE_4_3: 'landscape_4_3',
  LANDSCAPE_16_9: 'landscape_16_9',
} as const satisfies Record<string, ImageSizeVariants>;

export const IMAGE_SIZE_UI_OPTIONS = [
  {
    value: IMAGE_SIZES.SQUARE_HD,
    label: 'Square HD',
  },
  {
    value: IMAGE_SIZES.SQUARE,
    label: 'Square',
  },
  {
    value: IMAGE_SIZES.PORTRAIT_4_3,
    label: 'Portrait 4:3',
  },
  {
    value: IMAGE_SIZES.PORTRAIT_16_9,
    label: 'Portrait 16:9',
  },
  {
    value: IMAGE_SIZES.LANDSCAPE_4_3,
    label: 'Landscape 4:3',
  },
  {
    value: IMAGE_SIZES.LANDSCAPE_16_9,
    label: 'Landscape 16:9',
  },
] as const satisfies ReadonlyArray<ImageSizeUiOption>;

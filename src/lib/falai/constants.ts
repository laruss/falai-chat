import {
  FalAiModels,
  FluxKontextAspectRatio,
  ImageSizeUiOption,
  ImageSizeVariants,
  Mode,
  ModelUiOption,
} from './types';

export const MODELS = {
  /**
   * Price: $0.03 per megapixel
   * Model for editing images.
   */
  QWEN_IMAGE_EDIT_PLUS: 'fal-ai/qwen-image-edit-plus',
  /**
   * Price: $0.025 per megapixel
   * Model for creating images.
   */
  FLUX_DEV: 'fal-ai/flux/dev',
  /**
   * Price: $0.06 per megapixel
   * Model for creating images.
   * The best model from Flux
   */
  FLUX_2_FLEX: 'fal-ai/flux-2-flex',
  /**
   * Price: $0.01 per megapixel (CHEAPEST MODEL)
   * Model for creating images.
   */
  SANA: 'fal-ai/sana/v1.5/4.8b',
  /**
   * Price: ?? per megapixel (need to check)
   * Model for editing images.
   */
  FLUX_KONTEXT: 'fal-ai/flux-pro/kontext',
} as const satisfies Record<string, FalAiModels>;

export const MODES = {
  GENERATE: 'generate',
  EDIT: 'edit',
  UPSCALE: 'upscale',
} as const satisfies Record<string, Mode>;

export const MODEL_UI_OPTIONS = [
  {
    value: MODELS.QWEN_IMAGE_EDIT_PLUS,
    label: 'Qwen Image Edit Plus',
    description: '$0.03/MP, can only edit images',
    modes: ['edit'],
  },
  {
    value: MODELS.FLUX_DEV,
    label: 'Flux Dev',
    description: '$0.025/MP, can only generate images',
    modes: ['generate'],
  },
  {
    value: MODELS.FLUX_2_FLEX,
    label: 'Flux 2 Flex',
    description: '$0.06/MP, can only generate images',
    modes: ['generate'],
  },
  {
    value: MODELS.SANA,
    label: 'Sana',
    description: '$0.01/MP, can only generate images',
    modes: ['generate'],
  },
  {
    value: MODELS.FLUX_KONTEXT,
    label: 'Flux Kontext Pro',
    description: '$??/MP, can edit images',
    modes: ['edit'],
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

export const FLUX_KONTEXT_ASPECT_RATIO_IMAGE_SIZE_MAPPER = {
  square_hd: '1:1',
  square: '1:1',
  portrait_4_3: '3:4',
  portrait_16_9: '9:16',
  landscape_4_3: '4:3',
  landscape_16_9: '16:9',
} as const satisfies Record<ImageSizeVariants, FluxKontextAspectRatio>;

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

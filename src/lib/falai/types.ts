export type FalAiModels =
  | 'fal-ai/qwen-image-edit-plus'
  | 'fal-ai/flux/dev'
  | 'fal-ai/sana/v1.5/4.8b';

type ImageSizeVariants =
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9';

type ImageSize = { width: number; height: number } | ImageSizeVariants;

type OutputFormats = 'jpeg' | 'png';

type ContentTypes = 'image/jpeg' | 'image/png';

type Acceleration = 'none' | 'regular';

// for now, is used only in sana
type StyleName =
  | '(No style)'
  | 'Cinematic'
  | 'Photographic'
  | 'Anime'
  | 'Manga'
  | 'Digital Art'
  | 'Pixel art'
  | 'Fantasy art'
  | 'Neonpunk'
  | '3D Model';

export type BasicParams = {
  /**
   * The size of the generated image. Default value: square_hd
   */
  image_size?: ImageSize;
  /**
   * The number of inference steps to perform. Default value: 50
   */
  num_inference_steps?: number;
  /**
   * The same seed and the same prompt given to the same version of the model will output the same image every time.
   */
  seed?: number;
  /**
   * The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you.
   * Default value: 4
   */
  guidance_scale?: number;
  /**
   * If set to true, the function will wait for the image to be generated and uploaded before returning the response.
   * This will increase the latency of the function but it allows you to get the image directly in the response without going through the CDN.
   */
  sync_mode?: boolean;
  /**
   * The number of images to generate. Default value: 1
   */
  num_images?: number;
  /**
   * If set to true, the safety checker will be enabled. Default value: true
   */
  enable_safety_checker?: boolean;
  /**
   * The format of the generated image. Default value: "png"
   */
  output_format?: OutputFormats;
  /**
   * The URLs of the images to edit. Can be external URLs or base64 encoded images.
   */
  image_urls?: string[];
  /**
   * The negative prompt for the generation.
   * Default value: ""
   */
  negative_prompt?: string;
  /**
   * Acceleration level for image generation. Options: 'none', 'regular'.
   * Higher acceleration increases speed. 'regular' balances speed and quality.
   * Default value: "regular"
   */
  acceleration?: Acceleration;
};

type QwenImageEditPlusParams = BasicParams;

type FluxDevParams = Omit<BasicParams, 'image_urls' | 'negative_prompt'>;

type SanaParams = Omit<BasicParams, 'image_urls'> & {
  style_name?: StyleName;
};

export type OutputImageSize = Readonly<{
  width: number;
  height: number;
}>;

export type OutputImage = Readonly<{
  url: string;
  width: number;
  height: number;
  content_type: ContentTypes;
  size: OutputImageSize;
}>;

export type Output = Readonly<{
  images: OutputImage[];
  timings: unknown;
  seed: number;
  has_nsfw_concepts: boolean;
  prompt: string;
}>;

export type FalAiModelParamsMap = {
  'fal-ai/qwen-image-edit-plus': QwenImageEditPlusParams;
  'fal-ai/flux/dev': FluxDevParams;
  'fal-ai/sana/v1.5/4.8b': SanaParams;
};

export type ModelCapability = Readonly<{
  canGenerateImages: boolean;
  canEditImages: boolean;
}>;

export type ModelUiOption = Readonly<{
  value: FalAiModels;
  label: string;
  description: string;
}>;

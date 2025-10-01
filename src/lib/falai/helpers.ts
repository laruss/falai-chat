import { fal } from '@ai-sdk/fal';
import { experimental_generateImage } from 'ai';

import { FalAiModelParamsMap, FalAiModels } from './types';

export const generateImage = async <Model extends FalAiModels>({
  model,
  prompt,
  options,
}: {
  model: Model;
  prompt: string;
  options: FalAiModelParamsMap[Model];
}) => {
  return experimental_generateImage({
    model: fal.image(model),
    prompt,
    providerOptions: {
      fal: options,
    },
  });
};

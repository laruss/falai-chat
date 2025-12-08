import { fal } from '@ai-sdk/fal';
import { experimental_generateImage as generateImage } from 'ai';

import { FalAiModelParamsMap, FalAiModels } from './types';

const gI = async <Model extends FalAiModels>({
  model,
  prompt,
  options,
}: {
  model: Model;
  prompt: string;
  options: FalAiModelParamsMap[Model];
}) => {
  return generateImage({
    model: fal.image(model),
    prompt,
    providerOptions: {
      fal: options,
    },
  });
};

export { gI as generateImage };

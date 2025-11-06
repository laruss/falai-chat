import { useEffect, useState } from 'react';

import { ImageSize } from '@/lib/falai';
import { useAppStore } from '@/lib/state/store';

export const useImageSize = () => {
  const { attachedImages } = useAppStore();
  const [imageSize, setImageSize] = useState<ImageSize>('square_hd');

  useEffect(() => {
    if (attachedImages.length === 1) {
      // take the size from the first image
      const image = attachedImages[0];
      if (image.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height });
        };
        img.src = URL.createObjectURL(image);
      }
    }
  }, [attachedImages]);

  return { imageSize, setImageSize };
};

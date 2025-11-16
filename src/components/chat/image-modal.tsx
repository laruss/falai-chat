import { UIMessage } from '@ai-sdk/react';
import { Download } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/state/store';

interface ImageModalProps {
  messages: UIMessage[];
}

export function ImageModal({ messages }: ImageModalProps) {
  const { openedImage: imageUrl, setOpenedImage } = useAppStore();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const allImages = useMemo(() => {
    const images: string[] = [];
    messages.forEach((message) => {
      message.parts.forEach((part) => {
        if (part.type === 'file' && part.mediaType?.startsWith('image/')) {
          images.push(part.url);
        }
      });
    });
    return images;
  }, [messages]);

  const currentIndex = imageUrl ? allImages.indexOf(imageUrl) : -1;

  return (
    <Dialog open={!!imageUrl} onOpenChange={() => setOpenedImage()}>
      <DialogContent className="shadow-none min-w-4/5 max-w-screen min-h-screen p-0 bg-transparent border-none rounded-none m-0">
        <DialogTitle className="hidden" />
        {imageUrl && currentIndex !== -1 && (
          <Carousel
            opts={{
              startIndex: currentIndex,
              loop: false,
            }}
            className="w-full h-full"
            tabIndex={0}
          >
            <CarouselContent className="h-screen ml-0">
              {allImages.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="flex items-center justify-center h-screen pl-0"
                >
                  <div
                    className="relative w-full h-screen"
                    onMouseEnter={() => setHoveredImage(image)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <Image
                      src={image}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                    {hoveredImage === image && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = document.createElement('a');
                          link.href = image;
                          link.download = `image-${Date.now()}.png`;
                          link.click();
                        }}
                        className="absolute top-4 left-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-50"
                        aria-label="Download image"
                      >
                        <Download className="h-4 w-4 text-gray-700" />
                      </button>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="z-50 left-4" />
            <CarouselNext className="z-50 right-4" />
          </Carousel>
        )}
      </DialogContent>
    </Dialog>
  );
}

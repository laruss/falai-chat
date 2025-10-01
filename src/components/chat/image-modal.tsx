import { UIMessage } from '@ai-sdk/react';
import Image from 'next/image';
import { useMemo } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface ImageModalProps {
  imageUrl: string | null;
  messages: UIMessage[];
  onClose: () => void;
}

export function ImageModal({ imageUrl, messages, onClose }: ImageModalProps) {
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
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
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
                  <div className="relative w-full h-screen">
                    <Image
                      src={image}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
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

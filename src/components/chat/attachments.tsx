import { X } from 'lucide-react';
import Image from 'next/image';
import { forwardRef } from 'react';

import { useAppStore } from '@/lib/state/store';

interface AttachmentsProps {
  canAttachImages: boolean;
}

export const Attachments = forwardRef<HTMLInputElement, AttachmentsProps>(
  ({ canAttachImages }, ref) => {
    const { attachedImages, setAttachedImages } = useAppStore();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!canAttachImages) return;

      const files = Array.from(e.target.files || []);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        setAttachedImages(imageFiles);
      }
      // Reset input value to allow selecting the same file again
      if (e.target) {
        e.target.value = '';
      }
    };

    return (
      <div className="relative">
        {attachedImages.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachedImages.map((file, index) => (
              <div
                key={index}
                className="relative group bg-gray-100 rounded-lg p-1"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
                <button
                  onClick={() => {
                    const newImages = attachedImages.filter(
                      (_, i) => i !== index
                    );
                    setAttachedImages(newImages);
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }
);

Attachments.displayName = 'Attachments';

export { type AttachmentsProps };

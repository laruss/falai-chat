import { X } from 'lucide-react';
import Image from 'next/image';
import { forwardRef, useState } from 'react';

interface AttachmentsProps {
  attachedImages: File[];
  onAttachImages?: (files: File[]) => void;
  onRemoveImage?: (index: number) => void;
  canAttachImages: boolean;
  disabled?: boolean;
}

export const Attachments = forwardRef<HTMLInputElement, AttachmentsProps>(
  (
    {
      attachedImages,
      onAttachImages,
      onRemoveImage,
      canAttachImages,
      disabled = false,
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!canAttachImages) return;

      const files = Array.from(e.target.files || []);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));
      if (imageFiles.length > 0 && onAttachImages) {
        onAttachImages(imageFiles);
      }
      // Reset input value to allow selecting the same file again
      if (e.target) {
        e.target.value = '';
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      if (!canAttachImages || disabled) return;

      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      if (!canAttachImages || disabled) return;

      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!canAttachImages || disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));
      if (imageFiles.length > 0 && onAttachImages) {
        onAttachImages(imageFiles);
      }
    };

    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative"
      >
        {isDragging && (
          <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center z-10 pointer-events-none">
            <p className="text-blue-600 font-medium">Drop images here</p>
          </div>
        )}
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
                {onRemoveImage && (
                  <button
                    onClick={() => onRemoveImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
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

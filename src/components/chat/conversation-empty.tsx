import { useEffect, useRef, useState } from 'react';

import { EMPTY_CHAT_CAPTION, EMPTY_DRAG_DROP_CAPTION } from '@/constants';
import { useAppStore } from '@/lib/state/store';

export const ConversationEmpty = () => {
  const { mode, attachedImages, setAttachedImages } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode !== 'edit') return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length > 0) {
        setAttachedImages([...attachedImages, ...imageFiles]);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [mode, attachedImages, setAttachedImages]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      setAttachedImages([...attachedImages, ...imageFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      setAttachedImages([...attachedImages, ...imageFiles]);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  if (mode === 'generate') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-400 text-lg">{EMPTY_CHAT_CAPTION}</p>
      </div>
    );
  }

  if (mode === 'edit') {
    return (
      <div className="flex items-center justify-center h-[60vh] px-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleZoneClick}
          className={`
            w-full max-w-2xl min-h-[300px]
            border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center
            cursor-pointer transition-all duration-200
            ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-gray-500 text-lg text-center">
            {EMPTY_DRAG_DROP_CAPTION}
          </p>
        </div>
      </div>
    );
  }
};

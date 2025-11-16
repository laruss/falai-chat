'use client';

import { Upload } from '@mynaui/icons-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAppStore } from '@/lib/state/store';

export const DragNDrop = () => {
  const { setAttachedImages, attachedImages, mode, editingMessageId } =
    useAppStore();
  const isNotSupported = mode === 'generate';
  const isEditingMessage = Boolean(editingMessageId);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Check if files are being dragged
      if (e.dataTransfer?.types.includes('Files')) {
        dragCounterRef.current += 1;
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      dragCounterRef.current -= 1;
      if (dragCounterRef.current === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(false);
      dragCounterRef.current = 0;

      if (isEditingMessage) {
        toast.error('Cannot attach images while editing a message');
        return;
      }

      if (isNotSupported) {
        toast.error('Attaching images are not supported in this mode');
        return;
      }

      const files = Array.from(e.dataTransfer?.files || []);

      if (files.length === 0) return;

      const imageFiles: File[] = [];
      const nonImageFiles: File[] = [];

      files.forEach((file) => {
        if (file.type.startsWith('image/')) {
          imageFiles.push(file);
        } else {
          nonImageFiles.push(file);
        }
      });

      if (imageFiles.length > 0) {
        setAttachedImages([...attachedImages, ...imageFiles]);
        toast.success(
          `${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} attached`
        );
      }

      if (nonImageFiles.length > 0) {
        toast.error(
          `Only image files are supported. ${nonImageFiles.length > 1 ? 's were' : ' was'} skipped.`
        );
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      // Check if there are any image items
      const imageFiles: File[] = [];
      Array.from(items).forEach((item) => {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            imageFiles.push(file);
          }
        }
      });

      // If no images, don't interfere with normal paste
      if (imageFiles.length === 0) return;

      // We have images, check if editing is active
      if (isEditingMessage) {
        e.preventDefault();
        toast.error('Cannot attach images while editing a message');
        return;
      }

      // We have images, check if mode supports them
      if (isNotSupported) {
        toast.error('Attaching images are not supported in this mode');
        return;
      }

      // Prevent default to avoid pasting image data as text/HTML in textarea
      e.preventDefault();
      setAttachedImages([...attachedImages, ...imageFiles]);
      toast.success(
        `${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} pasted`
      );
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
      window.removeEventListener('paste', handlePaste);
    };
  }, [attachedImages, setAttachedImages, isNotSupported, isEditingMessage]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-primary bg-background/95 p-12 shadow-lg">
        <Upload className="h-16 w-16 text-primary" />
        <div className="text-center">
          <p className="text-xl font-semibold">Drop your images here</p>
          <p className="text-sm text-muted-foreground">
            Only image files will be accepted
          </p>
        </div>
      </div>
    </div>
  );
};

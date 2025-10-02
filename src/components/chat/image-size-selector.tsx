import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IMAGE_SIZE_UI_OPTIONS } from '@/lib/falai/constants';
import { ImageSize } from '@/lib/falai/types';

const CUSTOM_SIZE_VALUE = 'custom' as const;

interface ImageSizeSelectorProps {
  imageSize: ImageSize;
  onImageSizeChange: (size: ImageSize) => void;
}

export function ImageSizeSelector({
  imageSize,
  onImageSizeChange,
}: ImageSizeSelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const isCustomSize = typeof imageSize === 'object';
  const selectValue = isCustomSize ? CUSTOM_SIZE_VALUE : imageSize;

  const handleSizeChange = (value: string) => {
    if (value === CUSTOM_SIZE_VALUE) {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      onImageSizeChange(value as ImageSize);
    }
  };

  const handleCustomItemClick = (e: React.PointerEvent) => {
    e.preventDefault();
    setSelectOpen(false);
    setShowCustomInput(true);
  };

  const [tempWidth, setTempWidth] = useState('1024');
  const [tempHeight, setTempHeight] = useState('1024');

  const handleCustomSizeApply = () => {
    const width = parseInt(tempWidth);
    const height = parseInt(tempHeight);
    onImageSizeChange({ width, height });
    setShowCustomInput(false);
  };

  const customWidth = isCustomSize ? String(imageSize.width) : tempWidth;
  const customHeight = isCustomSize ? String(imageSize.height) : tempHeight;

  const displayValue = isCustomSize
    ? `${imageSize.width}x${imageSize.height}`
    : IMAGE_SIZE_UI_OPTIONS.find((opt) => opt.value === imageSize)?.label;

  return (
    <>
      <Select
        value={selectValue}
        onValueChange={handleSizeChange}
        open={selectOpen}
        onOpenChange={setSelectOpen}
      >
        <SelectTrigger className="h-9 border-0 opacity-50 hover:opacity-100 transition-opacity gap-1 text-xs border-none shadow-none">
          <SelectValue>{displayValue}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {IMAGE_SIZE_UI_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          <SelectItem
            value={CUSTOM_SIZE_VALUE}
            onPointerDown={handleCustomItemClick}
          >
            Custom Size...
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={showCustomInput} onOpenChange={setShowCustomInput}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Custom Image Size</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Width</label>
                <Input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setTempWidth(e.target.value)}
                  placeholder="Width"
                  min="256"
                  max="2048"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Height</label>
                <Input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setTempHeight(e.target.value)}
                  placeholder="Height"
                  min="256"
                  max="2048"
                />
              </div>
            </div>
            <Button onClick={handleCustomSizeApply} className="w-full">
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FalAiModels } from '@/lib/falai';
import { MODEL_UI_OPTIONS } from '@/lib/falai/constants';

interface ModelSelectProps {
  value: FalAiModels;
  onValueChange: (value: FalAiModels) => void;
}

export function ModelSelect({ value, onValueChange }: ModelSelectProps) {
  const selectedModel = MODEL_UI_OPTIONS.find((model) => model.value === value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="min-w-22 border-none shadow-none text-md font-semibold [&_svg]:opacity-100">
        <SelectValue placeholder="Select model">
          {selectedModel?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {MODEL_UI_OPTIONS.map((model) => (
          <SelectItem key={model.value} value={model.value}>
            <div className="flex flex-col">
              <span>{model.label}</span>
              <span className="text-xs text-gray-500">{model.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

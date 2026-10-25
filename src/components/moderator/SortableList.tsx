'use client';

import { useState } from 'react';
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SortableItem {
  id: string;
  [key: string]: any;
}

interface SortableListProps {
  items: SortableItem[];
  onReorder: (newOrder: SortableItem[]) => void;
  renderItem: (item: SortableItem, index: number) => React.ReactNode;
  className?: string;
}

export default function SortableList({
  items,
  onReorder,
  renderItem,
  className,
}: SortableListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= items.length) return;

    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);

    onReorder(newItems);
  };

  const moveUp = (index: number) => {
    moveItem(index, index - 1);
  };

  const moveDown = (index: number) => {
    moveItem(index, index + 1);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            'flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg',
            'hover:border-amber-300 transition-colors',
            draggedIndex === index && 'opacity-50'
          )}
        >
          <div className="flex flex-col gap-1">
            <button
              onClick={() => moveUp(index)}
              disabled={index === 0}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move up"
            >
              <ChevronUp className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => moveDown(index)}
              disabled={index === items.length - 1}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move down"
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />

          <div className="flex-1">
            {renderItem(item, index)}
          </div>
        </div>
      ))}
    </div>
  );
}

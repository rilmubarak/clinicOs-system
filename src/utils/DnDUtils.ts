import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import { Section } from 'src/types';

export const reorderItems = (
  items: Section[],
  event: DragEndEvent
): Section[] => {
  const { active, over } = event;

  if (over && active.id !== over.id) {
    const oldIndex = items.findIndex(section => section.id === active.id);
    const newIndex = items.findIndex(section => section.id === over.id);
    return arrayMove(items, oldIndex, newIndex);
  }

  return items;
};

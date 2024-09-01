import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragHandle from './DragHandle';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableItem = ({ id, children }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const itemStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '100%',
    cursor: 'default',
    boxSizing: 'border-box',
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={itemStyle}
      {...attributes}
      className="bg-gray-100 border p-2 md:p-4 mb-4 flex items-center rounded-md shadow-sm"
    >
      <DragHandle listeners={listeners} />
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default SortableItem;
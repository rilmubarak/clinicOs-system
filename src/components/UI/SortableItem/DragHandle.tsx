import React from 'react';

type Listeners = {
  onPointerDown?: (event: React.PointerEvent) => void;
  onPointerUp?: (event: React.PointerEvent) => void;
  onPointerMove?: (event: React.PointerEvent) => void;
} | undefined;

interface DragHandleProps {
  listeners: Listeners;
}

const DragHandle = ({ listeners }: DragHandleProps) => {
  const listenerProps = listeners || {};

  return (
    <span
      {...listenerProps}
      className="inline-block cursor-grab mr-2 md:mr-4"
    >
      <div className="flex flex-col items-center">
        {[...Array(3)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center my-0.5">
            {[...Array(2)].map((_, dotIndex) => (
              <span
                key={dotIndex}
                className="w-1.5 h-1.5 bg-gray-500 rounded-full inline-block mx-0.5"
              />
            ))}
          </div>
        ))}
      </div>
    </span>
  );
};

export default DragHandle;

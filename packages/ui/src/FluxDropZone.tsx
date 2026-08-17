import { useId, useRef, useState } from 'react';
import { cn } from '@flux/utils';

interface FluxDropZoneProps {
  disabled?: boolean;
  busy?: boolean;
  onActivate: () => void;
}

export function FluxDropZone({ disabled = false, busy = false, onActivate }: FluxDropZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const inactive = disabled || busy;

  const activate = () => {
    if (inactive) {
      return;
    }
    onActivate();
  };

  return (
    <div
      className={cn(
        'flux-dropzone',
        dragging && 'is-dragging',
        busy && 'is-busy',
        disabled && 'is-disabled',
      )}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!inactive) {
          setDragging(true);
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        activate();
      }}
    >
      <input
        ref={inputRef}
        id={inputId}
        className="flux-dropzone__input"
        type="file"
        disabled={inactive}
        onChange={(event) => {
          if (event.target.files && event.target.files.length > 0) {
            activate();
            event.target.value = '';
          }
        }}
      />
      <button
        type="button"
        className="flux-dropzone__button"
        disabled={inactive}
        onClick={() => inputRef.current?.click()}
      >
        <span className="flux-dropzone__kicker">Drop anything</span>
        <span className="flux-dropzone__hint">Drag a file, paste something, or choose a file</span>
      </button>
    </div>
  );
}

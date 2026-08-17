import { useId, useRef, useState } from 'react';
import { cn } from '@flux/utils';

export interface DropPayload {
  files: File[];
}

interface FluxDropZoneProps {
  disabled?: boolean;
  busy?: boolean;
  onActivate: (payload: DropPayload) => void;
}

export function FluxDropZone({ disabled = false, busy = false, onActivate }: FluxDropZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const inactive = disabled || busy;

  const activate = (files: FileList | File[] | null) => {
    if (inactive || !files || files.length === 0) {
      return;
    }
    onActivate({ files: Array.from(files) });
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
        activate(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        id={inputId}
        className="flux-dropzone__input"
        type="file"
        disabled={inactive}
        onChange={(event) => {
          activate(event.target.files);
          event.target.value = '';
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

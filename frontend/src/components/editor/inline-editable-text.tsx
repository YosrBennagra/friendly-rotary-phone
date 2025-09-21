"use client";

import * as React from "react";

interface InlineEditableTextProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function InlineEditableText({ value, placeholder = "Click to edit", onChange, className }: InlineEditableTextProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  React.useEffect(() => {
    if (!editing) {
      setDraft(value);
    }
  }, [value, editing]);

  const commit = () => {
    setEditing(false);
    onChange(draft.trim());
  };

  const cancel = () => {
    setEditing(false);
    setDraft(value);
  };

  return (
    <div
      className={className}
      onDoubleClick={() => setEditing(true)}
      role="textbox"
      aria-label="Editable text"
    >
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              commit();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              cancel();
            }
          }}
          className="w-full rounded border border-input bg-background px-2 py-1 text-sm shadow-sm"
        />
      ) : value ? (
        <span className="cursor-text">{value}</span>
      ) : (
        <span className="cursor-text text-muted-foreground">{placeholder}</span>
      )}
    </div>
  );
}

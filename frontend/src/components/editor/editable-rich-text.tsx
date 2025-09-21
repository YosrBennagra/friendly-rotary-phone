"use client";

import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import LinkExtension from "@tiptap/extension-link";
import { Bold as BoldIcon, Italic as ItalicIcon, Link2, List, ListOrdered, Undo, Redo } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditableRichTextProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function EditableRichText({ value, placeholder = "Click to edit", onChange, className }: EditableRichTextProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, BulletList, OrderedList, ListItem, LinkExtension.configure({ openOnClick: false })],
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none",
      },
    },
    content: value,
    editable: isEditing,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setDraft(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor && !isEditing) {
      // In TipTap v2, setContent's second arg is a boolean for emitUpdate
      editor.commands.setContent(value, false);
      setDraft(value);
    }
  }, [editor, value, isEditing]);

  const enableEditing = () => {
    if (!editor) return;
    setDraft(value);
    setIsEditing(true);
    editor.commands.focus("end");
  };

  const commitChanges = () => {
    setIsEditing(false);
    onChange(draft);
  };

  const cancelChanges = () => {
    setIsEditing(false);
    if (editor) {
      // Reset content without triggering onUpdate
      editor.commands.setContent(value, false);
    }
  };

  React.useEffect(() => {
    if (!editor) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelChanges();
      } else if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        commitChanges();
      }
    };

    if (isEditing) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editor, isEditing, draft, value]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={className}
      onDoubleClick={enableEditing}
      role="textbox"
      aria-label="Rich text editor"
    >
      {!isEditing && (!value || value === "<p></p>") ? (
        <div className="cursor-text rounded border border-dashed border-muted-foreground/30 p-4 text-sm text-muted-foreground">
          {placeholder}
        </div>
      ) : null}

      {isEditing && (
        <div className="rounded border bg-background p-3 shadow-sm">
          {/* BubbleMenu temporarily removed for build compatibility */}
          <EditorContent
            editor={editor}
            onBlur={commitChanges}
            className="min-h-[120px] cursor-text"
          />
        </div>
      )}

      {!isEditing && value ? (
        <div
          className="cursor-text space-y-2 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : null}
    </div>
  );
}

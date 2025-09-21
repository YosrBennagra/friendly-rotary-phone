"use client";

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SECTION_METADATA } from "./section-config";
import { useCVStore, type SectionKey } from "@/lib/store";

function SortableSection({ id }: { id: SectionKey }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const toggleSection = useCVStore((state) => state.toggleSection);
  const hiddenSections = useCVStore((state) => state.hiddenSections);
  const Icon = SECTION_METADATA[id].icon;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center justify-between rounded-md border bg-background/80 px-3 py-2 text-sm shadow-sm"
    >
      <div className="flex items-center gap-3">
        <button
          className="flex h-8 w-6 cursor-grab items-center justify-center text-muted-foreground"
          aria-label="Drag section"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div>
          <div className="flex items-center gap-2 font-medium">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {SECTION_METADATA[id].label}
          </div>
          <p className="text-xs text-muted-foreground">{SECTION_METADATA[id].description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isDragging && <Badge variant="outline">Move</Badge>}
        <Switch
          checked={!hiddenSections.has(id)}
          onCheckedChange={() => toggleSection(id)}
          aria-label="Toggle section"
        />
      </div>
    </div>
  );
}

export function SectionLibrary() {
  const sectionOrder = useCVStore((state) => state.sectionOrder);
  const reorderSections = useCVStore((state) => state.reorderSections);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Sections</h3>
        <p className="text-xs text-muted-foreground">
          Drag to reorder sections or toggle visibility for tailored versions of your CV.
        </p>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;
          if (!over || active.id === over.id) {
            return;
          }
          const oldIndex = sectionOrder.indexOf(active.id as SectionKey);
          const newIndex = sectionOrder.indexOf(over.id as SectionKey);
          const next = [...sectionOrder];
          next.splice(oldIndex, 1);
          next.splice(newIndex, 0, active.id as SectionKey);
          reorderSections(next);
        }}
      >
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {sectionOrder.map((section) => (
              <SortableSection id={section} key={section} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

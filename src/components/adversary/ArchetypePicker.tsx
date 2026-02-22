"use client";

import { adversaryArchetypes } from "@/lib/adversary/archetypes";
import { AdversaryArchetype } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface ArchetypePickerProps {
  selected: AdversaryArchetype | null;
  onSelect: (archetype: AdversaryArchetype) => void;
}

export function ArchetypePicker({ selected, onSelect }: ArchetypePickerProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {adversaryArchetypes.map((archetype) => {
        const Icon = archetype.icon;
        return (
          <button
            key={archetype.id}
            onClick={() => onSelect(archetype.id)}
            className={cn(
              "p-4 border text-left transition-all",
              selected === archetype.id
                ? "border-[#EF4444] bg-[#EF4444]/10"
                : "border-[#252525] hover:border-[#333333] bg-[#111111]"
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-5 h-5 text-[#EF4444]" />
              <span className="font-[family-name:var(--font-syne)]">{archetype.name}</span>
            </div>
            <p className="text-xs text-[#888888] mb-2">{archetype.tagline}</p>
            <p className="text-xs text-[#666666]">{archetype.fear}</p>
          </button>
        );
      })}
    </div>
  );
}

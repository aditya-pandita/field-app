"use client";

import { useState, useEffect } from "react";
import { getAllCoachStyles } from "@/lib/firebase/queries/coaches";
import { CoachStyle } from "@/lib/firebase/types";
import { CoachCard } from "./CoachCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";

export function CoachGrid() {
  const [coaches, setCoaches] = useState<CoachStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getAllCoachStyles().then((data) => {
      setCoaches(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-[#111111] border border-[#252525] animate-pulse" />
        ))}
      </div>
    );
  }

  if (coaches.length === 0) {
    return <EmptyState icon={Users} title="No coaches yet" description="Coaches will appear here once added" />;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {coaches.map((coach) => (
        <CoachCard
          key={coach.slug}
          coach={coach}
          expanded={expandedId === coach.slug}
          onToggle={() => setExpandedId(expandedId === coach.slug ? null : coach.slug)}
        />
      ))}
    </div>
  );
}

"use client";

import PageHeader from "@/components/layout/PageHeader";
import { CoachGrid } from "@/components/coaches/CoachGrid";

export default function CoachesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="REFERENCE"
        title="Coaches"
        subtitle="Study different approaches and methodologies"
      />
      <CoachGrid />
    </div>
  );
}

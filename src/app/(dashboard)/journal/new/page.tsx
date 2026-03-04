"use client";

import PageHeader from "@/components/layout/PageHeader";
import { NewJournalEntryForm } from "@/components/journal/NewJournalEntryForm";

export default function NewJournalEntryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="NEW ENTRY"
        title="Write Entry"
        subtitle="Reflect on your field work"
      />

      <div className="h-px bg-[#1A1A1A] my-8" />

      <NewJournalEntryForm />
    </div>
  );
}

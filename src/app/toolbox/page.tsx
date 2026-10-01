import type { Metadata } from "next";
import { MarginNote, PageHeader } from "@/components/kit";
import { Toolbox } from "@/components/toolbox";

export const metadata: Metadata = { title: "Toolbox" };

export default function ToolboxPage() {
  return (
    <>
      <PageHeader eyebrow="03 / Toolbox" title="Toolbox" intro="Tap a tool to see which projects used it.">
        <MarginNote>tap a tool, see the proof</MarginNote>
      </PageHeader>
      <Toolbox />
    </>
  );
}

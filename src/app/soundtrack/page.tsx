import type { Metadata } from "next";
import { PageHeader } from "@/components/kit";
import { ReceiptPlayer } from "@/components/player/receipt-player";

export const metadata: Metadata = { title: "Soundtrack" };

export default function SoundtrackPage() {
  return (
    <>
      <PageHeader eyebrow="~/soundtrack" title="Code has a soundtrack." intro="Some bugs are easier to fix with the right song." />
      <ReceiptPlayer />
    </>
  );
}

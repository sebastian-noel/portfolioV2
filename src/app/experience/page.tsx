import type { Metadata } from "next";
import Timeline from "@/components/experience/Timeline";
import { experiences } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience | snoel.dev",
  description:
    "Internships, research, and leadership roles across Sebastian Noel's journey.",
};

export default function ExperiencePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <header className="mb-16 flex flex-col gap-3">
        <h1 className="text-5xl font-bold text-text">Experience</h1>
        <p className="text-primary">
          A running timeline of internships, research, and leadership — newest first.
        </p>
      </header>

      <Timeline experiences={experiences} />
    </main>
  );
}

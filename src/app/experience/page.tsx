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
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
      <header className="mb-10 flex flex-col gap-3 md:mb-16">
        <h1 className="text-3xl font-bold text-text sm:text-4xl md:text-5xl">Experience</h1>
        <p className="text-sm text-primary md:text-base">
          A running timeline of internships, research, and leadership — newest first.
        </p>
      </header>

      <Timeline experiences={experiences} />
    </main>
  );
}

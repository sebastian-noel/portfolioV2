import type { Experience } from "@/types/experience";

// Placeholder images — headshot is the only image in /public/images today.
// Once real experience photos land in /public/images/experience/, swap these.
const PLACEHOLDER_IMAGES: [string, string, string] = [
  "/images/headshot.jpg",
  "/images/headshot.jpg",
  "/images/headshot.jpg",
];

const entries: Experience[] = [
  {
    id: "ucf-research-2026",
    type: "Research",
    title: "Undergraduate Researcher",
    organization: "Placeholder Research Lab",
    startDate: "2026-01",
    endDate: "Present",
    description:
      "Placeholder description for an ongoing research role. Swap this out with a one-sentence framing of the project and your role on it.",
    bullets: [
      "Placeholder achievement — quantify impact where possible.",
      "Placeholder achievement — call out the hard technical problem.",
      "Placeholder achievement — name the stack or method used.",
    ],
    skills: ["Python", "PyTorch", "Research", "Data Analysis"],
    images: PLACEHOLDER_IMAGES,
  },
  {
    id: "bny-internship-2026",
    type: "Internship",
    title: "Software Engineering Intern",
    organization: "Bank of New York",
    startDate: "2026-01",
    endDate: "2026-04",
    description:
      "Placeholder description for a summer internship. Lead with the product area or team you joined.",
    bullets: [
      "Shipped a placeholder feature that reached N users.",
      "Reduced a placeholder metric from X to Y.",
      "Collaborated across a placeholder number of teams to land the project.",
    ],
    skills: ["TypeScript", "React", "Next.js", "PostgreSQL"],
    images: PLACEHOLDER_IMAGES,
  },
  {
    id: "placeholder-leadership-2024",
    type: "Leadership",
    title: "Club Lead / Organizer",
    organization: "Placeholder Student Org",
    startDate: "2024-08",
    endDate: "2025-05",
    description:
      "Placeholder description for a leadership role. Mention scale (members, events, scope).",
    bullets: [
      "Organized placeholder event with X attendees.",
      "Grew membership from X to Y over the year.",
      "Ran placeholder workshops on a weekly cadence.",
    ],
    skills: ["Leadership", "Event Planning", "Mentoring"],
    images: PLACEHOLDER_IMAGES,
  },
  {
    id: "placeholder-internship-2024",
    type: "Internship",
    title: "Software Engineering Intern",
    organization: "Another Placeholder Company",
    startDate: "2024-05",
    endDate: "2024-08",
    description:
      "Placeholder description for a prior internship. Contrast what you learned here from the later one.",
    bullets: [
      "Built a placeholder pipeline processing X events per day.",
      "Wrote placeholder number of tests covering placeholder percent of the codebase.",
      "Presented a placeholder demo to a cross-functional audience.",
    ],
    skills: ["Go", "Docker", "gRPC", "AWS"],
    images: PLACEHOLDER_IMAGES,
  },
];

// Sort newest-first by startDate. YYYY-MM strings sort lexicographically so this is safe.
export const experiences: Experience[] = [...entries].sort((a, b) =>
  b.startDate.localeCompare(a.startDate)
);

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatMonth(ym: string): string {
  const [year, month] = ym.split("-");
  const idx = Number(month) - 1;
  return `${MONTHS[idx] ?? month} ${year}`;
}

export function formatDateRange(
  start: string,
  end: string | "Present"
): string {
  const left = formatMonth(start);
  const right = end === "Present" ? "Present" : formatMonth(end);
  return `${left} — ${right}`;
}

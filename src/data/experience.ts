import type { Experience } from "@/types/experience";

// Placeholder images/logo — headshot is the only image in /public/images today.
// Once real assets land in /public/images/experience/, swap these.
const PLACEHOLDER_IMAGES: [string, string, string] = [
  "/images/headshot.jpg",
  "/images/headshot.jpg",
  "/images/headshot.jpg",
];
const PLACEHOLDER_LOGO = "/images/headshot.jpg";

const entries: Experience[] = [
  {
    id: "bny-internship-2026",
    type: "Internship",
    title: "Software Engineering Intern",
    organization: "Bank of New York",
    startDate: "2026-01",
    endDate: "2026-04",
    description:
      "Developed an autonomous AI agent system that monitors live microservice applications, detects infrastructure failures, and automatically implements an action plan for their remediation using a machine learning pipeline with an LLM fallback.",
    bullets: [
      "Built a 4-stage **autonomous agent pipeline** (Collect → Detect → Decide → Execute) in **Python** and **FastAPI**",
      "Integrated **4** monitoring sources in parallel via ThreadPoolExecutor, reducing collection time by **~75%**.",
      "Engineered **8-feature** ML vectors per service from **Prometheus**, **Docker SDK**, and **AppDynamics** telemetry.",
      "Trained an **IsolationForest** + **XGBoost** ensemble on **4,250** synthetic samples across **6** fault classifications.",
      "Achieved **sub-90-second** fault-to-remediation latency by eliminating LLM calls for high-confidence detections.",
      "Orchestrated a **Chaos Monkey** injecting **2** fault types (container kill, latency injection) across **5** microservices.",
      "Persisted all incidents, anomalies, and actions to **PostgreSQL**, surfaced via **Spring Boot** REST API and **React** UI."
    ],
    skills: ["Python", "Java", "PostgreSQL", "FastAPI", "Spring Boot", "Docker", "Grafana", "Prometheus", "AppDynamics"],
    images: ["/images/experiences/bny-cohort.jpg", "/images/experiences/bny-team.jpg"],
    logo: "/images/logos/bny.png",
    links: [
      { label: "BNY", url: "https://www.bny.com" },
      { label: "Allen's Linkedin Post", url: "https://www.linkedin.com/feed/update/urn:li:activity:7453282455933034496/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEaOB8cBptJFEMbgLPYjdZHzba255eLi3qs"}
    ],
  },
  {
    id: "crcv-research-2026",
    type: "Research",
    title: "Undergraduate Researcher",
    organization: "Center for Research in Computer Vision (CRCV)",
    startDate: "2026-01",
    endDate: "2026-04",
    description:
      "Placeholder description for an ongoing research role. Swap this out with a one-sentence framing of the project and your role on it.",
    bullets: [
      "Placeholder achievement — quantify impact where possible.",
      "Placeholder achievement — call out the hard technical problem.",
      "Placeholder achievement — name the stack or method used.",
    ],
    skills: ["Python", "PyTorch", "Research", "Data Analysis"],
    images: PLACEHOLDER_IMAGES,
    logo: PLACEHOLDER_LOGO,
    links: [
      { label: "CRCV", url: "https://www.crcv.ucf.edu" },
    ],
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
    logo: PLACEHOLDER_LOGO,
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
    logo: PLACEHOLDER_LOGO,
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

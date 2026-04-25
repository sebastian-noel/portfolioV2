export type ExperienceType = "Internship" | "Research" | "Leadership";

export interface Experience {
  id: string;
  type: ExperienceType;
  title: string;
  organization: string;
  // 'YYYY-MM' for deterministic sorting. endDate can be the literal 'Present'
  // for ongoing entries, which the UI highlights separately.
  startDate: string;
  endDate: string | "Present";
  description: string;
  bullets: string[];
  skills: string[];
  images: [string, ...string[]];
  logo: string;
  links?: { label: string; url: string }[];
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type Ref } from "react";
import { ExternalLink } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn, parseBold } from "@/lib/utils";
import { formatDateRange } from "@/data/experience";
import type { Experience } from "@/types/experience";
import ImageCarousel from "./ImageCarousel";

interface ExperienceCardProps {
  experience: Experience;
  ref?: Ref<HTMLDivElement>;
}

export default function ExperienceCard({
  experience,
  ref,
}: ExperienceCardProps) {
  const isOngoing = experience.endDate === "Present";
  const badgeRef = useRef<HTMLSpanElement>(null);

  // Subtle pulse on the Present badge so ongoing roles read as "active".
  useGSAP(() => {
    if (!badgeRef.current) return;
    gsap.to(badgeRef.current, {
      opacity: 0.55,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, [isOngoing]);

  return (
    <article
      ref={ref}
      className="relative flex flex-col gap-4 rounded-lg border border-secondary bg-secondary/10 p-6"
    >
      {/* Company logo anchored to the top-right of the card */}
      <div className="absolute right-6 top-6 h-25 w-25 overflow-hidden rounded-md border border-secondary">
        <Image
          src={experience.logo}
          alt={`${experience.organization} logo`}
          fill
          sizes="625px"
          className="object-cover"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-secondary bg-secondary/40 px-2.5 py-0.5 text-xs font-light text-primary">
          {experience.type}
        </span>
        {isOngoing && (
          <span
            ref={badgeRef}
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/60 px-2.5 py-0.5 text-xs font-medium text-accent"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Present
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text">{experience.title}</h3>
        <p className="text-primary">{experience.organization}</p>
        <p className="text-sm font-light text-primary/70">
          {formatDateRange(experience.startDate, experience.endDate)}
        </p>
      </div>

      <p className="text-text/90">{experience.description}</p>

      <ImageCarousel
        images={experience.images}
        alt={`${experience.title} at ${experience.organization}`}
      />

      <ul className="flex flex-col gap-1.5 pl-4">
        {experience.bullets.map((bullet, i) => (
          <li
            key={i}
            className={cn(
              "relative text-text/90",
              // Custom bullet in primary color, offset via absolute pseudo-element.
              "before:absolute before:-left-4 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-primary"
            )}
          >
            {parseBold(bullet)}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5">
        {experience.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-md border border-secondary bg-background px-2 py-0.5 text-xs text-primary"
          >
            {skill}
          </span>
        ))}
      </div>

      {experience.links && experience.links.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-secondary pt-4">
          {experience.links.map(({ label, url }) => (
            <Link
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-secondary bg-background px-3 py-1.5 text-xs text-primary transition-colors hover:border-accent/60 hover:text-accent"
            >
              {label}
              <ExternalLink className="h-3 w-3" />
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}

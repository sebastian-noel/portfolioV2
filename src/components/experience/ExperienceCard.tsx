"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type Ref } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
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
  const [expanded, setExpanded] = useState(false);
  const hasLinks = !!experience.links && experience.links.length > 0;

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
      className="relative flex flex-col gap-4 rounded-lg border border-secondary bg-secondary/10 p-4 md:p-6"
    >
      {/* Company logo anchored to the top-right of the card. Smaller on mobile so it
          doesn't crowd the title; reverts to original size at md+. */}
      <div className="absolute right-4 top-4 h-14 w-14 overflow-hidden rounded-md border border-secondary md:right-6 md:top-6 md:h-25 md:w-25">
        <Image
          src={experience.logo}
          alt={`${experience.organization} logo`}
          fill
          sizes="(max-width: 768px) 56px, 100px"
          className="object-cover"
        />
      </div>

      {/* pr-20 reserves space for the mobile logo so tags/title don't slide under it. */}
      <div className="flex items-center gap-2 pr-20 md:pr-0">
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

      <div className="flex flex-col gap-1 pr-20 md:pr-0">
        <h3 className="text-base font-semibold text-text md:text-lg">{experience.title}</h3>
        <p className="text-sm text-primary md:text-base">{experience.organization}</p>
        <p className="text-xs font-light text-primary/70 md:text-sm">
          {formatDateRange(experience.startDate, experience.endDate)}
        </p>
      </div>

      <p className="text-sm text-text/90 md:text-base">{experience.description}</p>

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

      <ImageCarousel
        images={experience.images}
        alt={`${experience.title} at ${experience.organization}`}
      />

      {/* Collapsible region — uses the grid-rows 0fr↔1fr trick so content
          height animates smoothly without measuring it in JS. */}
      <div
        className={cn(
          "-mt-4 grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 pt-4">
            <ul className="flex flex-col gap-1.5 pl-4">
              {experience.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className={cn(
                    "relative text-xs text-text/90 md:text-base",
                    // Custom bullet in primary color, offset via absolute pseudo-element.
                    "before:absolute before:-left-4 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-primary"
                  )}
                >
                  {parseBold(bullet)}
                </li>
              ))}
            </ul>

            {hasLinks && (
              <div className="flex flex-wrap gap-2 border-t border-secondary pt-4">
                {experience.links!.map(({ label, url }) => (
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
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-secondary bg-secondary/20 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:border-accent/60 hover:bg-secondary/40 hover:text-accent"
      >
        {expanded ? "Show less" : "Show more"}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>
    </article>
  );
}

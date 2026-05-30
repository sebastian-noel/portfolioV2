"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type Ref } from "react";
import { ExternalLink } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { formatDateRange } from "@/data/experience";
import type { Experience } from "@/types/experience";

interface IncomingExperienceCardProps {
  experience: Experience;
  ref?: Ref<HTMLDivElement>;
}

export default function IncomingExperienceCard({
  experience,
  ref,
}: IncomingExperienceCardProps) {
  const hasLinks = !!experience.links && experience.links.length > 0;
  const dotRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!dotRef.current) return;
    gsap.to(dotRef.current, {
      opacity: 0,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <article
      ref={ref}
      className="relative flex flex-col gap-4 rounded-lg border border-secondary bg-secondary/10 p-4 md:p-6"
    >
      <div className="absolute right-4 top-4 h-14 w-14 overflow-hidden rounded-md border border-secondary md:right-6 md:top-6 md:h-25 md:w-25">
        <Image
          src={experience.logo}
          alt={`${experience.organization} logo`}
          fill
          sizes="(max-width: 768px) 56px, 100px"
          className="object-cover"
        />
      </div>

      <div className="flex items-center gap-2 pr-20 md:pr-0">
        <span className="inline-flex items-center rounded-full border border-secondary bg-secondary/40 px-2.5 py-0.5 text-xs font-light text-primary">
          {experience.type}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/60 px-2.5 py-0.5 text-xs font-medium text-accent">
          <span ref={dotRef} className="h-1.5 w-1.5 rounded-full bg-accent" />
          Incoming
        </span>
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
    </article>
  );
}

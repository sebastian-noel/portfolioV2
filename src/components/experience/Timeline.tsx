"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types/experience";
import ExperienceCard from "./ExperienceCard";

gsap.registerPlugin(ScrollTrigger);

interface TimelineProps {
  experiences: Experience[];
}

export default function Timeline({ experiences }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(
        (el): el is HTMLDivElement => el !== null
      );

      // Cards start hidden; each animates in once as it enters the viewport.
      gsap.set(cards, { opacity: 0, y: 32 });
      cards.forEach((card) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      // Accent rail fills from top to bottom as the container scrolls past.
      if (fillRef.current && containerRef.current) {
        gsap.fromTo(
          fillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%",
              end: "bottom 60%",
              scrub: true,
            },
          }
        );
      }
    },
    { scope: containerRef, dependencies: [experiences.length] }
  );

  return (
    <div ref={containerRef} className="relative">
      {/* Static rail — always visible */}
      <div className="absolute bottom-0 left-6 top-0 w-px bg-secondary" />
      {/* Progress fill — scrubbed by ScrollTrigger, grows top→bottom */}
      <div
        ref={fillRef}
        className="absolute bottom-0 left-6 top-0 w-px origin-top bg-accent"
        style={{ transform: "scaleY(0)" }}
      />

      <div className="flex flex-col gap-12">
        {experiences.map((experience, i) => {
          const isOngoing = experience.endDate === "Present";
          return (
            <div key={experience.id} className="relative pl-16">
              {/* Node dot sits on top of the rail. ring-background masks
                  the rail so the dot reads as a node, not an intersection. */}
              <span
                className={cn(
                  "absolute left-6 top-6 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-background",
                  isOngoing ? "bg-accent" : "bg-primary"
                )}
              />
              <ExperienceCard
                experience={experience}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

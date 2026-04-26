"use client";

import { useRef, useEffect } from "react";
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
  const accentFillRef = useRef<HTMLDivElement>(null);
  const highWaterRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const maxProgressRef = useRef(0);

  useGSAP(
    () => {
      const container = containerRef.current;
      const accentFill = accentFillRef.current;
      if (!container || !accentFill) return;

      const containerHeight = container.offsetHeight;

      // Cards animate in as they enter the viewport.
      const cards = cardRefs.current.filter(
        (el): el is HTMLDivElement => el !== null
      );
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

      // Pre-compute each dot's position as a 0-1 fraction within the container.
      // Done once here to avoid layout thrashing inside the scroll callback.
      const containerTop = container.getBoundingClientRect().top;
      const dotThresholds = dotRefs.current.map((dot) => {
        if (!dot) return 0;
        return (dot.getBoundingClientRect().top - containerTop) / containerHeight;
      });

      // All dots start hidden; revealed via onUpdate as the rail reaches them.
      gsap.set(dotRefs.current.filter(Boolean), { opacity: 0, scale: 0 });
      const shownDots = new Set<number>();

      // Accent fill: animates height (not scaleY) so the gradient mask aligns
      // with the real visible bottom edge of the element.
      gsap.fromTo(
        accentFill,
        { height: 0 },
        {
          height: containerHeight,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 60%",
            end: "bottom 60%",
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress;

              // Reveal each dot the moment the rail reaches its position.
              dotThresholds.forEach((threshold, i) => {
                const dot = dotRefs.current[i];
                if (!dot || shownDots.has(i)) return;
                if (progress >= threshold) {
                  shownDots.add(i);
                  gsap.to(dot, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    ease: "back.out(1.7)",
                  });
                }
              });

              // Always fade the trailing edge of the accent fill.
              const mask = "linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)";
              accentFill.style.maskImage = mask;
              accentFill.style.webkitMaskImage = mask;
            },
          },
        }
      );
    },
    { scope: containerRef, dependencies: [experiences.length] }
  );

  // High water mark: native scroll listener so it only ever grows forward.
  // Mirrors the same start/end offsets used by the ScrollTrigger above.
  useEffect(() => {
    const container = containerRef.current;
    const fill = highWaterRef.current;
    if (!container || !fill) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(
          1,
          (window.innerHeight * 0.6 - rect.top) / container.offsetHeight
        )
      );
      if (progress > maxProgressRef.current) {
        maxProgressRef.current = progress;
        gsap.set(fill, { height: progress * container.offsetHeight });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Secondary rail — high water mark, never shrinks */}
      <div
        ref={highWaterRef}
        className="absolute left-6 top-0 w-px bg-secondary"
        style={{
          height: 0,
          maskImage: "linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)",
        }}
      />
      {/* Accent fill — scrubs with current scroll, fades tail when not at frontier */}
      <div
        ref={accentFillRef}
        className="absolute left-6 top-0 w-px bg-accent"
        style={{ height: 0 }}
      />

      <div className="flex flex-col gap-12">
        {experiences.map((experience, i) => {
          const isOngoing = experience.endDate === "Present";
          return (
            <div key={experience.id} className="relative pl-16">
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
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

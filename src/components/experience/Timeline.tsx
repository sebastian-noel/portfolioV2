"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types/experience";
import ExperienceCard from "./ExperienceCard";
import IncomingExperienceCard from "./IncomingExperienceCard";

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
  const terminalDotRef = useRef<HTMLSpanElement>(null);
  const terminalTextRef = useRef<HTMLParagraphElement>(null);
  const maxProgressRef = useRef(0);
  const autoExtendFiredRef = useRef(false);

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
      // Terminal dot: fires once when the last card enters the viewport.
      const lastCard = cards[cards.length - 1];
      const terminalDot = terminalDotRef.current;
      const terminalText = terminalTextRef.current;
      if (lastCard && terminalDot && terminalText) {
        gsap.set(terminalDot, { opacity: 0, scale: 0 });
        gsap.set(terminalText, { opacity: 0 });
        ScrollTrigger.create({
          trigger: lastCard,
          start: "top 60%",
          once: true,
          onEnter: () => {
            if (autoExtendFiredRef.current) return;
            autoExtendFiredRef.current = true;

            const dotTop =
              terminalDot.getBoundingClientRect().top -
              container.getBoundingClientRect().top;

            // Extend the permanent high-water rail to the terminal dot.
            // The accent fill is scrub-driven and handles itself via scroll.
            gsap.to(highWaterRef.current, {
              height: dotTop,
              duration: 2,
              ease: "power2.inOut",
              overwrite: "auto",
              onComplete: () => {
                gsap.to(terminalDot, {
                  opacity: 1,
                  scale: 1,
                  duration: 0.4,
                  ease: "back.out(1.7)",
                  onComplete: () => {
                    gsap.to(terminalText, { opacity: 1, duration: 0.6, ease: "power2.out" });
                  },
                });
              },
            });
          },
        });
      }
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
      if (autoExtendFiredRef.current) return;
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
      {/* Rails are desktop-only — mobile drops the timeline visualization entirely. */}
      <div
        ref={highWaterRef}
        className="absolute left-6 top-6 hidden w-px bg-secondary md:block"
        style={{
          height: 0,
          maskImage: "linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)",
        }}
      />
      <div
        ref={accentFillRef}
        className="absolute left-6 top-6 hidden w-px bg-accent md:block"
        style={{ height: 0 }}
      />

      <div className="flex flex-col gap-8 md:gap-12">
        {experiences.map((experience, i) => {
          const isOngoing = experience.endDate === "Present";
          return (
            <div key={experience.id} className="relative md:pl-16">
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className={cn(
                  "absolute left-6 top-6 hidden h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-background md:block",
                  isOngoing ? "bg-accent" : "bg-primary"
                )}
              />
              {experience.incoming ? (
                <IncomingExperienceCard
                  experience={experience}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                />
              ) : (
                <ExperienceCard
                  experience={experience}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Terminal marker — desktop only, revealed by the slow auto-extend animation. */}
      <div className="relative mt-8 hidden md:block md:mt-12 md:pl-16">
        <span
          ref={terminalDotRef}
          className="absolute left-6 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-primary ring-4 ring-background"
          style={{ opacity: 0 }}
        />
        <p
          ref={terminalTextRef}
          className="text-sm italic text-primary/50"
          style={{ opacity: 0 }}
        >
          {"$ git init && git commit -m \"initial commit\" && git remote add origin "}
          <Link
            href="https://github.com/sebastian-noel"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-accent"
          >
            git@github.com:sebastian-noel/portfolio.git
          </Link>
          {" && git push -u origin main"}
        </p>
      </div>
    </div>
  );
}

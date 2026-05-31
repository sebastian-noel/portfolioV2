"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types/experience";
import ExperienceCard from "./ExperienceCard";
import IncomingExperienceCard from "./IncomingExperienceCard";

gsap.registerPlugin(ScrollTrigger);

const T_PREFIX = `$ git init && git commit -m "initial commit" && git remote add origin `;
const T_LINK   = `git@github.com:sebastian-noel/portfolio.git`;
const T_SUFFIX = ` && git push -u origin main`;
const T_FULL   = T_PREFIX + T_LINK + T_SUFFIX;

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

  // All auto-complete tracking lives in refs to keep the scroll closure fresh.
  const autoStateRef = useRef<"idle" | "waiting" | "completing" | "completed">("idle");
  const bottomTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dotThresholdsRef = useRef<number[]>([]);
  const shownDotsRef = useRef(new Set<number>());
  const terminalFiredRef = useRef(false);

  const [typingState, setTypingState] = useState<"idle" | "typing" | "blinking" | "done">("idle");
  const [typedCount, setTypedCount] = useState(0);
  const [caretVisible, setCaretVisible] = useState(true);
  const startTypingRef = useRef<() => void>(() => {});
  startTypingRef.current = () => setTypingState("typing");

  // Card entrance animations + one-time dot threshold pre-computation.
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
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

      // Thresholds must be computed BEFORE dots are hidden so getBoundingClientRect
      // returns their natural layout positions (transforms don't affect layout flow,
      // but computing early is safer and matches original behavior).
      const containerTop = container.getBoundingClientRect().top;
      dotThresholdsRef.current = dotRefs.current.map((dot) => {
        if (!dot) return 0;
        return (dot.getBoundingClientRect().top - containerTop) / container.offsetHeight;
      });

      gsap.set(dotRefs.current.filter(Boolean), { opacity: 0, scale: 0 });
      if (terminalDotRef.current) gsap.set(terminalDotRef.current, { opacity: 0, scale: 0 });
    },
    { scope: containerRef, dependencies: [experiences.length] }
  );

  // Unified scroll listener: drives both rails + bottom-detection + auto-complete.
  useEffect(() => {
    const container = containerRef.current;
    const accentFill = accentFillRef.current;
    const highWater = highWaterRef.current;
    if (!container || !accentFill || !highWater) return;

    const BOTTOM_GAP = 8; // px tolerance for "at bottom"

    // ── Helpers ──────────────────────────────────────────────────────────────

    const revealDot = (i: number) => {
      const dot = dotRefs.current[i];
      if (!dot || shownDotsRef.current.has(i)) return;
      shownDotsRef.current.add(i);
      gsap.to(dot, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
    };

    const revealDotsUpTo = (h: number) => {
      const progress = h / container.offsetHeight;
      dotThresholdsRef.current.forEach((threshold, i) => {
        if (progress >= threshold) revealDot(i);
      });
    };

    // The accent fill's leading edge should sit at the viewport's vertical midpoint.
    // The fill div is positioned at top-6 (24px) inside the container, so we offset
    // from the container's viewport-top rather than the rail's visual top — the ~24px
    // delta is negligible and keeps the formula consistent with the original scrub.
    const getScrollDrivenHeight = () => {
      const rect = container.getBoundingClientRect();
      return Math.max(0, Math.min(window.innerHeight * 0.5 - rect.top, container.offsetHeight));
    };

    const applyAccent = (h: number, removeMask = false) => {
      const mask =
        removeMask || h >= container.offsetHeight
          ? "none"
          : "linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)";
      accentFill.style.maskImage = mask;
      accentFill.style.webkitMaskImage = mask;
      gsap.set(accentFill, { height: h });
    };

    // High-water only ever grows: shows where the user has been.
    const advanceHighWater = (h: number) => {
      const current = parseFloat(highWater.style.height) || 0;
      if (h <= current) return;
      const mask =
        h >= container.offsetHeight
          ? "none"
          : "linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)";
      highWater.style.maskImage = mask;
      highWater.style.webkitMaskImage = mask;
      gsap.set(highWater, { height: h });
    };

    // ── Auto-complete ─────────────────────────────────────────────────────────

    const triggerAutoComplete = () => {
      if (autoStateRef.current !== "waiting") return;
      autoStateRef.current = "completing";

      // Remove the fade mask so the terminal dot is the definitive endpoint.
      accentFill.style.maskImage = "none";
      accentFill.style.webkitMaskImage = "none";

      gsap.to(accentFill, {
        height: container.offsetHeight,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate() {
          const h = parseFloat(accentFill.style.height) || 0;
          advanceHighWater(h);
          revealDotsUpTo(h);
        },
        onComplete() {
          autoStateRef.current = "completed";
          advanceHighWater(container.offsetHeight);
          dotThresholdsRef.current.forEach((_, i) => revealDot(i));

          if (!terminalFiredRef.current) {
            terminalFiredRef.current = true;
            const terminalDot = terminalDotRef.current;
            if (terminalDot) {
              gsap.to(terminalDot, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "back.out(1.7)",
                onComplete: () => startTypingRef.current(),
              });
            }
          }
        },
      });
    };

    // ── Main scroll handler ───────────────────────────────────────────────────

    const handleScroll = () => {
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - BOTTOM_GAP;

      // While auto-completing/completed, snap accent fill back the moment the
      // user scrolls away from the bottom (high-water stays at its max).
      if (autoStateRef.current === "completing" || autoStateRef.current === "completed") {
        if (!atBottom) {
          gsap.killTweensOf(accentFill);
          autoStateRef.current = "idle";
          const h = getScrollDrivenHeight();
          applyAccent(h);
          revealDotsUpTo(h);
        }
        return;
      }

      // Normal scroll-driven tracking.
      const h = getScrollDrivenHeight();
      applyAccent(h);
      advanceHighWater(h);
      revealDotsUpTo(h);

      if (atBottom) {
        if (autoStateRef.current === "idle") {
          autoStateRef.current = "waiting";
          bottomTimerRef.current = setTimeout(triggerAutoComplete, 1000);
        }
      } else if (autoStateRef.current === "waiting") {
        clearTimeout(bottomTimerRef.current!);
        bottomTimerRef.current = null;
        autoStateRef.current = "idle";
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set initial position on mount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (bottomTimerRef.current) clearTimeout(bottomTimerRef.current);
    };
  }, []);

  // ── Typewriter effects ────────────────────────────────────────────────────

  useEffect(() => {
    if (typingState !== "typing") return;
    if (typedCount >= T_FULL.length) { setTypingState("blinking"); return; }
    const t = setTimeout(() => setTypedCount((c) => c + 1), 32);
    return () => clearTimeout(t);
  }, [typingState, typedCount]);

  useEffect(() => {
    if (typingState !== "blinking") return;
    const t = setTimeout(() => setTypingState("done"), 2500);
    return () => clearTimeout(t);
  }, [typingState]);

  useEffect(() => {
    if (typingState !== "blinking") { setCaretVisible(true); return; }
    const id = setInterval(() => setCaretVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, [typingState]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="relative">
      {/* High-water rail — permanent visited indicator, desktop only */}
      <div
        ref={highWaterRef}
        className="absolute left-6 top-6 hidden w-px bg-secondary md:block"
        style={{
          height: 0,
          maskImage: "linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)",
        }}
      />
      {/* Accent fill — live scroll-driven indicator */}
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
                ref={(el) => { dotRefs.current[i] = el; }}
                className={cn(
                  "absolute left-6 top-6 hidden h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-background md:block",
                  isOngoing ? "bg-accent" : "bg-primary"
                )}
              />
              {experience.incoming ? (
                <IncomingExperienceCard
                  experience={experience}
                  ref={(el) => { cardRefs.current[i] = el; }}
                />
              ) : (
                <ExperienceCard
                  experience={experience}
                  ref={(el) => { cardRefs.current[i] = el; }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Terminal marker — desktop only, revealed by auto-complete */}
      <div className="relative mt-8 hidden md:block md:mt-12 md:pl-16">
        <span
          ref={terminalDotRef}
          className="absolute left-6 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-primary ring-4 ring-background"
          style={{ opacity: 0 }}
        />
        <p className="text-sm italic text-primary/50">
          {typingState === "idle" ? null : typingState === "typing" ? (
            <>
              {T_FULL.slice(0, typedCount)}
              <span className="inline-block h-[1em] w-[0.55em] translate-y-[0.1em] bg-primary/50 align-middle" />
            </>
          ) : (
            <>
              {T_PREFIX}
              <Link
                href="https://github.com/sebastian-noel"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-accent"
              >
                {T_LINK}
              </Link>
              {T_SUFFIX}
              {typingState === "blinking" && (
                <span
                  className="inline-block h-[1em] w-[0.55em] translate-y-[0.1em] bg-primary/50 align-middle"
                  style={{ opacity: caretVisible ? 1 : 0 }}
                />
              )}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

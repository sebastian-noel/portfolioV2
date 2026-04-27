"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: [string, ...string[]];
  alt: string;
}

const SLIDE_DURATION = 4; // seconds each slide is visible before crossfading
const FADE_DURATION = 0.8; // seconds the crossfade itself takes

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const isTransitioning = useRef(false);

  useGSAP(
    () => {
      const slides = slideRefs.current.filter(
        (el): el is HTMLDivElement => el !== null
      );
      if (slides.length === 0) return;

      // Start with only slide 0 visible. Other slides stacked underneath.
      gsap.set(slides[0], { opacity: 1 });
      gsap.set(slides.slice(1), { opacity: 0 });

      const tl = gsap.timeline({ repeat: -1 });

      // For each transition, fade next slide in and current out at the same time.
      // React state update fires at transition start so the indicator dot stays in sync.
      slides.forEach((_, i) => {
        const nextIndex = (i + 1) % slides.length;
        tl.to(
          slides[i],
          { opacity: 0, duration: FADE_DURATION, ease: "power2.inOut" },
          `+=${SLIDE_DURATION}`
        )
          .to(
            slides[nextIndex],
            { opacity: 1, duration: FADE_DURATION, ease: "power2.inOut" },
            "<"
          )
          .call(
            () => {
              activeIndexRef.current = nextIndex;
              setActiveIndex(nextIndex);
            },
            [],
            "<"
          );
      });

      timelineRef.current = tl;
    },
    { scope: containerRef }
  );

  // Manually crossfade to a target slide, then restart the auto-scroll timeline
  // from the point where that slide is visible so auto-play resumes naturally.
  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (isTransitioning.current) return;
      const slides = slideRefs.current.filter(
        (el): el is HTMLDivElement => el !== null
      );
      if (slides.length === 0) return;

      const currentIndex = activeIndexRef.current;
      if (targetIndex === currentIndex) return;

      isTransitioning.current = true;

      // Pause auto-scroll while we manually transition
      timelineRef.current?.pause();

      gsap.to(slides[currentIndex], {
        opacity: 0,
        duration: FADE_DURATION,
        ease: "power2.inOut",
      });
      gsap.to(slides[targetIndex], {
        opacity: 1,
        duration: FADE_DURATION,
        ease: "power2.inOut",
        onComplete: () => {
          activeIndexRef.current = targetIndex;
          setActiveIndex(targetIndex);
          isTransitioning.current = false;

          // Jump the looping timeline to the moment right after targetIndex
          // becomes visible so auto-play waits the full SLIDE_DURATION before
          // advancing. Each cycle in the timeline is SLIDE_DURATION + FADE_DURATION.
          const cycleLength = SLIDE_DURATION + FADE_DURATION;
          const resumeTime = targetIndex * cycleLength + FADE_DURATION;
          timelineRef.current?.play(resumeTime);
        },
      });
    },
    [images.length]
  );

  const goToPrev = useCallback(() => {
    const prev =
      (activeIndexRef.current - 1 + images.length) % images.length;
    goToSlide(prev);
  }, [goToSlide, images.length]);

  const goToNext = useCallback(() => {
    const next = (activeIndexRef.current + 1) % images.length;
    goToSlide(next);
  }, [goToSlide, images.length]);

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      <div
        className="group relative aspect-[16/9] w-full overflow-hidden rounded-md border border-secondary"
        onMouseEnter={() => timelineRef.current?.pause()}
        onMouseLeave={() => {
          if (!isTransitioning.current) timelineRef.current?.resume();
        }}
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt={`${alt} — image ${i + 1}`}
              fill
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 900px"
              className="object-cover"
            />
          </div>
        ))}

        {/* Arrow buttons — visible on hover */}
        {/* Arrows visible by default on touch devices; hover-reveal preserved at md+. */}
        <button
          onClick={goToPrev}
          aria-label="Previous image"
          className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full border border-secondary bg-secondary/30 p-1 text-secondary opacity-100 backdrop-blur-sm transition-opacity md:left-2 md:p-2 md:opacity-0 md:group-hover:opacity-100"
        >
          <ChevronLeft className="h-3.5 w-3.5 transition-transform hover:scale-150 md:h-6 md:w-6" />
        </button>
        <button
          onClick={goToNext}
          aria-label="Next image"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full border border-secondary bg-secondary/30 p-1 text-secondary opacity-100 backdrop-blur-sm transition-opacity md:right-2 md:p-2 md:opacity-0 md:group-hover:opacity-100"
        >
          <ChevronRight className="h-3.5 w-3.5 transition-transform hover:scale-150 md:h-6 md:w-6" />
        </button>
      </div>

      <div className="flex justify-center gap-1.5">
        {images.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors duration-300",
              i === activeIndex ? "bg-accent" : "bg-primary/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}

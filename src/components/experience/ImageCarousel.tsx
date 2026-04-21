"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: [string, string, string];
  alt: string;
}

const SLIDE_DURATION = 4; // seconds each slide is visible before crossfading
const FADE_DURATION = 0.8; // seconds the crossfade itself takes

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
          .call(() => setActiveIndex(nextIndex), [], "<");
      });

      timelineRef.current = tl;
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      <div
        className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-secondary"
        onMouseEnter={() => timelineRef.current?.pause()}
        onMouseLeave={() => timelineRef.current?.resume()}
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
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
            />
          </div>
        ))}
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FaGithub, FaLinkedin, FaFileAlt } from "react-icons/fa";
import { siteConfig } from "@/data/site";

const pillLinks = [
  { href: siteConfig.resume, label: "Resume", icon: <FaFileAlt size={20} />, newTab: true },
  { href: siteConfig.linkedin, label: "LinkedIn", icon: <FaLinkedin size={20} />, newTab: true },
  { href: siteConfig.github, label: "GitHub", icon: <FaGithub size={20} />, newTab: true },
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Name slides in from the left with a subtle skew that straightens out
      tl.from(nameRef.current, {
        opacity: 0,
        x: -50,
        skewX: 4,
        duration: 0.9,
        ease: "power3.out",
      });

      // Photo scales up from slightly smaller with a rotation unwind
      tl.from(
        photoRef.current,
        {
          opacity: 0,
          scale: 0.8,
          rotation: 5,
          duration: 1.0,
          ease: "power2.out",
        },
        0.3
      );

      // Description lines cascade in one by one
      tl.from(
        descRef.current?.children ?? [],
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
        },
        0.7
      );

      // Buttons pop in with a bounce
      tl.from(
        buttonsRef.current?.children ?? [],
        {
          opacity: 0,
          scale: 0.85,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        1.1
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="mx-auto flex max-w-6xl items-center justify-between gap-16 px-6 py-28"
    >
      <div className="flex flex-col gap-5">
        <h1
          ref={nameRef}
          className="whitespace-nowrap font-display text-8xl font-bold leading-tight text-text"
        >
          Sebastian Noel
        </h1>

        <div ref={descRef} className="flex flex-col gap-2">
          <p className="text-3xl text-primary">
            Software Engineer, Researcher, and Leader
          </p>
          <p className="text-xl text-primary/60">
            Computer Science at the University of Central Florida
          </p>
        </div>

        <div ref={buttonsRef} className="flex gap-3">
          {pillLinks.map(({ href, label, icon, newTab }) => (
            <Link
              key={label}
              href={href}
              target={newTab ? "_blank" : undefined}
              rel={newTab ? "noopener noreferrer" : undefined}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-secondary px-5 py-2.5 text-sm text-primary transition-colors hover:border-accent hover:text-accent"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
              }}
            >
              {/* Spotlight gradient */}
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgb(from var(--color-accent) r g b / 0.2), transparent 65%)",
                }}
              />
              <span className="relative z-10">{label}</span>
              <span className="relative z-10">{icon}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* scale-110 on the image zooms into the subject within the clipped circle */}
      <div
        ref={photoRef}
        className="relative h-[320px] w-[320px] shrink-0 overflow-hidden rounded-full"
      >
        <Image
          src="/images/headshot.jpg"
          alt="Sebastian Noel"
          fill
          className="scale-110 object-cover"
          priority
        />
      </div>
    </section>
  );
}

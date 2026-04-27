"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaGithub, FaLinkedin, FaFileAlt } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site";
import IconLink from "./IconLink";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/media", label: "Media" },
];

const externalLinks = [
  { href: siteConfig.github, label: "GitHub", icon: <FaGithub size={30} /> },
  { href: siteConfig.linkedin, label: "LinkedIn", icon: <FaLinkedin size={30} /> },
  { href: siteConfig.resume, label: "Resume", icon: <FaFileAlt size={30} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-secondary bg-background/80 backdrop-blur-sm">
      {/* Desktop layout (md+) — unchanged 3-col grid. Hidden on mobile. */}
      <nav className="mx-auto hidden max-w-6xl grid-cols-3 items-center px-6 py-4 md:grid">
        <div className="flex justify-start">
          <Link
            href="/"
            className=" text-lg font-medium text-text transition-colors hover:text-accent"
          >
            snoel.dev
          </Link>
        </div>

        <div className="flex items-center justify-center gap-8">
          {navLinks.map(({ href, label }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative transition-[font-size,color] duration-300 hover:text-accent",
                  isActive ? "text-base text-accent" : "text-sm text-primary"
                )}
              >
                {label}
                {/* Underline bar. Active: always visible. Inactive: grows left→right on hover.
                    origin-left + scaleX transition creates the left-to-right reveal effect. */}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left transition-transform duration-300",
                    isActive
                      ? "scale-x-100 bg-primary"
                      : "scale-x-0 bg-current group-hover:scale-x-100"
                  )}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-4">
          {externalLinks.map(({ href, label, icon }) => (
            <IconLink
              key={label}
              href={href}
              label={label}
              icon={icon}
              newTab
              tooltipPosition="bottom"
            />
          ))}
        </div>
      </nav>

      {/* Mobile layout (<md) — logo + hamburger toggle. */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:hidden">
        <Link
          href="/"
          className="text-base font-medium text-text transition-colors hover:text-accent"
        >
          snoel.dev
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-primary transition-colors hover:text-accent"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile dropdown panel — collapses height when closed. */}
      <div
        className={cn(
          "overflow-hidden border-secondary bg-background/95 backdrop-blur-sm transition-[max-height,border-width] duration-300 md:hidden",
          open ? "max-h-96 border-t" : "max-h-0 border-t-0"
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-3">
          {navLinks.map(({ href, label }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={cn(
                  "rounded-md px-3 py-2 text-base transition-colors",
                  isActive
                    ? "bg-secondary/30 text-accent"
                    : "text-primary hover:bg-secondary/20 hover:text-accent"
                )}
              >
                {label}
              </Link>
            );
          })}
          <div className="mt-2 flex items-center justify-center gap-6 border-t border-secondary pt-3">
            {externalLinks.map(({ href, label, icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                onClick={closeMenu}
                className="text-primary transition-colors hover:text-accent"
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

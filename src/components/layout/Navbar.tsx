"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin, FaFileAlt } from "react-icons/fa";
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

  return (
    <header className="sticky top-0 z-50 border-b border-secondary bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto grid max-w-6xl grid-cols-3 items-center px-6 py-4">
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
    </header>
  );
}

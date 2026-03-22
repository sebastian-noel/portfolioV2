import Link from "next/link";
import { cn } from "@/lib/utils";

interface IconLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  newTab?: boolean;
  tooltipPosition?: "top" | "bottom";
  className?: string;
}

export default function IconLink({
  href,
  label,
  icon,
  newTab = false,
  tooltipPosition = "bottom",
  className,
}: IconLinkProps) {
  return (
    <div className="group relative flex items-center justify-center">
      <Link
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        aria-label={label}
        className={cn(
          "text-primary transition-colors hover:text-accent",
          className
        )}
      >
        {icon}
      </Link>
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-secondary px-2 py-1 text-xs text-text opacity-0 transition-opacity group-hover:opacity-100",
          tooltipPosition === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
        )}
      >
        {label}
      </span>
    </div>
  );
}

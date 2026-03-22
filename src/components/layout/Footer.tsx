import { FaGithub, FaLinkedin, FaDiscord, FaEnvelope } from "react-icons/fa";
import { siteConfig } from "@/data/site";
import IconLink from "./IconLink";

const footerLinks = [
  { href: siteConfig.github, label: "GitHub", icon: <FaGithub size={30} />, newTab: true },
  { href: siteConfig.linkedin, label: "LinkedIn", icon: <FaLinkedin size={30} />, newTab: true },
  { href: siteConfig.discord, label: "Discord", icon: <FaDiscord size={30} />, newTab: true },
  { href: siteConfig.email, label: "Email", icon: <FaEnvelope size={30} />, newTab: false },
];

export default function Footer() {
  return (
    <footer className="border-t border-secondary">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-6">
        <div className="flex items-center gap-6">
          {footerLinks.map(({ href, label, icon, newTab }) => (
            <IconLink
              key={label}
              href={href}
              label={label}
              icon={icon}
              newTab={newTab}
              tooltipPosition="top"
            />
          ))}
        </div>
        <p className="text-xs text-primary">© 2026 Sebastian Noel. All rights reserved.</p>
      </div>
    </footer>
  );
}

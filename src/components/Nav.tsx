"use client";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavUser } from "@/components/NavUser";
import {
  IconBeaker,
  IconComputer,
  IconGitHub,
  IconHome,
  IconNewspaper,
  IconNextGen,
  IconWarning,
} from "@/components/Icons";

export function Nav() {
  const pathname = usePathname();

  const links = [
    { text: "Home", href: "/", icon: <IconHome /> },
    { text: "Dashboard", href: "/dashboard", icon: <IconComputer /> },
    { text: "Laboratory", href: "/laboratory", icon: <IconBeaker /> },
    { text: "Other Page", href: "/other-page", icon: <IconNewspaper /> },
  ];
  const isActive = (href: string) => {
    return pathname === href || (pathname.startsWith(href) && href !== "/");
  };

  type PopoverElement = HTMLElement & {
    showPopover?: () => void;
    hidePopover?: () => void;
  };
  const navRef = useRef<PopoverElement | null>(null);
  const hideNav = () => {
    // Hide nav after clicking a link on mobile mode
    navRef.current?.hidePopover();
  };

  return (
    <nav ref={navRef} id="nav" popover="auto" className="noselect">
      <Link id="nav-header" className="nav-preview" href="/">
        <IconNextGen />
        <span className="nav-reveal">NextGen</span>
      </Link>
      <ul id="nav-links">
        {links.map((link) => (
          <li key={link.text}>
            <Link
              href={link.href}
              onClick={hideNav}
              className={`nav-preview${isActive(link.href) ? " active-link" : ""}`}>
              {link.icon}
              <span className="nav-reveal">{link.text}</span>
            </Link>
          </li>
        ))}
        <li>
          <a href="https://nextgen-template.vercel.app/not-found" className="nav-preview">
            <IconWarning />
            <span className="nav-reveal">Not Found</span>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/MGSimard/nextgen-template"
            target="_blank"
            onClick={hideNav}
            className="nav-preview">
            <IconGitHub />
            <span className="nav-reveal">GitHub</span>
          </a>
        </li>
      </ul>
      <NavUser hideNav={hideNav} />
    </nav>
  );
}

"use client";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavUser } from "@/components/NavUser";
import { IconComputer, IconHome, IconNewspaper, IconNextGen, IconWarning } from "@/components/Icons";

export function Nav() {
  const pathname = usePathname();

  const links = [
    { text: "Home", href: "/", icon: <IconHome /> },
    { text: "Dashboard", href: "/dashboard", icon: <IconComputer /> },
    { text: "Other Page", href: "/other-page", icon: <IconNewspaper /> },
    { text: "Not Found", href: "/does-not-exist", icon: <IconWarning /> },
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
      <div id="nav-top">
        <Link id="nav-logo" className="nav-preview" href="/">
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
        </ul>
      </div>
      <NavUser hideNav={hideNav} />
    </nav>
  );
}

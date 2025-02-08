"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { IconPowerOn, IconPowerOff } from "@/components/Icons";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => setMounted(true), []);

  return (
    <button type="button" onClick={themeToggle} id="theme-toggle" title="Toggle theme" aria-label="Toggle theme">
      {mounted && (resolvedTheme === "light" ? <IconPowerOn /> : <IconPowerOff />)}
    </button>
  );
}

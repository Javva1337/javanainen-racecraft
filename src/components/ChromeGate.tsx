"use client";

import { usePathname } from "next/navigation";

/** Startsidorna (/ och /en) har egen nav och footer — dölj den vanliga där. */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/en") return null;
  return <>{children}</>;
}

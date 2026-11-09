"use client";

import { usePathname } from "next/navigation";

/** Startsidorna (/ och /en) har egen nav och footer — dölj den vanliga där. */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/en") return null;
  return <>{children}</>;
}

/** Undersidor får <main> med topp-padding; startsidorna renderar egen header/main/footer. */
export function MainGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/en") return <>{children}</>;
  return <main className="pt-16">{children}</main>;
}

"use client";

import { CareerStoryProvider } from "@/components/career/CareerStoryProvider";

/** Lenis + ScrollTrigger för startsidan (samma motor som /karriar, av vid reduced motion). */
export function HomeScroll({ children }: { children: React.ReactNode }) {
  return <CareerStoryProvider>{children}</CareerStoryProvider>;
}

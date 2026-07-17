import { gsap } from "gsap";

/**
 * Delade matchMedia-villkor för berättelsens animationslager.
 * Reduced motion får aldrig några tweens — slutlägena är server-renderade.
 * Mobil (≤768 px) får in-view-reveals i stället för pins.
 */
export const DESKTOP_MOTION = "(min-width: 769px) and (prefers-reduced-motion: no-preference)";
/** 768.99 (inte 768) — annars uppstår en död zon vid fraktionella viewportbredder (zoom) */
export const MOBILE_MOTION = "(max-width: 768.99px) and (prefers-reduced-motion: no-preference)";
export const ANY_MOTION = "(prefers-reduced-motion: no-preference)";

/**
 * Räknartween: tickar ett tal i ett element (tabulär typografi förutsätts).
 * OBS: anroparen ansvarar för att återställa ursprungstexten i matchMedia-
 * kontextens cleanup, så att reduced motion/breakpoint-byten blir rena.
 */
export function counterTween(
  element: HTMLElement,
  {
    from,
    to,
    format = String,
    ...vars
  }: { from: number; to: number; format?: (n: number) => string } & gsap.TweenVars,
) {
  const state = { value: from };
  element.textContent = format(from);
  return gsap.to(state, {
    ease: "none",
    ...vars,
    value: to,
    onUpdate: () => {
      element.textContent = format(Math.round(state.value));
    },
  });
}

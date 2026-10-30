/** Små textverktyg för startsidans copy. */

export const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

/** Engelskt ordningstal: 1st, 2nd, 3rd, 4th, 11th, 21st, 101st … */
export const ordinalEn = (n: number): string => {
  const v = n % 100;
  const suffix =
    v >= 11 && v <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${suffix}`;
};

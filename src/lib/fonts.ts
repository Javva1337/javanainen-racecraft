import { Archivo, Inter } from "next/font/google";

/** Rubriker: Archivo (variabel, med width-axel för expanderat motorsportuttryck) */
export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

/** Brödtext: Inter */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

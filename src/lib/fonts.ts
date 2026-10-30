import { Archivo, Geist, Geist_Mono, Inter } from "next/font/google";

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

/** Startsidan (Ben 1:1): Geist + Geist Mono — laddas bara där variablerna används */
export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

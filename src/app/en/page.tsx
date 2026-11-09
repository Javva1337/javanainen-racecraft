import type { Metadata } from "next";
import { BenHome } from "@/components/ben/BenHome";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: DEFAULT_TITLE.en },
  description: DEFAULT_DESCRIPTION.en,
  alternates: {
    canonical: "/en",
    languages: { "sv-SE": "/", en: "/en", "x-default": "/" },
  },
  openGraph: { locale: "en_US" },
};

export default function HomePage() {
  return <BenHome lang="en" />;
}

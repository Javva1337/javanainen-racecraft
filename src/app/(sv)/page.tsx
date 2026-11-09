import type { Metadata } from "next";
import { BenHome } from "@/components/ben/BenHome";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: DEFAULT_TITLE.sv },
  description: DEFAULT_DESCRIPTION.sv,
  alternates: {
    canonical: "/",
    languages: { "sv-SE": "/", en: "/en", "x-default": "/" },
  },
};

export default function HomePage() {
  return <BenHome lang="sv" />;
}

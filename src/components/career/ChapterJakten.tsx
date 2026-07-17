import { CHAPTERS } from "@/lib/career-story";
import { ChapterSection } from "./ChapterSection";
import { ClimbCounter } from "./ClimbCounter";
import { FieldCounter } from "./FieldCounter";
import { GalleryStripe, type StripeItem } from "./GalleryStripe";

const chapter = CHAPTERS.find((c) => c.id === "jakten")!;

/** Bildtexter "Plats, År" — samma verifierade uppgifter som i lib/media.ts. */
const STRIPE_ITEMS: StripeItem[] = [
  {
    kind: "image",
    src: "/images/gallery-1.jpg",
    alt: "Action på banan i VM 2017",
    caption: "Spanien, 2017",
  },
  {
    kind: "image",
    src: "/images/gallery-2.jpg",
    alt: "Fokus före start i VM 2018",
    caption: "Polen, 2018",
  },
  {
    kind: "stat",
    years: "SRKC · 2021",
    value: "6:a",
    label: "totalt i finalen — näst bästa svensk.",
  },
];

/** Kapitel 05 — Jakten (2017–2021): största startfältet, andra SRKC-titeln, klättringen i Polen. */
export function ChapterJakten() {
  return (
    <ChapterSection
      chapter={chapter}
      lang="sv"
      lede="Spanien, Göteborg, Polen. Jämnheten byggdes race för race."
    >
      {/* Spanien 2017 — det bärande talet */}
      <div className="mt-12 sm:mt-16">
        <FieldCounter />
      </div>

      {/* SRKC Göteborg 2018 — andra titeln */}
      <p className="mt-14 max-w-2xl text-base leading-relaxed text-mist sm:mt-20 sm:text-lg">
        2018 kom den andra SRKC-titeln: <span className="text-snow">vinst i SRKC Göteborg.</span>{" "}
        Och i VM i Polen samma år, ett finalrace att minnas:
      </p>

      <div className="mt-8">
        <ClimbCounter />
      </div>

      <GalleryStripe items={STRIPE_ITEMS} />
    </ChapterSection>
  );
}

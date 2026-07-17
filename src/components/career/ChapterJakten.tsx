import { CHAPTERS } from "@/lib/career-story";
import { ChapterSection } from "./ChapterSection";
import { ClimbCounter } from "./ClimbCounter";
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
      lede="Spanien, Göteborg, Polen. Jämnheten byggdes race för race."
    >
      {/* Spanien 2017 — det bärande talet */}
      <div className="mt-12 sm:mt-16" data-field-172>
        <p className="flex flex-wrap items-baseline gap-x-5">
          <span
            data-count-172
            className="heading-caps tabular text-[clamp(5rem,18vw,12rem)] font-extrabold leading-none text-snow"
          >
            172
          </span>
          <span className="heading-caps text-sm tracking-[0.12em] text-mist sm:text-lg">
            förare — största startfältet hittills.
          </span>
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist sm:text-lg" data-chapter-copy>
          VM i Spanien 2017: 12:e av 172. 5:a med Sverige i Nations Cup.
        </p>
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

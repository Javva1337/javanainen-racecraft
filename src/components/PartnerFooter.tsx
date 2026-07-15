import Image from "next/image";
import { DICT, type Lang } from "@/lib/dictionary";
import { PARTNERS } from "@/lib/site";

/** Obligatorisk partnerfot i varje artikel — samma placering varje dag. */
export function PartnerFooter({ lang }: { lang: Lang }) {
  const t = DICT[lang].article;
  return (
    <aside className="mt-12 border border-line bg-midnight-800 px-6 py-6">
      <p className="heading-caps mb-4 text-xs tracking-[0.14em] text-mist-dim">
        {t.partnerFooter}{" "}
        <span className="text-mist">Labatus</span>
        {" & "}
        <span className="text-mist">Primab</span>
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {PARTNERS.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center rounded-sm px-4 py-2.5 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] ${
              partner.chip === "light" ? "bg-snow" : "border border-line"
            }`}
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              width={110}
              height={32}
              className="h-7 w-auto object-contain"
            />
          </a>
        ))}
      </div>
    </aside>
  );
}

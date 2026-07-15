import { DICT, type Lang } from "@/lib/dictionary";
import type { VmStatus } from "@/lib/vm-status";

/**
 * Aktuell VM-ställning i stor typografi — läser content/vm-status.json.
 * Visas på /vm-2026 under tävlingsveckan.
 */
export function LiveStanding({ status, lang }: { status: VmStatus; lang: Lang }) {
  const t = DICT[lang].article.factBox;
  const updatedLabel = lang === "sv" ? "Uppdaterad" : "Updated";

  const cells = [
    { label: t.standing, value: status.standing, isKey: true },
    { label: t.heatsRaced, value: String(status.heatsRaced), isKey: false },
    { label: t.bestFinish, value: status.bestFinish, isKey: false },
    { label: t.nationsCup, value: status.nationsCupPosition, isKey: false },
  ];

  return (
    <section aria-label={lang === "sv" ? "Aktuell VM-ställning" : "Current standings"}>
      <div className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
        {cells.map((cell) => (
          <div key={cell.label} className="flex flex-col gap-2 bg-midnight-800 p-6">
            <span className="heading-caps text-[0.65rem] tracking-[0.14em] text-mist-dim">
              {cell.label}
            </span>
            <span
              className={`heading-caps tabular font-bold leading-none ${
                cell.isKey ? "text-6xl text-flagyellow sm:text-7xl" : "text-4xl text-snow sm:text-5xl"
              }`}
            >
              {cell.value}
            </span>
          </div>
        ))}
      </div>
      <p className="tabular mt-2 text-xs text-mist-dim">
        {updatedLabel}: {status.updatedAt}
      </p>
    </section>
  );
}

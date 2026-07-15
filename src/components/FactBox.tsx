import type { ArticleFrontmatter } from "@/lib/content";
import { DICT, type Lang } from "@/lib/dictionary";

/**
 * Faktarutan överst i race-rapporter — renderas automatiskt när
 * frontmatter-fälten finns. Den som bara skummar får ändå dagens siffror.
 */
export function FactBox({
  frontmatter,
  lang,
}: {
  frontmatter: ArticleFrontmatter;
  lang: Lang;
}) {
  const t = DICT[lang].article.factBox;
  const facts = [
    { label: t.heatsRaced, value: frontmatter.heatsRaced },
    { label: t.bestFinish, value: frontmatter.bestFinish },
    { label: t.standing, value: frontmatter.standing },
    { label: t.nationsCup, value: frontmatter.nationsCup },
  ].filter((fact) => fact.value !== undefined && fact.value !== "");

  if (facts.length === 0) return null;

  return (
    <dl className="mb-10 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-4">
      {facts.map((fact) => (
        <div key={fact.label} className="flex flex-col gap-1 bg-midnight-800 px-4 py-4">
          <dt className="heading-caps text-[0.65rem] tracking-[0.14em] text-mist-dim">
            {fact.label}
          </dt>
          <dd className="heading-caps tabular text-2xl font-bold text-flagyellow">
            {String(fact.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

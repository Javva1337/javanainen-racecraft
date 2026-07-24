import { DICT, type Lang } from "@/lib/dictionary";
import { LIVE } from "@/lib/site";

/**
 * De två livelänkarna — tidtagning och sändning — i racing-stuk.
 * Det här är vad läsarna oftast letar efter under tävlingsdagarna,
 * så blocket används överallt där racen diskuteras: startsidans
 * teaser, VM-sidan och Nations Cup-sidan. URL:erna bor i LIVE i site.ts.
 */
export function LiveLinks({ lang, className = "" }: { lang: Lang; className?: string }) {
  const t = DICT[lang].live;

  const links = [
    {
      href: LIVE.timing,
      label: t.timingLabel,
      desc: t.timingDesc,
      icon: (
        <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
          <span className="absolute inset-0 animate-ping bg-flagyellow/60" />
          <span className="relative h-2.5 w-2.5 bg-flagyellow" />
        </span>
      ),
    },
    {
      href: LIVE.broadcast,
      label: t.broadcastLabel,
      desc: t.broadcastDesc,
      icon: (
        <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0 fill-flagyellow" aria-hidden="true">
          <path d="M2 1l9 5-9 5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-4 border border-flagyellow/60 bg-midnight-800 p-4 transition-colors duration-200 hover:border-flagyellow hover:bg-flagyellow/10 sm:p-5"
        >
          <span className="flex items-center gap-3">
            {link.icon}
            <span>
              <span className="heading-caps block text-sm tracking-[0.12em] text-flagyellow">
                {link.label}
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-mist">{link.desc}</span>
            </span>
          </span>
          <span
            className="text-flagyellow transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            →
          </span>
        </a>
      ))}
    </div>
  );
}

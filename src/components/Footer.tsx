import Image from "next/image";
import Link from "next/link";
import { DICT, type Lang } from "@/lib/dictionary";
import { PARTNERS, SOCIAL, TAGLINE } from "@/lib/site";
import { Kurbits } from "./Kurbits";
import { NationBadge } from "./NationBadge";
import { NewsletterForm } from "./NewsletterForm";

export function Footer({ lang }: { lang: Lang }) {
  const t = DICT[lang].footer;
  const nav = DICT[lang].nav;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-midnight-800">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-10 flex justify-center text-flagblue" aria-hidden="true">
          <Kurbits className="h-9 w-64 opacity-70" />
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="heading-caps mb-3 text-sm font-bold tracking-[0.16em] text-snow">
              Rickard Javanainen
            </p>
            <p className="mb-4 text-sm leading-relaxed text-mist">{TAGLINE[lang]}</p>
            <NationBadge />
          </div>

          <nav aria-label={t.navHeading}>
            <p className="heading-caps mb-3 text-xs tracking-[0.14em] text-mist-dim">
              {t.navHeading}
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {nav.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-mist transition-colors duration-200 hover:text-snow"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/press"
                  className="text-mist transition-colors duration-200 hover:text-snow"
                >
                  {t.press}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="heading-caps mb-3 text-xs tracking-[0.14em] text-mist-dim">
              {t.partnersHeading}
            </p>
            <div className="flex flex-col items-start gap-3">
              {PARTNERS.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center rounded-sm px-3 py-2 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] ${
                    partner.chip === "light" ? "bg-snow" : "border border-line"
                  }`}
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={96}
                    height={28}
                    className="h-6 w-auto object-contain"
                  />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="heading-caps mb-3 text-xs tracking-[0.14em] text-mist-dim">
              {t.newsletterHeading}
            </p>
            <p className="mb-3 text-sm text-mist">{t.newsletterText}</p>
            <NewsletterForm lang={lang} />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-mist-dim sm:flex-row">
          <p>
            © {year} Rickard Javanainen. {t.rights}
          </p>
          <p className="heading-caps tracking-[0.14em]">{t.builtIn}</p>
          <div className="flex gap-4">
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-snow"
            >
              Instagram
            </a>
            <a
              href={SOCIAL.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-snow"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

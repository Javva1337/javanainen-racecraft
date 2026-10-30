import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import type { Lang } from "@/lib/dictionary";
import { CHANNELS } from "@/lib/ben-home";
import { geist, geistMono } from "@/lib/fonts";
import { CONTACT_EMAIL, PARTNERS, SITE_NAME, SOCIAL, STUDIO } from "@/lib/site";
import { BenHero } from "./BenHero";
import { BenJourney } from "./BenJourney";
import "./ben-home.css";

const COPY = {
  sv: {
    nav: { story: "STORY", tracks: "BANOR", partners: "PARTNERS", aria: "Huvudmeny" },
    findHead: ["VAR DU", "HITTAR MIG."],
    partHead: "PARTNERS",
    parts: [
      {
        n: "01",
        title: "PARTNERS",
        text: "Primab har följt satsningen från start. Labatus är ny för 2026. Tack till båda för att jag kan åka.",
        cta: null,
      },
      {
        n: "02",
        title: "SAMARBETE",
        text: "Vill du följa satsningen eller vara med i den? Skriv några rader så hör jag av mig.",
        cta: { label: "KONTAKT", href: "/kontakt" },
      },
      {
        n: "03",
        title: "MEDIA",
        text: "Här finns pressbilder och fakta om VM-brons 2016 och KWC 2026.",
        cta: { label: "PRESS", href: "/press" },
      },
    ],
    footTag: "Hyrkartförare från Dalarna.",
    newsHead: "NYHETSBREV",
    newsText: "Få racerapporterna när de kommer.",
    builtBy: "Sajten är byggd av",
    rights: "Alla rättigheter förbehållna.",
    tracksHref: "/vm-2026",
  },
  en: {
    nav: { story: "STORY", tracks: "TRACKS", partners: "PARTNERS", aria: "Main menu" },
    findHead: ["WHERE YOU'LL", "FIND ME."],
    partHead: "PARTNERS",
    parts: [
      {
        n: "01",
        title: "PARTNERS",
        text: "Primab has backed the effort from the start. Labatus is new for 2026. Thanks to both for making it possible for me to race.",
        cta: null,
      },
      {
        n: "02",
        title: "WORKING TOGETHER",
        text: "Want to follow the effort or be part of it? Send a few lines and I'll get back to you.",
        cta: { label: "CONTACT", href: "/en/contact" },
      },
      {
        n: "03",
        title: "MEDIA",
        text: "Press photos and facts about the 2016 Worlds bronze and KWC 2026.",
        cta: { label: "PRESS", href: "/en/press" },
      },
    ],
    footTag: "Rental kart racer from Dalarna.",
    newsHead: "NEWSLETTER",
    newsText: "Get the race reports when they land.",
    builtBy: "Site built by",
    rights: "All rights reserved.",
    tracksHref: "/en/vm-2026",
  },
} as const;

function Icon({ name }: { name: string }) {
  const p = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": true } as const;
  switch (name) {
    case "instagram":
      return (
        <svg {...p}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17" cy="7" r="0.6" fill="currentColor" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...p}>
          <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" strokeLinejoin="round" />
        </svg>
      );
    case "flag":
      return (
        <svg {...p}>
          <path d="M5 21V4M5 4h14l-3 4 3 4H5" strokeLinejoin="round" />
        </svg>
      );
    case "news":
      return (
        <svg {...p}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" strokeLinejoin="round" />
        </svg>
      );
  }
}

export function BenHome({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const home = lang === "sv" ? "/" : "/en";

  return (
    <div className={`ben-home ${geist.variable} ${geistMono.variable}`}>
      {/* 0 — sticky nav */}
      <header className="bn" role="banner">
        <Link href={home} className="bn-logo">
          RICKARD
          <br />
          JAVANAINEN
        </Link>
        <nav aria-label={t.nav.aria}>
          <ul>
            <li><a href="#story">{t.nav.story}</a></li>
            <li><Link href={t.tracksHref}>{t.nav.tracks}</Link></li>
            <li><a href="#partners">{t.nav.partners}</a></li>
            <li className="bn-lang">
              <Link href="/" hrefLang="sv" lang="sv" aria-label="Svenska" aria-current={lang === "sv" ? "true" : undefined}>SV</Link>
              {" / "}
              <Link href="/en" hrefLang="en" lang="en" aria-label="English" aria-current={lang === "en" ? "true" : undefined}>EN</Link>
            </li>
          </ul>
        </nav>
      </header>

      <h1 className="sr-only">
        {SITE_NAME} — {lang === "sv" ? "hyrkartförare" : "rental kart racer"}
      </h1>

      {/* H — hero */}
      <BenHero lang={lang} />

      {/* 1 — journey */}
      <BenJourney lang={lang} />

      {/* 2 — var du hittar mig */}
      <section id="channels" className="bc" aria-labelledby="bc-h">
        <h2 id="bc-h" className="bc-head">
          {t.findHead[0]}
          <br />
          {t.findHead[1]}
        </h2>
        <ul className="bc-list">
          {CHANNELS.map((c) => {
            const href = lang === "en" && c.hrefEn ? c.hrefEn : c.href;
            const inner = (
              <>
                <div className="bc-name">
                  <span className="bc-title">
                    {c.name}
                    <span className="bc-icon"><Icon name={c.icon} /></span>
                  </span>
                  <span className="bc-handle">{c.handle}</span>
                </div>
                <p className="bc-text">{c.text[lang]}</p>
              </>
            );
            return (
              <li key={c.name}>
                {c.external ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="bc-row">
                    {inner}
                  </a>
                ) : (
                  <Link href={href} className="bc-row">{inner}</Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* 3 — partners */}
      <section id="partners" className="bp" aria-labelledby="bp-h">
        <h2 id="bp-h" className="sr-only">{t.partHead}</h2>
        <ol className="bp-list">
          {t.parts.map((p) => (
            <li key={p.n} className="bp-row">
              <span className="bp-n">{p.n}</span>
              <h3 className="bp-title">{p.title}</h3>
              <div className="bp-body">
                <p>{p.text}</p>
                {p.cta && (
                  <Link href={p.cta.href} className="bp-cta">{p.cta.label} →</Link>
                )}
              </div>
            </li>
          ))}
        </ol>
        <ul className="bp-logos">
          {PARTNERS.map((partner) => (
            <li key={partner.name}>
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`bp-logo ${partner.chip === "light" ? "is-light" : ""}`}
                aria-label={partner.name}
              >
                <Image src={partner.logo} alt={partner.name} width={160} height={48} />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 — footer */}
      <footer className="bf" role="contentinfo">
        <div className="bf-top">
          <p className="bf-name">
            RICKARD
            <br />
            JAVANAINEN
          </p>
          <div className="bf-news">
            <p className="bf-label">{t.newsHead}</p>
            <p className="bf-note">{t.newsText}</p>
            <NewsletterForm lang={lang} />
          </div>
        </div>
        <div className="bf-bottom">
          <p>{t.footTag}</p>
          <ul className="bf-social">
            <li><a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer">INSTAGRAM</a></li>
            <li><a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer">FACEBOOK</a></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`}>{lang === "sv" ? "E-POST" : "EMAIL"}</a></li>
          </ul>
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. {t.rights} {t.builtBy}{" "}
            <a href={STUDIO.url} target="_blank" rel="noopener noreferrer">{STUDIO.name}</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}

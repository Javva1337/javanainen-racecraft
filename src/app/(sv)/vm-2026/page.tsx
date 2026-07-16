import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Countdown } from "@/components/Countdown";
import { CountUp } from "@/components/CountUp";
import { SportsEventJsonLd } from "@/components/JsonLd";
import { KurbitsDivider } from "@/components/Kurbits";
import { LiveStanding } from "@/components/LiveStanding";
import { NationBadge } from "@/components/NationBadge";
import { Reveal } from "@/components/Reveal";
import { getAllArticles } from "@/lib/content";
import { getSiteMode } from "@/lib/mode";
import { KWC, SOCIAL } from "@/lib/site";
import { getVmStatus } from "@/lib/vm-status";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "VM 2026 — hyrkart-VM i Vandel, Danmark",
  description:
    "Allt om Kart World Championship 2026: schema, format och dagliga rapporter. Nations Cup 25–26 juli, KWC Individual 28 juli–1 augusti. 180 förare, 20:e upplagan. Rickard Javanainen kör för Sverige.",
  alternates: {
    canonical: "/vm-2026",
    languages: { "sv-SE": "/vm-2026", en: "/en/vm-2026", "x-default": "/vm-2026" },
  },
};

const SCHEDULE = [
  { dates: "22 juli", label: "VM-veckan börjar", detail: "20:e upplagan av Kart World Championship öppnar på Vandel Kart" },
  { dates: "25–26 juli", label: "Nations Cup", detail: "Lagtävlingen, Rickard kör för Sverige", highlight: true },
  { dates: "28 juli–1 augusti", label: "KWC Individual", detail: "Det individuella världsmästerskapet: kvalheat, semifinal och final", highlight: true },
];

const FORMAT_STATS = [
  { value: 8, label: "kvalheat" },
  { value: 1, label: "semifinal" },
  { value: 18, label: "finalister" },
];

export default function VmPage() {
  const mode = getSiteMode();
  const status = getVmStatus();
  const articles = getAllArticles("sv");
  const dayReports = articles.filter((a) => typeof a.frontmatter.day === "number");
  const vmArticles = articles.filter((a) => a.frontmatter.category === "VM 2026");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-14">
        <NationBadge className="mb-4" />
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-6xl">VM 2026</h1>
        <p className="mt-4 max-w-2xl text-lg text-mist">
          Kart World Championship · 20:e upplagan · {KWC.venue}, Danmark ·{" "}
          <span className="tabular">{KWC.datesLabel.sv}</span> ·{" "}
          <span className="tabular">180</span> förare
        </p>
      </header>

      {/* Lägesberoende block */}
      {mode === "before" && (
        <section className="mb-16 border border-line bg-midnight-800 p-5 sm:p-8" aria-label="Nedräkning">
          <p className="heading-caps mb-4 text-xs tracking-[0.16em] text-mist-dim">
            Nations Cup · {KWC.nationsCupLabel.sv}
          </p>
          <Countdown target={KWC.nationsCupStart} lang="sv" />
        </section>
      )}

      {mode === "during" && status && (
        <div className="mb-16">
          <h2 className="heading-caps mb-6 text-2xl font-bold text-snow">Läget just nu</h2>
          <LiveStanding status={status} lang="sv" />
        </div>
      )}

      {mode === "after" && (
        <section className="mb-16 border border-line bg-midnight-800 p-8">
          <h2 className="heading-caps mb-3 text-2xl font-bold text-snow">VM 2026 — så gick det</h2>
          <p className="max-w-2xl text-mist">
            Tävlingsveckan är avslutad. Alla dagsrapporter finns samlade nedan, summeringen
            publiceras under Nyheter.
          </p>
        </section>
      )}

      {/* Dagens/alla rapporter under och efter VM */}
      {dayReports.length > 0 && (
        <section className="mb-16" aria-label="VM-rapporter">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="heading-caps text-2xl font-bold text-snow">
              {mode === "during" ? "Dagens rapporter" : "VM-rapporterna"}
            </h2>
            <Link
              href="/nyheter?kategori=VM+2026"
              className="heading-caps text-xs tracking-[0.14em] text-mist transition-colors duration-200 hover:text-snow"
            >
              Alla →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {dayReports.slice(0, 6).map((article) => (
              <ArticleCard key={article.slug} article={article} lang="sv" />
            ))}
          </div>
        </section>
      )}

      {/* Schema */}
      <section className="mb-16" aria-labelledby="schema-heading">
        <h2 id="schema-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Schema
        </h2>
        <ol className="divide-y divide-line border border-line">
          {SCHEDULE.map((row) => (
            <li key={row.dates} className="flex flex-col gap-1 bg-midnight-800 px-6 py-5 sm:flex-row sm:items-baseline sm:gap-8">
              <span
                className={`heading-caps tabular w-44 shrink-0 text-sm font-bold ${
                  row.highlight ? "text-flagyellow" : "text-snow"
                }`}
              >
                {row.dates}
              </span>
              <span className="heading-caps text-sm text-snow">{row.label}</span>
              <span className="text-sm text-mist">{row.detail}</span>
            </li>
          ))}
        </ol>
      </section>

      <KurbitsDivider className="mb-16" />

      {/* Format */}
      <section className="mb-16" aria-labelledby="format-heading">
        <h2 id="format-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Så funkar formatet
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FORMAT_STATS.map((stat) => (
            <Reveal key={stat.label}>
              <div className="border border-line bg-midnight-800 p-6 text-center">
                <CountUp
                  value={stat.value}
                  className="heading-caps block text-5xl font-bold text-flagyellow sm:text-6xl"
                />
                <span className="heading-caps mt-2 block text-xs tracking-[0.14em] text-mist-dim">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="max-w-3xl space-y-4 leading-relaxed text-mist">
          <p>
            Alla kör likvärdigt material i samma viktklass, och kartarna lottas mellan heaten.
            Varje förare kör <strong className="text-snow">8 kvalheat</strong>, ett resultat
            räknas bort, innan semifinalen avgör vilka{" "}
            <strong className="text-snow">18 förare</strong> som gör upp i finalen.
          </p>
          <p>
            Totalt blir det upp till <strong className="text-snow tabular">10 race</strong> under
            veckan. Mästerskapet vinns av den som samlar flest poäng över hela tävlingen. Ett
            upplägg som premierar jämnhet och förmågan att leverera i varje race, inte enstaka
            toppresultat.
          </p>
          <p>
            <Link href="/nyheter/sa-funkar-hyrkart-vm" className="text-flagblue-bright underline underline-offset-4 transition-colors duration-200 hover:text-snow">
              Hela formatförklaringen finns som egen artikel →
            </Link>
          </p>
        </div>
      </section>

      {/* Tävlingarna */}
      <section className="mb-16" aria-labelledby="tavlingar-heading">
        <h2 id="tavlingar-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Två tävlingar på en vecka
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-line bg-midnight-800 p-6">
            <h3 className="heading-caps mb-2 text-lg text-snow">KWC Individual</h3>
            <p className="text-sm leading-relaxed text-mist">
              Det individuella världsmästerskapet, {KWC.individualLabel.sv}. 180 förare, ett
              startfält där varje heat räknas. Rickards bästa VM-resultat: 3:e av 102 (2016).
            </p>
          </div>
          <div className="border border-line bg-midnight-800 p-6">
            <h3 className="heading-caps mb-2 text-lg text-snow">Nations Cup</h3>
            <p className="text-sm leading-relaxed text-mist">
              Lagtävlingen där förarna representerar sitt land, {KWC.nationsCupLabel.sv}. Varje
              resultat bidrar till nationens totala placering. Rickard har kört Nations Cup i alla
              sina VM: femma 2015–2017 och sexa 2018. I år är målet pallen, för Sverige.
            </p>
          </div>
        </div>
      </section>

      {/* Banfakta */}
      <section className="mb-16" aria-labelledby="bana-heading">
        <h2 id="bana-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Banan: Vandel Kart
        </h2>
        <p className="max-w-3xl leading-relaxed text-mist">
          {KWC.venue} ligger i {KWC.area.sv} på Jylland i Danmark och är värd för den 20:e
          upplagan av Kart World Championship. Banfakta och förarkommentarer kurva för kurva
          publiceras här efter träningsdagarna, direkt från depån.
        </p>
      </section>

      <KurbitsDivider className="mb-16" />

      {/* Så följer du VM */}
      <section className="mb-16" aria-labelledby="folj-heading">
        <h2 id="folj-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Så följer du VM
        </h2>
        <ul className="max-w-3xl space-y-3 text-mist">
          <li className="flex gap-3">
            <span className="text-flagyellow" aria-hidden="true">→</span>
            <span>
              <strong className="text-snow">Dagliga rapporter här på sajten.</strong> En rapport
              per tävlingsdag, publicerad samma kväll. Siffrorna överst, berättelsen under.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-flagyellow" aria-hidden="true">→</span>
            <span>
              <strong className="text-snow">Nyhetsbrevet.</strong> Varje rapport direkt i
              inkorgen, anmäl dig i sidfoten.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-flagyellow" aria-hidden="true">→</span>
            <span>
              <strong className="text-snow">Sociala kanaler.</strong>{" "}
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="text-flagblue-bright underline underline-offset-4">
                Instagram
              </a>{" "}
              och{" "}
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className="text-flagblue-bright underline underline-offset-4">
                Facebook
              </a>{" "}
              för klipp och bilder mellan rapporterna.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-flagyellow" aria-hidden="true">→</span>
            <span>
              <strong className="text-snow">Officiella resultat.</strong> Arrangörens kanaler på{" "}
              <a href="https://kartworldchampionship.com" target="_blank" rel="noopener noreferrer" className="text-flagblue-bright underline underline-offset-4">
                kartworldchampionship.com
              </a>
              .
            </span>
          </li>
        </ul>
      </section>

      {/* Förhandsartiklar före VM */}
      {mode === "before" && vmArticles.length > 0 && (
        <section aria-label="Inför VM">
          <h2 className="heading-caps mb-6 text-2xl font-bold text-snow">Inför VM</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {vmArticles.slice(0, 3).map((article) => (
              <ArticleCard key={article.slug} article={article} lang="sv" />
            ))}
          </div>
        </section>
      )}

      <SportsEventJsonLd />
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { CountUp } from "@/components/CountUp";
import { FaqJsonLd, NationsCupJsonLd } from "@/components/JsonLd";
import { KurbitsDivider } from "@/components/Kurbits";
import { LiveLinks } from "@/components/LiveLinks";
import { NationBadge } from "@/components/NationBadge";
import { Reveal } from "@/components/Reveal";
import {
  drawState,
  isSwedenRow,
  LAP_DELTA_NOTE,
  NC_DRAW,
  NC_FACTS,
  NC_FAQ,
  NC_SCHEDULE,
  SEMIFINAL_START,
  SWEDEN_TEAM,
  TRACK_LAYOUTS,
} from "@/lib/nations-cup";
import { KWC } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nations Cup 2026 — tidsschema, format och banlayouter",
  description:
    "Tidsschema och format för Nations Cup, lagtävlingen i hyrkart-VM 2026 på Vandel Gokart i Danmark 25–26 juli. Lottning, semifinaler, finaler och de två banlayouterna VG Classic och VG New 23.",
  alternates: { canonical: "/vm-2026/nations-cup" },
};

const FORMAT_STATS = [
  { value: NC_FACTS.maxTeams, label: "lag som mest" },
  { value: NC_FACTS.totalHours, label: "timmar racing per lag" },
  { value: NC_FACTS.mandatoryStops, label: "depåstopp per race" },
];

type Props = { searchParams: Promise<{ bana?: string }> };

export default async function NationsCupPage({ searchParams }: Props) {
  const { bana } = await searchParams;
  const activeLayout = TRACK_LAYOUTS.find((l) => l.id === bana) ?? TRACK_LAYOUTS[0];
  const draw = drawState(Date.now());
  const result = NC_DRAW.result;

  const layoutLinkClass = (isActive: boolean) =>
    `heading-caps border px-3 py-1.5 text-xs tracking-[0.12em] transition-colors duration-200 ${
      isActive
        ? "border-flagblue bg-flagblue text-snow"
        : "border-line text-mist hover:border-flagblue-bright hover:text-snow"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-14">
        <NationBadge className="mb-4" />
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-6xl">
          Nations Cup 2026
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-mist">
          Lagtävlingen i hyrkart-VM · {KWC.venue}, Danmark ·{" "}
          <span className="tabular">{KWC.nationsCupLabel.sv}</span> · Sverige kör med fyra
          förare
        </p>
      </header>

      {/* Lottningen — tre lägen som avlöser varandra utan att texten åldras fel */}
      <section className="mb-16 border border-line bg-midnight-800 p-5 sm:p-8" aria-label="Lottning">
        <p className="heading-caps mb-4 text-xs tracking-[0.16em] text-mist-dim">
          Lottning av grupp A och B · lördag 25 juli kl 09:30
        </p>
        {draw === "before" && (
          <>
            <p className="mb-6 max-w-2xl text-mist">
              Lottningen avgör om Sverige kör{" "}
              <strong className="text-snow">semifinal A</strong> (start{" "}
              <span className="tabular">15:45</span>) eller{" "}
              <strong className="text-snow">semifinal B</strong> (start{" "}
              <span className="tabular">18:10</span>) på lördagen. Resultatet uppdateras här
              så fort det är klart.
            </p>
            <Countdown target={KWC.nationsCupDraw} lang="sv" />
          </>
        )}
        {draw === "pending" && (
          <p className="max-w-2xl text-mist">
            Lottningen är genomförd. Resultatet uppdateras här inom kort — semifinal A
            startar <span className="tabular">15:45</span> och semifinal B{" "}
            <span className="tabular">18:10</span>.
          </p>
        )}
        {draw === "done" && result && (
          <p className="max-w-2xl text-lg text-mist">
            Lottningen är klar: Sverige kör{" "}
            <strong className="text-flagyellow">semifinal {result}</strong> med start{" "}
            <span className="tabular text-snow">{SEMIFINAL_START[result]}</span> lördag 25
            juli.
          </p>
        )}
      </section>

      {/* Följ live */}
      <section className="mb-16" aria-labelledby="live-heading">
        <h2 id="live-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Följ racen live
        </h2>
        <LiveLinks lang="sv" className="max-w-3xl" />
      </section>

      {/* Tidsschema */}
      <section className="mb-16" aria-labelledby="schema-heading">
        <h2 id="schema-heading" className="heading-caps mb-2 text-2xl font-bold text-snow">
          Tidsschema
        </h2>
        <p className="mb-6 max-w-2xl text-sm text-mist">
          Alla tider i dansk lokal tid, enligt arrangörens officiella regler. Samtliga race
          körs på VG Classic-layouten.
        </p>
        <div className="space-y-8">
          {NC_SCHEDULE.map((day) => (
            <div key={day.day}>
              <h3 className="heading-caps mb-3 text-lg text-snow">{day.day}</h3>
              <ol className="divide-y divide-line border border-line">
                {day.rows.map((row) => (
                  <li
                    key={`${day.day}-${row.time}-${row.label}`}
                    className="flex flex-col gap-1 bg-midnight-800 px-6 py-5 sm:flex-row sm:items-baseline sm:gap-8"
                  >
                    <span
                      className={`heading-caps tabular w-44 shrink-0 text-sm font-bold ${
                        isSwedenRow(row, result) ? "text-flagyellow" : "text-snow"
                      }`}
                    >
                      {row.time}
                    </span>
                    <span className="heading-caps text-sm text-snow">{row.label}</span>
                    {row.detail && <span className="text-sm text-mist">{row.detail}</span>}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <KurbitsDivider className="mb-16" />

      {/* Formatet, förklarat från grunden */}
      <section className="mb-16" aria-labelledby="format-heading">
        <h2 id="format-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Så fungerar Nations Cup
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
            Nations Cup är lagtävlingen som öppnar VM-veckan. Upp till{" "}
            <strong className="text-snow tabular">{NC_FACTS.maxTeams} lag</strong> ställer
            upp för sina länder, med{" "}
            <strong className="text-snow">{NC_FACTS.driversPerTeam} förare</strong> per lag
            som turas om att köra samma race. Materialet är utjämnat: alla kör banans egna
            kartar och varje förare ska väga minst{" "}
            <span className="tabular">{NC_FACTS.minWeightKg} kg</span> med utrustning —
            väger man mindre fylls det på med ballast i karten.
          </p>
          <p>
            Tävlingen körs i två steg. På lördagen lottas lagen till en av två{" "}
            <strong className="text-snow">semifinaler på två timmar</strong>. De åtta bästa
            lagen från varje semifinal går till final A, som körs på söndagen över{" "}
            <strong className="text-snow">fyra timmar</strong> och avgör vilken nation som
            blir världsmästare. Lagen som slutar nia till sextonde kör final B tidigare
            samma dag. Varje lag får alltså sex timmars racing under helgen, och alla sex
            timmarna körs på banans <strong className="text-snow">Classic-layout</strong>.
          </p>
          <p>
            Varje race börjar med fem minuters kval som sätter startordningen, och föraren
            som kvalar måste också starta racet. Själva starten sker enligt{" "}
            <strong className="text-snow">Le Mans-modell</strong>: en lagkamrat får hålla
            karten på startplattan medan föraren spänner fast sig, och först med bältet
            låst bär det iväg.
          </p>
          <p>
            Det som mest skiljer Nations Cup från annan endurance är depåstoppen. Vid varje
            stopp byter laget <strong className="text-snow">både förare och kart</strong>,
            och den nya karten lottas fram på plats bland två alternativ. Ingen hinner
            bygga sitt race på en enskild bra kart — det jämnar ut turen med materialet
            över racet. Tre stopp är obligatoriska i både semifinal och final, varje stopp
            tar minst en minut, och stoppen får bara göras i bestämda depåfönster: i
            semifinalen {NC_FACTS.pitWindows.semifinal.join(", ")} minuter in i racet, i
            finalen {NC_FACTS.pitWindows.final.join(", ")} minuter in.
          </p>
          <p>
            <Link
              href="/nyheter/sa-funkar-hyrkart-vm"
              className="text-flagblue-bright underline underline-offset-4 transition-colors duration-200 hover:text-snow"
            >
              Så funkar resten av hyrkart-VM — hela formatförklaringen →
            </Link>
          </p>
        </div>
      </section>

      {/* Banan och layouterna */}
      <section className="mb-16" aria-labelledby="bana-heading">
        <h2 id="bana-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Så här ser banan ut
        </h2>
        <div className="mb-8 max-w-3xl space-y-4 leading-relaxed text-mist">
          <p>
            Vandel Gokart körs i två varianter under VM-veckan:{" "}
            <strong className="text-snow">VG Classic</strong> och{" "}
            <strong className="text-snow">VG New 23</strong>, båda medurs.{" "}
            <strong className="text-snow">
              Hela Nations Cup körs på VG Classic
            </strong>{" "}
            — semifinal och final, alla sex timmar. I det individuella mästerskapet senare
            i veckan alternerar layouterna dag för dag: Classic dag 1 och 3, New 23 dag 2
            och 4, och inför semifinal och final lottas layouten på tävlingsdagen. Förarna
            behöver alltså behärska båda varianterna — samtidigt som karten byts vid varje
            depåstopp. Den ständiga anpassningen till ny kart är en stor del av tävlingen.
          </p>
          <p>
            {LAP_DELTA_NOTE} Det låter lite, men över ett race på flera hundra varv är det
            två helt olika rytmer att hitta.
          </p>
        </div>

        {/* Layoutval — länkar, inte JS-state, så vyn är delbar och SSR:ad */}
        <nav aria-label="Banlayout" className="mb-6 flex flex-wrap gap-2">
          {TRACK_LAYOUTS.map((layout) => (
            <Link
              key={layout.id}
              href={`/vm-2026/nations-cup?bana=${layout.id}#bana-heading`}
              scroll={false}
              className={layoutLinkClass(layout.id === activeLayout.id)}
            >
              {layout.name}
            </Link>
          ))}
        </nav>

        <div className="border border-line bg-midnight-800 p-6">
          <Image
            src={activeLayout.image}
            alt={activeLayout.alt}
            width={activeLayout.width}
            height={activeLayout.height}
            className="w-full border border-line"
            sizes="(min-width: 1152px) 1104px, 100vw"
          />
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xl">
              <h3 className="heading-caps mb-2 text-lg text-snow">{activeLayout.name}</h3>
              <p className="mb-2 text-sm leading-relaxed text-snow">{activeLayout.usage}</p>
              <p className="text-sm leading-relaxed text-mist">{activeLayout.tacticalElement}</p>
              <p className="mt-2 text-sm text-mist">
                <span className="text-flagyellow">{activeLayout.lapNote}</span>
              </p>
            </div>
            {activeLayout.youtubeUrl ? (
              <a
                href={activeLayout.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="heading-caps shrink-0 border border-flagblue bg-flagblue px-5 py-3 text-xs tracking-[0.12em] text-snow transition-colors duration-200 hover:border-flagblue-bright hover:bg-flagblue-bright"
              >
                {activeLayout.youtubeLabel} →
              </a>
            ) : (
              <p className="heading-caps shrink-0 border border-line px-5 py-3 text-xs tracking-[0.12em] text-mist-dim">
                Träningsfilm kommer — ett pass med Rickard på {activeLayout.name}
              </p>
            )}
          </div>
        </div>
      </section>

      <KurbitsDivider className="mb-16" />

      {/* Sveriges lag */}
      <section className="mb-16" aria-labelledby="lag-heading">
        <h2 id="lag-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Sveriges lag
        </h2>
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SWEDEN_TEAM.map((name) => (
            <div key={name} className="border border-line bg-midnight-800 p-6 text-center">
              <span className="heading-caps text-sm text-snow">{name}</span>
            </div>
          ))}
        </div>
        <p className="max-w-3xl leading-relaxed text-mist">
          Sverige har legat strax utanför pallen flera år i rad — femma 2015–2017 och sexa
          2018. I år är målet att ta det sista steget.{" "}
          <Link
            href="/nyheter/sveriges-lag-i-nations-cup"
            className="text-flagblue-bright underline underline-offset-4 transition-colors duration-200 hover:text-snow"
          >
            Läs mer om laget och Rickards Nations Cup-historia →
          </Link>
        </p>
      </section>

      {/* Vanliga frågor */}
      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Vanliga frågor
        </h2>
        <dl className="max-w-3xl space-y-4">
          {NC_FAQ.map((item) => (
            <div key={item.q} className="border border-line bg-midnight-800 p-6">
              <dt className="heading-caps mb-2 text-lg text-snow">{item.q}</dt>
              <dd className="text-sm leading-relaxed text-mist">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <NationsCupJsonLd />
      <FaqJsonLd items={NC_FAQ} />
    </div>
  );
}

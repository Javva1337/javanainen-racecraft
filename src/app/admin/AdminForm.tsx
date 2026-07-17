"use client";

import { useEffect, useState } from "react";
import { FactBox } from "@/components/FactBox";
import { getVmDay } from "@/lib/mode";
import { buildSlug } from "@/lib/publicera";

/**
 * Publiceringsformuläret: speglar _mall-vm-rapport.mdx fält för fält.
 * Utkastet autosparas i localStorage så texten aldrig går förlorad i depån,
 * bilder förminskas i webbläsaren innan uppladdning, och API-routen gör
 * en atomisk GitHub-commit (MDX + bild + vm-status.json).
 */

const UTKAST_KEY = "admin-utkast-v1";
const LOSENORD_KEY = "admin-losenord";
const MAX_BILDSIDA_PX = 1600;
const JPEG_KVALITET = 0.8;

type Utkast = {
  title: string;
  description: string;
  day: string;
  heatsRaced: string;
  bestFinish: string;
  standing: string;
  nationsCup: string;
  tomorrow: string;
  body: string;
  imageDataUrl: string | null;
  titleEn: string;
  descriptionEn: string;
  tomorrowEn: string;
  bodyEn: string;
};

type Status =
  | { typ: "idle" }
  | { typ: "pending" }
  | { typ: "fel"; meddelande: string }
  | { typ: "publicerad"; url: string };

function tomtUtkast(): Utkast {
  return {
    title: "",
    description: "",
    day: "",
    heatsRaced: "",
    bestFinish: "",
    standing: "",
    nationsCup: "",
    tomorrow: "",
    body: "",
    imageDataUrl: null,
    titleEn: "",
    descriptionEn: "",
    tomorrowEn: "",
    bodyEn: "",
  };
}

/** Dagens datum i lokal tid som ISO (sv-SE-formatet är redan åååå-mm-dd). */
function dagensDatum(): string {
  return new Date().toLocaleDateString("sv-SE");
}

/** Förminska mobilfoto till webbstorlek innan uppladdning. */
function forminskaBild(fil: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(fil);
    const bild = new Image();
    bild.onload = () => {
      URL.revokeObjectURL(url);
      const skala = Math.min(1, MAX_BILDSIDA_PX / Math.max(bild.width, bild.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bild.width * skala);
      canvas.height = Math.round(bild.height * skala);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas saknas"));
        return;
      }
      ctx.drawImage(bild, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", JPEG_KVALITET));
    };
    bild.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Kunde inte läsa bilden"));
    };
    bild.src = url;
  });
}

const faltKlass =
  "w-full border border-line bg-midnight-800 px-4 py-3 text-sm text-snow " +
  "placeholder:text-mist-dim transition-colors duration-200 " +
  "focus:border-flagblue-bright focus:outline-none";

function Rubrik({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="heading-caps border-t border-line pt-6 text-xs tracking-[0.14em] text-mist-dim">
      {children}
    </h2>
  );
}

function Etikett({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="heading-caps mb-1.5 block text-xs tracking-[0.12em] text-mist"
    >
      {children}
    </label>
  );
}

export function AdminForm() {
  const [utkast, setUtkast] = useState<Utkast>(tomtUtkast);
  const [losenord, setLosenord] = useState("");
  const [status, setStatus] = useState<Status>({ typ: "idle" });
  const [laddad, setLaddad] = useState(false);
  const [bildFel, setBildFel] = useState<string | null>(null);

  // Återläs utkast + lösenord vid sidladdning (efter hydrering).
  useEffect(() => {
    try {
      const sparat = localStorage.getItem(UTKAST_KEY);
      const aterlast = sparat ? { ...tomtUtkast(), ...(JSON.parse(sparat) as Utkast) } : null;
      const dag = String(getVmDay() ?? "");
      setUtkast((aktuellt) => aterlast ?? { ...aktuellt, day: dag });
      const sparatLosenord = localStorage.getItem(LOSENORD_KEY);
      if (sparatLosenord) setLosenord(sparatLosenord);
    } catch {
      // Privat läge utan localStorage — formuläret funkar ändå, utan autospar.
    }
    setLaddad(true);
  }, []);

  // Autospara utkastet — debouncat så att stora utkast (bild som data-URL)
  // inte serialiseras på varje tangenttryckning.
  useEffect(() => {
    if (!laddad) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(UTKAST_KEY, JSON.stringify(utkast));
      } catch {
        // Fullt/blockerat lagringsutrymme — publicering påverkas inte.
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [utkast, laddad]);

  function uppdatera<K extends keyof Utkast>(falt: K, varde: Utkast[K]) {
    setUtkast((aktuellt) => ({ ...aktuellt, [falt]: varde }));
  }

  async function valjBild(event: React.ChangeEvent<HTMLInputElement>) {
    const fil = event.target.files?.[0];
    if (!fil) return;
    setBildFel(null);
    try {
      uppdatera("imageDataUrl", await forminskaBild(fil));
    } catch {
      setBildFel("Kunde inte läsa bilden — prova en annan, eller publicera utan.");
    }
  }

  async function publicera(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const harEngelska = Boolean(
      utkast.titleEn.trim() ||
        utkast.descriptionEn.trim() ||
        utkast.bodyEn.trim() ||
        utkast.tomorrowEn.trim(),
    );
    if (
      harEngelska &&
      !(utkast.titleEn.trim() && utkast.descriptionEn.trim() && utkast.bodyEn.trim())
    ) {
      setStatus({
        typ: "fel",
        meddelande:
          "Engelsk version: fyll i titel, beskrivning och brödtext — eller lämna alla engelska fält tomma.",
      });
      return;
    }
    setStatus({ typ: "pending" });
    try {
      const res = await fetch("/api/admin/publicera", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": losenord,
        },
        body: JSON.stringify({
          title: utkast.title,
          description: utkast.description,
          date: dagensDatum(),
          day: Number(utkast.day),
          heatsRaced: Number(utkast.heatsRaced),
          bestFinish: utkast.bestFinish,
          standing: utkast.standing,
          nationsCup: utkast.nationsCup,
          tomorrow: utkast.tomorrow,
          body: utkast.body,
          imageBase64: utkast.imageDataUrl ?? undefined,
          titleEn: utkast.titleEn.trim() || undefined,
          descriptionEn: utkast.descriptionEn.trim() || undefined,
          tomorrowEn:
            utkast.tomorrow.trim() !== "" ? utkast.tomorrowEn.trim() || undefined : undefined,
          bodyEn: utkast.bodyEn.trim() || undefined,
        }),
      });
      const svar = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!res.ok || !svar.ok) {
        setStatus({
          typ: "fel",
          meddelande: svar.error ?? "Något gick fel — försök igen. Din text är sparad.",
        });
        return;
      }
      try {
        localStorage.setItem(LOSENORD_KEY, losenord);
        localStorage.removeItem(UTKAST_KEY);
      } catch {
        // Ingen lagring — publicering lyckades ändå.
      }
      setStatus({ typ: "publicerad", url: svar.url ?? "" });
    } catch {
      setStatus({
        typ: "fel",
        meddelande: "Ingen kontakt med servern — kolla täckningen och försök igen. Din text är sparad.",
      });
    }
  }

  const dag = Number(utkast.day) || 0;
  const slug = utkast.title && dag ? buildSlug(dag, utkast.title) : null;

  if (status.typ === "publicerad") {
    return (
      <div className="border border-line bg-midnight-800 p-6" role="status">
        <p className="heading-caps mb-2 text-sm tracking-[0.1em] text-flagyellow">
          Publicerad!
        </p>
        <p className="text-sm text-mist">
          Sajten bygger nu — rapporten är live om ett par minuter:
        </p>
        <a
          href={status.url}
          className="mt-2 block break-all text-sm text-flagblue-bright underline underline-offset-4"
        >
          {status.url}
        </a>
        <button
          type="button"
          className="btn btn-secondary mt-6"
          onClick={() => {
            setUtkast({ ...tomtUtkast(), day: String(getVmDay() ?? "") });
            setStatus({ typ: "idle" });
          }}
        >
          Skriv nästa rapport
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={publicera} className="space-y-6">
      <div>
        <Etikett htmlFor="admin-title">Rubrik — med krok</Etikett>
        <input
          id="admin-title"
          required
          maxLength={200}
          placeholder={'T.ex. "Dag 3: Från P12 till P5 i regnet"'}
          className={faltKlass}
          value={utkast.title}
          onChange={(e) => uppdatera("title", e.target.value)}
        />
        {slug && (
          <p className="mt-1.5 break-all text-xs text-mist-dim">
            rickardjavanainen.se/nyheter/{slug}
          </p>
        )}
      </div>

      <div>
        <Etikett htmlFor="admin-description">Beskrivning — 1–2 meningar</Etikett>
        <textarea
          id="admin-description"
          required
          rows={2}
          maxLength={500}
          placeholder="Sammanfatta dagen i en mening — siffran + känslan."
          className={faltKlass}
          value={utkast.description}
          onChange={(e) => uppdatera("description", e.target.value)}
        />
      </div>

      <Rubrik>Dagens siffror</Rubrik>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Etikett htmlFor="admin-day">VM-dag (1–11)</Etikett>
          <input
            id="admin-day"
            required
            type="number"
            min={1}
            max={11}
            inputMode="numeric"
            className={`${faltKlass} tabular`}
            value={utkast.day}
            onChange={(e) => uppdatera("day", e.target.value)}
          />
        </div>
        <div>
          <Etikett htmlFor="admin-heats">Heat körda</Etikett>
          <input
            id="admin-heats"
            required
            type="number"
            min={0}
            inputMode="numeric"
            className={`${faltKlass} tabular`}
            value={utkast.heatsRaced}
            onChange={(e) => uppdatera("heatsRaced", e.target.value)}
          />
        </div>
        <div>
          <Etikett htmlFor="admin-best">Bästa placering</Etikett>
          <input
            id="admin-best"
            required
            maxLength={20}
            placeholder="P2"
            className={`${faltKlass} tabular`}
            value={utkast.bestFinish}
            onChange={(e) => uppdatera("bestFinish", e.target.value)}
          />
        </div>
        <div>
          <Etikett htmlFor="admin-standing">Totalställning</Etikett>
          <input
            id="admin-standing"
            required
            maxLength={20}
            placeholder="P5"
            className={`${faltKlass} tabular`}
            value={utkast.standing}
            onChange={(e) => uppdatera("standing", e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <Etikett htmlFor="admin-nations">Nations Cup — Sveriges läge</Etikett>
          <input
            id="admin-nations"
            required
            maxLength={20}
            placeholder="P3"
            className={`${faltKlass} tabular`}
            value={utkast.nationsCup}
            onChange={(e) => uppdatera("nationsCup", e.target.value)}
          />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none"
        hidden={!(utkast.heatsRaced || utkast.bestFinish || utkast.standing || utkast.nationsCup)}
      >
        <p className="heading-caps mb-2 text-[0.65rem] tracking-[0.14em] text-mist-dim">
          Så visas faktarutan
        </p>
        <FactBox
          lang="sv"
          frontmatter={{
            title: utkast.title,
            description: utkast.description,
            date: dagensDatum(),
            category: "VM 2026",
            heatsRaced: utkast.heatsRaced,
            bestFinish: utkast.bestFinish,
            standing: utkast.standing,
            nationsCup: utkast.nationsCup,
          }}
        />
      </div>

      <Rubrik>Rapporten</Rubrik>

      <div>
        <Etikett htmlFor="admin-body">Brödtext</Etikett>
        <textarea
          id="admin-body"
          required
          rows={12}
          maxLength={50000}
          placeholder={
            "Skriv som du pratar — ett nyckelmoment per heat: starten, en omkörning, ett taktiskt val.\n\nTomrad mellan stycken."
          }
          className={faltKlass}
          value={utkast.body}
          onChange={(e) => uppdatera("body", e.target.value)}
        />
      </div>

      <div>
        <Etikett htmlFor="admin-tomorrow">Imorgon väntar … (valfritt sista dagen)</Etikett>
        <input
          id="admin-tomorrow"
          maxLength={300}
          placeholder="Imorgon väntar två heat till på en torrare bana."
          className={faltKlass}
          value={utkast.tomorrow}
          onChange={(e) => {
            const varde = e.target.value;
            // Rensa ev. kvarvarande engelsk "imorgon"-text när svenska
            // fältet töms — annars ligger den kvar osynlig och kan
            // stranda publiceringen eller läcka in i EN-artikeln.
            setUtkast((aktuellt) => ({
              ...aktuellt,
              tomorrow: varde,
              tomorrowEn: varde.trim() === "" ? "" : aktuellt.tomorrowEn,
            }));
          }}
        />
      </div>

      <Rubrik>English version (valfri)</Rubrik>

      <details className="border border-line bg-midnight-800">
        <summary className="cursor-pointer px-4 py-3 text-sm text-mist">
          Skriv en engelsk variant{utkast.titleEn.trim() ? " — påbörjad" : ""} (lämna tomt så
          visas svenska med notis på /en)
        </summary>
        <div className="space-y-6 border-t border-line p-4">
          <div>
            <Etikett htmlFor="admin-title-en">Title — English</Etikett>
            <input
              id="admin-title-en"
              maxLength={200}
              placeholder={'E.g. "Day 3: From P12 to P5 in the rain"'}
              className={faltKlass}
              value={utkast.titleEn}
              onChange={(e) => uppdatera("titleEn", e.target.value)}
            />
          </div>
          <div>
            <Etikett htmlFor="admin-description-en">Description — English</Etikett>
            <textarea
              id="admin-description-en"
              rows={2}
              maxLength={500}
              placeholder="Sum up the day in one sentence — the number + the feeling."
              className={faltKlass}
              value={utkast.descriptionEn}
              onChange={(e) => uppdatera("descriptionEn", e.target.value)}
            />
          </div>
          <div>
            <Etikett htmlFor="admin-body-en">Body — English</Etikett>
            <textarea
              id="admin-body-en"
              rows={12}
              maxLength={50000}
              placeholder={"The same report in English.\n\nBlank line between paragraphs."}
              className={faltKlass}
              value={utkast.bodyEn}
              onChange={(e) => uppdatera("bodyEn", e.target.value)}
            />
          </div>
          {utkast.tomorrow.trim() !== "" && (
            <div>
              <Etikett htmlFor="admin-tomorrow-en">Tomorrow — English (valfri)</Etikett>
              <input
                id="admin-tomorrow-en"
                maxLength={300}
                placeholder="Two more heats on a drier track tomorrow."
                className={faltKlass}
                value={utkast.tomorrowEn}
                onChange={(e) => uppdatera("tomorrowEn", e.target.value)}
              />
            </div>
          )}
        </div>
      </details>

      <Rubrik>Bild (valfri)</Rubrik>

      <div>
        {utkast.imageDataUrl ? (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={utkast.imageDataUrl}
              alt="Vald bild"
              className="max-h-64 w-full border border-line object-cover"
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => uppdatera("imageDataUrl", null)}
            >
              Ta bort bilden
            </button>
          </div>
        ) : (
          <label className="btn btn-secondary cursor-pointer">
            Välj bild från mobilen
            <input type="file" accept="image/*" className="sr-only" onChange={valjBild} />
          </label>
        )}
        {bildFel && (
          <p className="mt-2 text-sm text-mist" role="alert">
            {bildFel}
          </p>
        )}
      </div>

      <Rubrik>Publicera</Rubrik>

      <div>
        <Etikett htmlFor="admin-password">Lösenord</Etikett>
        <input
          id="admin-password"
          required
          type="password"
          autoComplete="current-password"
          className={faltKlass}
          value={losenord}
          onChange={(e) => setLosenord(e.target.value)}
        />
        <p className="mt-1.5 text-xs text-mist-dim">Sparas i din webbläsare efter första publiceringen.</p>
      </div>

      {status.typ === "fel" && (
        <p className="border border-line bg-midnight-800 p-4 text-sm text-mist" role="alert">
          {status.meddelande}
        </p>
      )}

      <button
        type="submit"
        disabled={status.typ === "pending"}
        className="btn btn-primary w-full disabled:opacity-60"
      >
        {status.typ === "pending" ? "Publicerar …" : "Publicera rapporten"}
      </button>
      <p className="pb-4 text-center text-xs text-mist-dim">
        Utkastet autosparas i webbläsaren medan du skriver.
      </p>
    </form>
  );
}

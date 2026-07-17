import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { buildArticleMdx, buildSlug, buildVmStatus, type RapportFalt } from "@/lib/publicera";

/**
 * Publicerar en VM-rapport från /admin: en atomisk commit till GitHub med
 * MDX-filen, ev. bild och uppdaterad vm-status.json. Vercel bygger på pushen.
 */

/** ≈ 4 MB binärt när base64-overheaden räknats bort. */
const MAX_IMAGE_BASE64_LEN = 5_600_000;
const MAX_BODY_LEN = 50_000;

const DEFAULT_REPO = "Javva1337/javanainen-racecraft";
const DEFAULT_BRANCH = "main";

type Validerat = { falt: RapportFalt; imageBase64: string | null };

function fel(status: number, error: string): NextResponse {
  return NextResponse.json({ ok: false, error }, { status });
}

/** Timing-säker jämförelse via hashar (hanterar olika längd utan att läcka den). */
function sammaLosenord(inskickat: string, ratt: string): boolean {
  const a = createHash("sha256").update(inskickat).digest();
  const b = createHash("sha256").update(ratt).digest();
  return timingSafeEqual(a, b);
}

function strang(varde: unknown, maxLen: number): string | null {
  if (typeof varde !== "string") return null;
  const trimmat = varde.trim();
  if (trimmat === "" || trimmat.length > maxLen) return null;
  return trimmat;
}

function validera(body: Record<string, unknown>): Validerat | { error: string } {
  const title = strang(body.title, 200);
  if (!title) return { error: "Rubrik saknas eller är för lång." };

  const description = strang(body.description, 500);
  if (!description) return { error: "Beskrivning saknas eller är för lång." };

  const date = strang(body.date, 10);
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Ogiltigt datum." };

  const day = body.day;
  if (typeof day !== "number" || !Number.isInteger(day) || day < 1 || day > 11) {
    return { error: "VM-dag måste vara 1–11." };
  }

  const heatsRaced = body.heatsRaced;
  if (typeof heatsRaced !== "number" || !Number.isInteger(heatsRaced) || heatsRaced < 0) {
    return { error: "Heat körda måste vara ett heltal." };
  }

  const bestFinish = strang(body.bestFinish, 20);
  const standing = strang(body.standing, 20);
  const nationsCup = strang(body.nationsCup, 20);
  if (!bestFinish || !standing || !nationsCup) {
    return { error: "Fyll i alla tre placeringarna (bästa, totalt, Nations Cup)." };
  }

  const tomorrow = typeof body.tomorrow === "string" ? body.tomorrow.trim().slice(0, 300) : "";

  const artikeltext = strang(body.body, MAX_BODY_LEN);
  if (!artikeltext) return { error: "Brödtext saknas eller är för lång." };

  let imageBase64: string | null = null;
  if (body.imageBase64 !== undefined && body.imageBase64 !== null && body.imageBase64 !== "") {
    if (typeof body.imageBase64 !== "string") return { error: "Ogiltig bild." };
    // Tillåt data-URL från klienten — skala bort prefixet.
    imageBase64 = body.imageBase64.replace(/^data:image\/\w+;base64,/, "");
    if (imageBase64.length > MAX_IMAGE_BASE64_LEN) {
      return { error: "Bilden är för stor även efter förminskning (max ca 4 MB)." };
    }
    if (!/^[A-Za-z0-9+/=\s]+$/.test(imageBase64)) return { error: "Ogiltig bild." };
  }

  return {
    falt: {
      title,
      description,
      date,
      day,
      heatsRaced,
      bestFinish,
      standing,
      nationsCup,
      tomorrow,
      body: artikeltext,
    },
    imageBase64,
  };
}

async function gh(
  token: string,
  method: string,
  url: string,
  body?: unknown,
): Promise<Record<string, unknown>> {
  const res = await fetch(`https://api.github.com${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    throw new Error(`GitHub ${method} ${url} → ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as Record<string, unknown>;
}

type TreeEntry = {
  path: string;
  mode: "100644";
  type: "blob";
  content?: string;
  sha?: string;
};

/** En atomisk commit: MDX + ev. bild + vm-status.json → ref-uppdatering. */
async function publiceraTillGitHub(
  token: string,
  slug: string,
  { falt, imageBase64 }: Validerat,
): Promise<void> {
  const repo = process.env.ADMIN_GITHUB_REPO ?? DEFAULT_REPO;
  const branch = process.env.ADMIN_GITHUB_BRANCH ?? DEFAULT_BRANCH;
  const bas = `/repos/${repo}`;

  const ref = await gh(token, "GET", `${bas}/git/ref/heads/${branch}`);
  const headSha = (ref.object as { sha: string }).sha;
  const headCommit = await gh(token, "GET", `${bas}/git/commits/${headSha}`);
  const baseTreeSha = (headCommit.tree as { sha: string }).sha;

  const entries: TreeEntry[] = [];
  let imagePath: string | undefined;

  if (imageBase64) {
    const blob = await gh(token, "POST", `${bas}/git/blobs`, {
      content: imageBase64,
      encoding: "base64",
    });
    imagePath = `/images/vm/${slug}.jpg`;
    entries.push({
      path: `public/images/vm/${slug}.jpg`,
      mode: "100644",
      type: "blob",
      sha: blob.sha as string,
    });
  }

  entries.push({
    path: `content/nyheter/${slug}.mdx`,
    mode: "100644",
    type: "blob",
    content: buildArticleMdx({ ...falt, imagePath }),
  });
  entries.push({
    path: "content/vm-status.json",
    mode: "100644",
    type: "blob",
    content: `${JSON.stringify(buildVmStatus(falt), null, 2)}\n`,
  });

  const tree = await gh(token, "POST", `${bas}/git/trees`, {
    base_tree: baseTreeSha,
    tree: entries,
  });
  const commit = await gh(token, "POST", `${bas}/git/commits`, {
    message: `content: VM-rapport dag ${falt.day} — publicerad via /admin`,
    tree: tree.sha as string,
    parents: [headSha],
  });
  await gh(token, "PATCH", `${bas}/git/refs/heads/${branch}`, {
    sha: commit.sha as string,
  });
}

export async function POST(request: Request) {
  const losenord = process.env.ADMIN_PASSWORD;
  const token = process.env.ADMIN_GITHUB_TOKEN;
  if (!losenord || !token) {
    return fel(503, "Publicering är inte konfigurerad på servern.");
  }

  if (!sammaLosenord(request.headers.get("x-admin-password") ?? "", losenord)) {
    return fel(401, "Fel lösenord.");
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fel(400, "Ogiltig JSON.");
  }

  const resultat = validera(body);
  if ("error" in resultat) return fel(400, resultat.error);

  const slug = buildSlug(resultat.falt.day, resultat.falt.title);

  try {
    await publiceraTillGitHub(token, slug, resultat);
  } catch (error) {
    console.error("[admin/publicera] GitHub-fel:", error);
    return fel(502, "Kunde inte publicera — försök igen om en stund. Din text är sparad i formuläret.");
  }

  const sajt = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rickardjavanainen.se";
  return NextResponse.json({ ok: true, slug, url: `${sajt}/nyheter/${slug}` });
}

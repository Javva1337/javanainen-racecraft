import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "./route";

const LOSENORD = "hemligt-losenord";

const giltigPayload = {
  title: "Dag 3: Från P12 till P5 i regnet",
  description: "Två heat, ett regnoväder.",
  date: "2026-07-24",
  day: 3,
  heatsRaced: 2,
  bestFinish: "P2",
  standing: "P5",
  nationsCup: "P3",
  tomorrow: "Imorgon väntar två heat till.",
  body: "Starten i heat ett var det bästa jag gjort i år.",
};

function req(body: unknown, password: string | null = LOSENORD): Request {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (password !== null) headers["x-admin-password"] = password;
  return new Request("http://localhost/api/admin/publicera", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

/** Mockar hela Git Data-sekvensen: ref → commit → (blob) → tree → commit → ref-patch. */
function githubMock() {
  return vi.fn(async (url: string | URL, opts?: RequestInit) => {
    const u = String(url);
    const method = opts?.method ?? "GET";
    const json = (data: unknown, status = 200) =>
      new Response(JSON.stringify(data), { status });
    if (u.includes("/git/ref/heads/") && method === "GET") {
      return json({ object: { sha: "head-sha" } });
    }
    if (u.includes("/git/commits/head-sha") && method === "GET") {
      return json({ tree: { sha: "base-tree-sha" } });
    }
    if (u.endsWith("/git/blobs") && method === "POST") {
      return json({ sha: "blob-sha" }, 201);
    }
    if (u.endsWith("/git/trees") && method === "POST") {
      return json({ sha: "tree-sha" }, 201);
    }
    if (u.endsWith("/git/commits") && method === "POST") {
      return json({ sha: "ny-commit-sha" }, 201);
    }
    if (u.includes("/git/refs/heads/") && method === "PATCH") {
      return json({ object: { sha: "ny-commit-sha" } });
    }
    throw new Error(`Oväntat GitHub-anrop: ${method} ${u}`);
  });
}

function anrop(mock: ReturnType<typeof githubMock>, urlDel: string, method: string) {
  return mock.mock.calls.filter(([url, opts]) => {
    return String(url).includes(urlDel) && ((opts as RequestInit)?.method ?? "GET") === method;
  });
}

const OLD_ENV = process.env;

beforeEach(() => {
  process.env = {
    ...OLD_ENV,
    ADMIN_PASSWORD: LOSENORD,
    ADMIN_GITHUB_TOKEN: "github-token",
    ADMIN_GITHUB_REPO: "Javva1337/javanainen-racecraft",
    ADMIN_GITHUB_BRANCH: "main",
  };
});

afterEach(() => {
  process.env = OLD_ENV;
  vi.unstubAllGlobals();
});

describe("POST /api/admin/publicera — auth och validering", () => {
  test("saknad ADMIN_PASSWORD → 503, inget GitHub-anrop", async () => {
    delete process.env.ADMIN_PASSWORD;
    const mock = githubMock();
    vi.stubGlobal("fetch", mock);
    const res = await POST(req(giltigPayload));
    expect(res.status).toBe(503);
    expect(mock).not.toHaveBeenCalled();
  });

  test("saknad ADMIN_GITHUB_TOKEN → 503", async () => {
    delete process.env.ADMIN_GITHUB_TOKEN;
    vi.stubGlobal("fetch", githubMock());
    const res = await POST(req(giltigPayload));
    expect(res.status).toBe(503);
  });

  test("fel lösenord → 401, inget GitHub-anrop", async () => {
    const mock = githubMock();
    vi.stubGlobal("fetch", mock);
    const res = await POST(req(giltigPayload, "fel-losenord"));
    expect(res.status).toBe(401);
    expect(mock).not.toHaveBeenCalled();
  });

  test("saknat lösenordsheader → 401", async () => {
    vi.stubGlobal("fetch", githubMock());
    const res = await POST(req(giltigPayload, null));
    expect(res.status).toBe(401);
  });

  test("trasig JSON → 400", async () => {
    vi.stubGlobal("fetch", githubMock());
    const res = await POST(req("inte json"));
    expect(res.status).toBe(400);
  });

  test("tom rubrik → 400 med svenskt felmeddelande", async () => {
    vi.stubGlobal("fetch", githubMock());
    const res = await POST(req({ ...giltigPayload, title: "  " }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toMatch(/rubrik/i);
  });

  test("VM-dag utanför 1–11 → 400", async () => {
    vi.stubGlobal("fetch", githubMock());
    expect((await POST(req({ ...giltigPayload, day: 0 }))).status).toBe(400);
    expect((await POST(req({ ...giltigPayload, day: 12 }))).status).toBe(400);
    expect((await POST(req({ ...giltigPayload, day: 2.5 }))).status).toBe(400);
  });

  test("för stor bild → 400", async () => {
    vi.stubGlobal("fetch", githubMock());
    const res = await POST(req({ ...giltigPayload, imageBase64: "a".repeat(6_000_000) }));
    expect(res.status).toBe(400);
  });
});

describe("POST /api/admin/publicera — publicering", () => {
  test("utan bild: en commit med MDX + vm-status.json, ref uppdateras", async () => {
    const mock = githubMock();
    vi.stubGlobal("fetch", mock);

    const res = await POST(req(giltigPayload));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.slug).toBe("vm-dag-3-fran-p12-till-p5-i-regnet");
    expect(json.url).toContain("/nyheter/vm-dag-3-fran-p12-till-p5-i-regnet");

    // Ingen blob (ingen bild)
    expect(anrop(mock, "/git/blobs", "POST")).toHaveLength(0);

    // Trädet innehåller MDX-filen och vm-status.json
    const [treeCall] = anrop(mock, "/git/trees", "POST");
    const tree = JSON.parse((treeCall[1] as RequestInit).body as string);
    expect(tree.base_tree).toBe("base-tree-sha");
    const paths = tree.tree.map((e: { path: string }) => e.path);
    expect(paths).toContain("content/nyheter/vm-dag-3-fran-p12-till-p5-i-regnet.mdx");
    expect(paths).toContain("content/vm-status.json");
    expect(paths).toHaveLength(2);

    // vm-status synkas med rapportens siffror
    const statusEntry = tree.tree.find(
      (e: { path: string }) => e.path === "content/vm-status.json",
    );
    const status = JSON.parse(statusEntry.content);
    expect(status.standing).toBe("P5");
    expect(status.heatsRaced).toBe(2);
    expect(status.nationsCupPosition).toBe("P3");

    // Ref pekas om till nya committen
    const [refCall] = anrop(mock, "/git/refs/heads/main", "PATCH");
    expect(JSON.parse((refCall[1] as RequestInit).body as string).sha).toBe("ny-commit-sha");
  });

  test("med bild: blob skapas och trädet får bildfilen + image i frontmattern", async () => {
    const mock = githubMock();
    vi.stubGlobal("fetch", mock);

    const bild = Buffer.from("låtsas-jpeg").toString("base64");
    const res = await POST(req({ ...giltigPayload, imageBase64: bild }));
    expect(res.status).toBe(200);

    const [blobCall] = anrop(mock, "/git/blobs", "POST");
    const blob = JSON.parse((blobCall[1] as RequestInit).body as string);
    expect(blob.content).toBe(bild);
    expect(blob.encoding).toBe("base64");

    const [treeCall] = anrop(mock, "/git/trees", "POST");
    const tree = JSON.parse((treeCall[1] as RequestInit).body as string);
    const bildEntry = tree.tree.find((e: { path: string }) => e.path.startsWith("public/images/vm/"));
    expect(bildEntry.path).toBe("public/images/vm/vm-dag-3-fran-p12-till-p5-i-regnet.jpg");
    expect(bildEntry.sha).toBe("blob-sha");

    const mdxEntry = tree.tree.find((e: { path: string }) => e.path.endsWith(".mdx"));
    expect(mdxEntry.content).toContain("/images/vm/vm-dag-3-fran-p12-till-p5-i-regnet.jpg");
  });

  test("utan ADMIN_GITHUB_BRANCH används deployens branch (VERCEL_GIT_COMMIT_REF)", async () => {
    delete process.env.ADMIN_GITHUB_BRANCH;
    process.env.VERCEL_GIT_COMMIT_REF = "nextjs-rebuild";
    const mock = githubMock();
    vi.stubGlobal("fetch", mock);

    const res = await POST(req(giltigPayload));
    expect(res.status).toBe(200);
    expect(anrop(mock, "/git/ref/heads/nextjs-rebuild", "GET")).toHaveLength(1);
    expect(anrop(mock, "/git/refs/heads/nextjs-rebuild", "PATCH")).toHaveLength(1);
  });

  test("GitHub-fel → 502 med svenskt felmeddelande", async () => {
    const mock = vi.fn(async () => new Response("Bad credentials", { status: 401 }));
    vi.stubGlobal("fetch", mock);
    const res = await POST(req(giltigPayload));
    const json = await res.json();
    expect(res.status).toBe(502);
    expect(json.error).toMatch(/kunde inte publicera/i);
  });
});

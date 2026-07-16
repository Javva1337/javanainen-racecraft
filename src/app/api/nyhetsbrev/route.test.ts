import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "./route";

function req(body: unknown): Request {
  return new Request("http://localhost/api/nyhetsbrev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const OLD_ENV = process.env;

beforeEach(() => {
  process.env = { ...OLD_ENV, SHEETS_WEBHOOK_URL: "https://script.example/exec" };
});

afterEach(() => {
  process.env = OLD_ENV;
  vi.unstubAllGlobals();
});

describe("POST /api/nyhetsbrev", () => {
  test("giltig anmälan → POST till webhook med rätt payload", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await POST(req({ name: "Anna", email: "anna@example.com", lang: "en" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe("https://script.example/exec");
    const sent = JSON.parse((opts as RequestInit).body as string);
    expect(sent.name).toBe("Anna");
    expect(sent.email).toBe("anna@example.com");
    expect(sent.lang).toBe("en");
    expect(typeof sent.timestamp).toBe("string");
  });

  test("okänt språk normaliseras till sv", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await POST(req({ name: "Bo", email: "bo@example.com", lang: "xx" }));
    const sent = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(sent.lang).toBe("sv");
  });

  test("ogiltig e-post → 400, ingen webhook", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(req({ name: "Anna", email: "trasig" }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("tomt namn → 400, ingen webhook", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(req({ name: "   ", email: "anna@example.com" }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("honeypot ifyllt → ok utan webhook", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(
      req({ name: "Anna", email: "anna@example.com", company: "Spammer AB" }),
    );
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("webhook 500 → 502", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("boom", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(req({ name: "Anna", email: "anna@example.com" }));
    expect(res.status).toBe(502);
  });
});

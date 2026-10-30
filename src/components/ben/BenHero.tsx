"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Lang } from "@/lib/dictionary";

const COPY = {
  sv: {
    mesh: "ANSIKTSMESH · 468 PUNKTER",
    hint: "FÖR MUSEN FÖR ATT AVSLÖJA",
    hint2: "SCROLLA FÖR ATT GÅ DJUPARE",
    touch: "TRYCK FÖR ATT AVSLÖJA",
    tagline: "Hyrkartförare från Dalarna. VM-brons 2016.",
    scanning: "SKANNAR",
    tracking: "FÖLJER",
    alt: "Rickard Javanainen med pokal",
  },
  en: {
    mesh: "FACE MESH · 468 PTS",
    hint: "MOVE TO REVEAL",
    hint2: "SCROLL TO GO DEEPER",
    touch: "TAP TO REVEAL",
    tagline: "Rental kart racer from Dalarna. Worlds bronze 2016.",
    scanning: "SCANNING",
    tracking: "TRACKING",
    alt: "Rickard Javanainen with a trophy",
  },
} as const;

const TRAIL = 6;
const sgn = (v: number) => `${v < 0 ? "-" : "+"}${Math.abs(v).toFixed(1).padStart(4, "0")}`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function binaryBlock(cols: number, rows: number) {
  let seed = 1992;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  let out = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) out += rnd() > 0.5 ? "1" : "0";
    out += "\n";
  }
  return out;
}
const BIN = binaryBlock(60, 70);

export function BenHero({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const machine = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLCanvasElement>(null);
  const crossH = useRef<HTMLSpanElement>(null);
  const crossV = useRef<HTMLSpanElement>(null);
  const yawEl = useRef<HTMLSpanElement>(null);
  const pitchEl = useRef<HTMLSpanElement>(null);
  const modeEl = useRef<HTMLSpanElement>(null);
  const noseEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = root.current;
    const fr = frame.current;
    const mach = machine.current;
    const cv = field.current;
    if (!el || !fr || !mach || !cv) return;

    const coarse = window.matchMedia("(hover: none)").matches;
    const ctx = cv.getContext("2d");
    const cs = getComputedStyle(el);
    const dim = cs.getPropertyValue("--b-ink-dim").trim();
    const hot = cs.getPropertyValue("--b-primary").trim();
    const CELL = 16;
    let cols = 0;
    let rows = 0;
    let bits: Uint8Array = new Uint8Array(0);

    const drawCell = (i: number) => {
      if (!ctx) return;
      const x = (i % cols) * CELL;
      const y = Math.floor(i / cols) * CELL;
      ctx.clearRect(x, y, CELL, CELL);
      ctx.fillStyle = i % 53 === 0 ? hot : dim;
      ctx.fillText(String(bits[i]), x + 3, y + 12);
    };
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `12px ${cs.getPropertyValue("--b-mono") || "monospace"}`;
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      bits = new Uint8Array(cols * rows).map(() => (Math.random() > 0.5 ? 1 : 0));
      for (let i = 0; i < bits.length; i++) drawCell(i);
    };
    resize();
    window.addEventListener("resize", resize);
    // Dessa noder renderas tomma av React och ägs av effekten (ingen hydreringskonflikt)
    if (yawEl.current) yawEl.current.textContent = "+00.0";
    if (pitchEl.current) pitchEl.current.textContent = "+00.0";
    if (modeEl.current) modeEl.current.textContent = t.scanning;

    // Scroll: paper → void (0..1 över hjältens extra scrolldjup).
    // Textfärgen växlar stegvis vid p > 0.5 så kontrasten håller mitt i övergången.
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      el.style.setProperty("--p", p.toFixed(3));
      el.dataset.tone = p > 0.5 ? "void" : "paper";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduced) {
      mach.style.display = "none";
      return () => {
        mach.style.display = "";
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
      };
    }

    // Pekare: mål i frame-koordinater + släpande spårpunkter
    const pts = Array.from({ length: TRAIL }, () => ({ x: -999, y: -999 }));
    const target = { x: -999, y: -999 };
    let lastMove = 0;
    let lastTap = 0;
    let raf = 0;
    let active = false;
    let flick = 0;

    const setTarget = (cx: number, cy: number) => {
      const r = fr.getBoundingClientRect();
      target.x = cx - r.left;
      target.y = cy - r.top;
      lastMove = performance.now();
      if (!active) {
        active = true;
        pts.forEach((p) => {
          p.x = target.x;
          p.y = target.y;
        });
      }
      if (crossH.current) crossH.current.style.transform = `translateY(${cy}px)`;
      if (crossV.current) crossV.current.style.transform = `translateX(${cx}px)`;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      setTarget(e.clientX, e.clientY);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      lastTap = performance.now();
      setTarget(e.clientX, e.clientY);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);

    const tick = (now: number) => {
      const r = fr.getBoundingClientRect();
      // Touch utan tryck: auto-sweep över porträttet
      if (coarse && now - lastTap > 2500) {
        const s = now / 1000;
        setTarget(
          r.left + r.width * (0.5 + 0.38 * Math.sin(s * 0.9)),
          r.top + r.height * (0.38 + 0.2 * Math.sin(s * 0.6 + 1)),
        );
        lastMove = now - 100;
      }
      if (active) {
        pts[0].x = lerp(pts[0].x, target.x, 0.35);
        pts[0].y = lerp(pts[0].y, target.y, 0.35);
        for (let i = 1; i < TRAIL; i++) {
          pts[i].x = lerp(pts[i].x, pts[i - 1].x, 0.22);
          pts[i].y = lerp(pts[i].y, pts[i - 1].y, 0.22);
        }
        const mask = pts
          .map((p, i) => {
            const rad = 150 - i * 18;
            return `radial-gradient(circle ${rad}px at ${p.x.toFixed(0)}px ${p.y.toFixed(0)}px, #000 55%, transparent 100%)`;
          })
          .join(",");
        mach.style.webkitMaskImage = mask;
        mach.style.maskImage = mask;

        const nx = (target.x / r.width - 0.5) * 2;
        const ny = (target.y / r.height - 0.5) * 2;
        const clamp = (v: number) => Math.max(-1, Math.min(1, v));
        if (yawEl.current) yawEl.current.textContent = sgn(clamp(nx) * 24);
        if (pitchEl.current) pitchEl.current.textContent = sgn(clamp(-ny) * 16);
        const tracking = now - lastMove < 1200;
        if (modeEl.current) {
          const txt = tracking ? t.tracking : t.scanning;
          if (modeEl.current.textContent !== txt) modeEl.current.textContent = txt;
        }
        el.dataset.mode = tracking ? "tracking" : "scanning";
        if (noseEl.current) {
          const near = Math.hypot(target.x / r.width - 0.34, target.y / r.height - 0.35) < 0.22;
          noseEl.current.dataset.lock = near ? "1" : "0";
        }
      }
      // Binärfältet flimrar svagt
      if (now - flick > 90 && bits.length) {
        flick = now;
        for (let k = 0; k < 40; k++) {
          const i = (Math.random() * bits.length) | 0;
          bits[i] = bits[i] ? 0 : 1;
          drawCell(i);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    // Kör bara när hjälten syns och fliken är aktiv
    let inView = true;
    const sync = () => {
      const run = inView && !document.hidden;
      if (run && !raf) raf = requestAnimationFrame(tick);
      if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      cancelAnimationFrame(raf);
      mach.style.display = "";
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
    };
  }, [t.scanning, t.tracking, reduced]);

  return (
    <section ref={root} className="bh" data-mode="scanning" data-tone="paper" data-reduced={reduced ? "1" : "0"}>
      <div className="bh-stage">
        <canvas ref={field} className="bh-field" aria-hidden="true" />

        <div ref={frame} className="bh-frame">
          <Image
            src="/images/portrait.jpg"
            alt={t.alt}
            fill
            priority
            sizes="(max-width: 768px) 80vw, 40vw"
            className="bh-img"
          />
          <div ref={machine} className="bh-machine" aria-hidden="true">
            <Image src="/images/portrait.jpg" alt="" fill sizes="(max-width: 768px) 80vw, 40vw" className="bh-img bh-img--machine" />
            <pre className="bh-bin">{BIN}</pre>
            <svg className="bh-wire" viewBox="0 0 100 100" preserveAspectRatio="none">
              <g fill="none" stroke="currentColor" strokeWidth="0.25">
                <path d="M16 38 L27 32 L40 30 L52 34 L60 42 L58 58 L50 68 L38 70 L28 62 Z" />
                <path d="M27 32 L34 35 L40 30 M34 35 L34 47 L40 52 L47 47 L52 34 M34 47 L28 62 M40 52 L38 70 M47 47 L58 58" />
                <path d="M30 22 L44 18 L56 24 M20 46 L34 47 M52 34 L66 28 L72 36" />
              </g>
              <circle cx="40" cy="30" r="3.2" className="bh-eye-ring" fill="none" stroke="currentColor" strokeWidth="0.3" />
            </svg>
            <span className="bh-eye" />
          </div>

          <div ref={noseEl} className="bh-nose" data-lock="0" aria-hidden="true">
            <i /><i /><i /><i />
            <span>{lang === "sv" ? "NÄSA 98%" : "NOSE 98%"}</span>
          </div>
        </div>

        <span ref={crossH} className="bh-cross bh-cross--h" aria-hidden="true" />
        <span ref={crossV} className="bh-cross bh-cross--v" aria-hidden="true" />

        <p className="bh-hud bh-hud--tl">{t.mesh}</p>
        <p className="bh-hud bh-hud--tr">
          YAW <span ref={yawEl} />° · PITCH <span ref={pitchEl} />°
          <br />
          <span ref={modeEl} className="bh-mode" />
        </p>
        <p className="bh-hud bh-hud--bl">
          <span className="bh-hint-pointer">{t.hint}</span>
          <span className="bh-hint-touch">{t.touch}</span>
          <br />
          {t.hint2}
        </p>
        <p className="bh-tagline">{t.tagline}</p>
      </div>
    </section>
  );
}

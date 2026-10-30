"use client";

import { useEffect, useRef } from "react";

/**
 * Det fasta fältet bakom hela startsidan: en canvas som hänger kvar medan kapitlen
 * scrollar ovanpå. Skriver paper → void efter scroll-progress, ritar ett binary 0/1-fält
 * (pastell på paper, signal/timing på void) och ett asfaltsgrid vars perspektiv följer scroll.
 * Sätter html[data-tone] så headern kan byta färg. Reduced motion: ritas statiskt.
 */

const PAPER = [237, 232, 223];
const VOID = [7, 8, 10];
const SIGNAL = [255, 59, 46];
const TIMING = [61, 255, 176];
const TIMING_PAPER = [14, 150, 100];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number[], b: number[], t: number) =>
  a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c: number[]) => `rgb(${c[0]},${c[1]},${c[2]})`;

export function StickyField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cell = 20;
    let cols = 0;
    let rows = 0;
    let bits = new Uint8Array(0);
    let colSpeed = new Float32Array(0);
    let colPhase = new Float32Array(0);
    let raf = 0;
    let last = 0;
    let dirty = true;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cell = w < 640 ? 16 : 20;
      const nextCols = Math.ceil(w / cell);
      const nextRows = Math.ceil(h / cell);
      // Mobilens URL-fält ändrar bara höjden — behåll fältet då, annars hoppar det
      if (nextCols !== cols || nextRows > rows) {
        const colsChanged = nextCols !== cols;
        cols = nextCols;
        rows = nextRows;
        bits = new Uint8Array(cols * rows);
        for (let i = 0; i < bits.length; i++) bits[i] = Math.random() < 0.5 ? 0 : 1;
        if (colsChanged) {
          colSpeed = new Float32Array(cols);
          colPhase = new Float32Array(cols);
          for (let c = 0; c < cols; c++) {
            colSpeed[c] = 0.04 + Math.random() * 0.09;
            colPhase[c] = Math.random();
          }
        }
      }
      dirty = true;
    };

    const draw = (time: number) => {
      const t = time / 1000;
      const scrollY = window.scrollY;
      const progress = clamp(scrollY / (window.innerHeight * 0.9));
      const p = smooth(0.12, 0.7, progress);
      root.dataset.tone = progress < 0.4 ? "paper" : "void";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = rgb(mix(PAPER, VOID, p));
      ctx.fillRect(0, 0, w, h);

      // Asfaltsgrid: perspektiv mot en horisont, rader glider med scroll
      const gridAlpha = 0.05 + p * 0.16;
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${p < 0.5 ? "12,14,18" : "154,163,178"},${gridAlpha})`;
      const horizon = h * 0.42;
      const offset = (scrollY * 0.0016 + (reduce ? 0 : t * 0.02)) % 1;
      ctx.beginPath();
      for (let i = 0; i < 14; i++) {
        const k = (i + offset) / 14;
        const y = horizon + (h - horizon) * k * k;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      for (let i = -10; i <= 10; i++) {
        ctx.moveTo(w / 2 + i * 12, horizon);
        ctx.lineTo(w / 2 + i * w * 0.14, h);
      }
      ctx.stroke();

      // Binary-fält
      ctx.font = `${Math.round(cell * 0.72)}px ui-monospace, "SFMono-Regular", Menlo, monospace`;
      ctx.textBaseline = "top";
      const cSignal = mix(mix(SIGNAL, [255, 120, 110], 0.55), SIGNAL, p);
      const cTiming = mix(TIMING_PAPER, TIMING, p);
      const cBase = mix([12, 14, 18], [154, 163, 178], p);
      const baseAlpha = 0.1 + p * 0.1;
      const streamAlpha = 0.22 + p * 0.42;
      const drift = reduce ? 0 : t;

      if (!reduce) {
        for (let n = 0; n < 24; n++) {
          bits[(Math.random() * bits.length) | 0] ^= 1;
        }
      }

      for (let c = 0; c < cols; c++) {
        const x = c * cell;
        const head = (drift * colSpeed[c] + colPhase[c]) % 1;
        for (let r = 0; r < rows; r++) {
          const dist = (head - r / rows + 1) % 1;
          const stream = dist < 0.22 ? 1 - dist / 0.22 : 0;
          const seed = (c * 7 + r * 13) % 11;
          const a = stream > 0 ? stream * streamAlpha : seed < 2 ? baseAlpha * 0.6 : 0;
          if (a < 0.04) continue;
          const bit = bits[r * cols + c];
          const col = stream > 0.6 ? (bit ? cSignal : cTiming) : cBase;
          ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a.toFixed(3)})`;
          ctx.fillText(bit ? "1" : "0", x, r * cell);
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 42) return; // ~24 fps räcker för bakgrundsfältet
      last = now;
      draw(now);
    };

    const onScrollStatic = () => {
      if (dirty) return;
      dirty = true;
      requestAnimationFrame(() => {
        draw(0);
        dirty = false;
      });
    };

    resize();
    const onResize = () => {
      resize();
      if (reduce) {
        draw(0);
        dirty = false;
      }
    };
    window.addEventListener("resize", onResize);

    if (reduce) {
      draw(0);
      dirty = false;
      window.addEventListener("scroll", onScrollStatic, { passive: true });
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScrollStatic);
      delete root.dataset.tone;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-sticky-field
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-paper"
    />
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildRobot, drawEye } from "./robot";

/**
 * Hero: musen styr en mörk ink-trail med binary i. Trailen äter porträttet och
 * avslöjar robotskallen (kromat foto, paneler, kablar, wireframe, cyan öga).
 * Ingenting spelas av sig självt — reveal kräver rörelse (mus eller finger).
 * HUD (brackets, YAW/PITCH, SCANNING↔TRACKING) är DOM; effektlagret är en canvas.
 * Reduced motion: statiskt porträtt + HUD-text, ingen canvas/trail.
 */

const PORTRAIT = "/images/portrait.jpg";
const SIGNAL = "#ff3b2e";
const TIMING = "#3dffb0";
const GRID_W = 72;
const GRID_H = 96;
const MASK_SCALE = 0.4;

type Particle = { x: number; y: number; vx: number; vy: number; life: number; c: string };

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Props = {
  ctaHref: string;
  ctaLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  micro: string;
};

export function HeroCyborg({ ctaHref, ctaLabel, secondaryHref, secondaryLabel, micro }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const yawRef = useRef<HTMLSpanElement>(null);
  const pitchRef = useRef<HTMLSpanElement>(null);
  const statusRefs = useRef<HTMLElement[]>([]);
  const noseRef = useRef<HTMLSpanElement>(null);
  const mouthRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const fx = fxRef.current;
    const frame = frameRef.current;
    const ctx = fx?.getContext("2d");
    if (!hero || !fx || !frame || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0;
    let H = 0;
    let fr = { x: 0, y: 0, w: 0, h: 0 };
    let trail: HTMLCanvasElement;
    let tctx: CanvasRenderingContext2D;
    let pattern: HTMLCanvasElement;
    let tmpInk: HTMLCanvasElement;
    let tmpBot: HTMLCanvasElement;
    let robot: HTMLCanvasElement | null = null;
    let robotLoading = false;
    const eat = new Float32Array(GRID_W * GRID_H);
    const eatCanvas = document.createElement("canvas");
    eatCanvas.width = GRID_W;
    eatCanvas.height = GRID_H;
    const eatCtx = eatCanvas.getContext("2d")!;
    const eatImg = eatCtx.createImageData(GRID_W, GRID_H);
    let eatMax = 0;

    const ptr = { x: 0, y: 0, px: -1, py: -1, active: false, speed: 0, lastMove: 0, dist: 0 };
    const particles: Particle[] = [];
    let raf = 0;
    let visible = true;
    let lastT = performance.now();
    let cleared = true;
    let glitchUntil = 0;
    let nextGlitch = performance.now() + 4000;
    let patternTick = 0;
    let tracking = false;

    const makeCanvas = (w: number, h: number) => {
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(w));
      c.height = Math.max(1, Math.round(h));
      return c;
    };

    const drawPattern = () => {
      const p = pattern.getContext("2d")!;
      p.setTransform(dpr, 0, 0, dpr, 0, 0);
      p.fillStyle = "#07080a";
      p.fillRect(0, 0, W, H);
      const sheen = p.createLinearGradient(0, 0, W, H);
      sheen.addColorStop(0, "rgba(244,241,234,0.07)");
      sheen.addColorStop(0.4, "rgba(244,241,234,0)");
      sheen.addColorStop(1, "rgba(244,241,234,0.04)");
      p.fillStyle = sheen;
      p.fillRect(0, 0, W, H);
      p.strokeStyle = "rgba(42,49,64,0.9)";
      p.lineWidth = 1;
      p.beginPath();
      for (let x = 0; x < W; x += 36) {
        p.moveTo(x + 0.5, 0);
        p.lineTo(x + 0.5, H);
      }
      for (let y = 0; y < H; y += 36) {
        p.moveTo(0, y + 0.5);
        p.lineTo(W, y + 0.5);
      }
      p.stroke();
      p.font = "13px ui-monospace, Menlo, monospace";
      p.textBaseline = "top";
      for (let y = 0; y < H; y += 18) {
        for (let x = 0; x < W; x += 18) {
          if (Math.random() < 0.38) continue;
          const r = Math.random();
          p.fillStyle = r < 0.45 ? SIGNAL : r < 0.9 ? TIMING : "#9aa3b2";
          p.globalAlpha = 0.35 + Math.random() * 0.55;
          p.fillText(Math.random() < 0.5 ? "0" : "1", x + 3, y + 2);
        }
      }
      p.globalAlpha = 1;
    };

    /** Slumpar om en handfull celler så binary i trailen flimrar */
    const flickerPattern = () => {
      const p = pattern.getContext("2d")!;
      p.font = "13px ui-monospace, Menlo, monospace";
      p.textBaseline = "top";
      for (let i = 0; i < 90; i++) {
        const x = Math.floor((Math.random() * W) / 18) * 18;
        const y = Math.floor((Math.random() * H) / 18) * 18;
        p.fillStyle = "#07080a";
        p.fillRect(x + 1, y + 1, 17, 17);
        if (Math.random() < 0.3) continue;
        const r = Math.random();
        p.fillStyle = r < 0.45 ? SIGNAL : r < 0.9 ? TIMING : "#9aa3b2";
        p.globalAlpha = 0.4 + Math.random() * 0.55;
        p.fillText(Math.random() < 0.5 ? "0" : "1", x + 3, y + 2);
        p.globalAlpha = 1;
      }
    };

    const measure = () => {
      const hr = hero.getBoundingClientRect();
      const f = frame.getBoundingClientRect();
      W = hr.width;
      H = hr.height;
      fr = { x: f.left - hr.left, y: f.top - hr.top, w: f.width, h: f.height };
      fx.width = Math.round(W * dpr);
      fx.height = Math.round(H * dpr);
      trail = makeCanvas(W * MASK_SCALE, H * MASK_SCALE);
      tctx = trail.getContext("2d")!;
      pattern = makeCanvas(W * dpr, H * dpr);
      tmpInk = makeCanvas(W * dpr, H * dpr);
      tmpBot = makeCanvas(fr.w * dpr, fr.h * dpr);
      drawPattern();
      robot = null; // byggs om i rätt storlek vid nästa behov
      cleared = false;
    };

    const ensureRobot = () => {
      if (robot || robotLoading) return;
      robotLoading = true;
      const img = new window.Image();
      img.onload = () => {
        robot = buildRobot(img, Math.round(fr.w * dpr), Math.round(fr.h * dpr));
        robotLoading = false;
      };
      img.onerror = () => {
        robotLoading = false;
      };
      img.src = PORTRAIT;
    };

    const stamp = (x: number, y: number, r: number) => {
      const s = MASK_SCALE;
      const g = tctx.createRadialGradient(x * s, y * s, 0, x * s, y * s, r * s);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(0.68, "rgba(0,0,0,0.96)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      tctx.fillStyle = g;
      tctx.beginPath();
      tctx.arc(x * s, y * s, r * s, 0, Math.PI * 2);
      tctx.fill();
    };

    const eatAt = (x: number, y: number, r: number, amount: number) => {
      const gx = ((x - fr.x) / fr.w) * GRID_W;
      const gy = ((y - fr.y) / fr.h) * GRID_H;
      const gr = (r / fr.w) * GRID_W;
      if (gx < -gr || gx > GRID_W + gr || gy < -gr || gy > GRID_H + gr) return;
      const x0 = Math.max(0, Math.floor(gx - gr));
      const x1 = Math.min(GRID_W - 1, Math.ceil(gx + gr));
      const y0 = Math.max(0, Math.floor(gy - gr));
      const y1 = Math.min(GRID_H - 1, Math.ceil(gy + gr));
      for (let j = y0; j <= y1; j++) {
        for (let i = x0; i <= x1; i++) {
          const d = Math.hypot(i - gx, j - gy) / gr;
          if (d >= 1) continue;
          const k = i + j * GRID_W;
          eat[k] = Math.min(1, eat[k] + amount * (1 - d * d));
        }
      }
    };

    const setStatus = (text: string) => {
      statusRefs.current.forEach((el) => {
        if (el.textContent !== text) el.textContent = text;
      });
    };

    const onMove = (e: PointerEvent) => {
      const hr = hero.getBoundingClientRect();
      const x = e.clientX - hr.left;
      const y = e.clientY - hr.top;
      if (y < 0 || y > hr.height) return;
      if (!tctx) return;
      ensureRobot();
      const now = performance.now();
      if (ptr.px < 0) {
        ptr.px = x;
        ptr.py = y;
      }
      const dx = x - ptr.px;
      const dy = y - ptr.py;
      const dist = Math.hypot(dx, dy);
      const dt = Math.max(1, now - ptr.lastMove);
      ptr.speed = ptr.speed * 0.7 + (dist / dt) * 0.3;
      const radius = Math.min(96, 38 + ptr.speed * 34);
      const steps = Math.max(1, Math.ceil(dist / 6));
      for (let i = 1; i <= steps; i++) {
        const px = ptr.px + (dx * i) / steps;
        const py = ptr.py + (dy * i) / steps;
        ptr.dist += dist / steps;
        const wobble = 0.86 + Math.sin(ptr.dist * 0.06) * 0.14;
        stamp(px, py, radius * wobble);
        eatAt(px, py, radius * 0.85, 0.16);
        if (ptr.speed > 0.5 && particles.length < 70 && Math.random() < 0.5) {
          particles.push({
            x: px,
            y: py,
            vx: (Math.random() - 0.5) * 2.4 - dx * 0.02,
            vy: (Math.random() - 0.5) * 2.4 - dy * 0.02,
            life: 1,
            c: Math.random() < 0.55 ? SIGNAL : TIMING,
          });
        }
      }
      ptr.x = x;
      ptr.y = y;
      ptr.px = x;
      ptr.py = y;
      ptr.active = true;
      ptr.lastMove = now;
      cleared = false;

      const inFrame =
        x >= fr.x && x <= fr.x + fr.w && y >= fr.y && y <= fr.y + fr.h;
      const nx = fr.w ? (x - fr.x) / fr.w - 0.5 : 0;
      const ny = fr.h ? (y - fr.y) / fr.h - 0.5 : 0;
      const cx = Math.max(-1, Math.min(1, nx * 2));
      const cy = Math.max(-1, Math.min(1, ny * 2));
      frame.style.setProperty("--px", cx.toFixed(3));
      frame.style.setProperty("--py", cy.toFixed(3));
      const sign = (v: number) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(1).padStart(4, "0");
      if (yawRef.current) yawRef.current.textContent = `${sign(cx * 32)}°`;
      if (pitchRef.current) pitchRef.current.textContent = `${sign(-cy * 22)}°`;
      if (inFrame !== tracking) {
        tracking = inFrame;
        frame.dataset.state = inFrame ? "tracking" : "scanning";
        setStatus(inFrame ? "TRACKING" : "SCANNING");
      }
    };

    const onLeave = () => {
      ptr.active = false;
      ptr.px = -1;
      ptr.speed = 0;
      if (tracking) {
        tracking = false;
        frame.dataset.state = "scanning";
        setStatus("SCANNING");
      }
    };

    const renderEat = () => {
      const d = eatImg.data;
      eatMax = 0;
      for (let k = 0; k < eat.length; k++) {
        const v = eat[k];
        if (v > eatMax) eatMax = v;
        d[k * 4 + 3] = Math.round(smooth(0.18, 0.7, v) * 255);
      }
      eatCtx.putImageData(eatImg, 0, 0);
    };

    const frameLoop = (now: number) => {
      raf = requestAnimationFrame(frameLoop);
      if (!visible || !tctx) return;
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      const t = now / 1000;

      const recent = now - ptr.lastMove < 3000;
      const live = ptr.active || recent || eatMax > 0.01 || particles.length > 0;
      if (!live) {
        if (!cleared) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, fx.width, fx.height);
          cleared = true;
        }
        return;
      }

      // Håll blobben vid liv när musen står still, annars töms den
      if (ptr.active && now - ptr.lastMove < 600) {
        stamp(ptr.x, ptr.y, 40 + Math.sin(t * 6) * 4);
        eatAt(ptr.x, ptr.y, 34, dt * 1.1);
      }
      tctx.globalCompositeOperation = "destination-out";
      tctx.fillStyle = "rgba(0,0,0,0.05)";
      tctx.fillRect(0, 0, trail.width, trail.height);
      tctx.globalCompositeOperation = "source-over";
      ptr.speed *= 0.92;

      for (let k = 0; k < eat.length; k++) {
        if (eat[k] > 0) eat[k] = Math.max(0, eat[k] - dt * 0.05);
      }
      renderEat();

      if (now - patternTick > 120) {
        patternTick = now;
        flickerPattern();
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Robotlagret: foto + dynamiskt öga/scan, maskat av "uppätet"-gridet
      if (robot && eatMax > 0.01) {
        const b = tmpBot.getContext("2d")!;
        b.setTransform(1, 0, 0, 1, 0, 0);
        b.globalCompositeOperation = "source-over";
        b.clearRect(0, 0, tmpBot.width, tmpBot.height);
        b.drawImage(robot, 0, 0);
        b.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawEye(b, fr.w, fr.h, t);
        const sy = ((t * 0.22) % 1) * fr.h;
        const band = b.createLinearGradient(0, sy - 36, 0, sy);
        band.addColorStop(0, "rgba(61,255,176,0)");
        band.addColorStop(1, "rgba(61,255,176,0.32)");
        b.fillStyle = band;
        b.fillRect(0, sy - 36, fr.w, 36);
        b.fillStyle = TIMING;
        b.fillRect(0, sy, fr.w, 1.5);
        if (now > nextGlitch) {
          glitchUntil = now + 140;
          nextGlitch = now + 3500 + Math.random() * 3500;
        }
        if (now < glitchUntil) {
          const gy = Math.random() * fr.h * 0.8;
          const gh = 14 + Math.random() * 40;
          b.setTransform(1, 0, 0, 1, 0, 0);
          b.drawImage(
            tmpBot, 0, gy * dpr, tmpBot.width, gh * dpr,
            (Math.random() - 0.5) * 24 * dpr, gy * dpr, tmpBot.width, gh * dpr,
          );
          b.fillStyle = "rgba(255,59,46,0.25)";
          b.fillRect(0, gy * dpr, tmpBot.width, 2 * dpr);
        }
        b.setTransform(1, 0, 0, 1, 0, 0);
        b.globalCompositeOperation = "destination-in";
        b.imageSmoothingEnabled = true;
        b.drawImage(eatCanvas, 0, 0, tmpBot.width, tmpBot.height);
        b.globalCompositeOperation = "source-over";
        ctx.drawImage(tmpBot, fr.x, fr.y, fr.w, fr.h);
      }

      // Ink-trailen med binary på mörkt grid
      const k = tmpInk.getContext("2d")!;
      k.setTransform(1, 0, 0, 1, 0, 0);
      k.globalCompositeOperation = "source-over";
      k.clearRect(0, 0, tmpInk.width, tmpInk.height);
      k.drawImage(pattern, 0, 0);
      k.globalCompositeOperation = "destination-in";
      k.imageSmoothingEnabled = true;
      k.drawImage(trail, 0, 0, tmpInk.width, tmpInk.height);
      k.globalCompositeOperation = "source-over";
      ctx.drawImage(tmpInk, 0, 0, W, H);

      // Partikelgnistor
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.life -= dt * 1.6;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
      }
      ctx.globalAlpha = 1;

      // Hårkors + koordinatläsning
      if (ptr.active) {
        const { x, y } = ptr;
        ctx.strokeStyle = SIGNAL;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          ctx.moveTo(x + ax * 10, y + ay * 10);
          ctx.lineTo(x + ax * 24, y + ay * 24);
        }
        ctx.stroke();
        ctx.strokeStyle = TIMING;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = "10px ui-monospace, Menlo, monospace";
        ctx.fillStyle = TIMING;
        ctx.fillText(
          `X${String(Math.round(x)).padStart(4, "0")} Y${String(Math.round(y)).padStart(4, "0")}`,
          x + 18,
          y + 22,
        );
      }
    };

    // Löpande HUD-siffror på bracketsen (påverkar inte layout)
    const readout = window.setInterval(() => {
      if (!visible) return;
      const j = (base: number) => Math.min(99, base + Math.floor(Math.random() * 3));
      if (noseRef.current) noseRef.current.textContent = `NOSE ${j(96)}%`;
      if (mouthRef.current) mouthRef.current.textContent = `MOUTH ${j(92)}%`;
    }, 900);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(hero);

    // Texten tonas ut när heron scrollas bort
    const onScroll = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.7)));
      if (textRef.current) textRef.current.style.opacity = String(1 - smooth(0.1, 1, p));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    ro.observe(frame);
    measure();

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerdown", onMove);
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("pointerup", (e) => {
      if (e.pointerType === "touch") onLeave();
    });
    raf = requestAnimationFrame(frameLoop);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(readout);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerdown", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const reg = (el: HTMLElement | null) => {
    if (el && !statusRefs.current.includes(el)) statusRefs.current.push(el);
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Rickard Javanainen"
      className="hero-fg relative -mt-16 flex min-h-[100svh] flex-col justify-end overflow-hidden px-4 pb-10 pt-28 sm:px-6 lg:pb-14"
      style={{ touchAction: "pan-y" }}
    >
      {/* Porträttram: foto under (z-10), HUD över effektlagret (z-30) */}
      <div className="pointer-events-none relative mx-auto mb-8 aspect-[3/4] h-[46svh] max-h-[560px] lg:absolute lg:right-[9vw] lg:top-1/2 lg:mb-0 lg:h-[72svh] lg:max-h-[760px] lg:-translate-y-[47%]">
        <div ref={frameRef} data-state="scanning" className="hero-frame relative h-full w-full">
          <div className="relative z-10 h-full w-full overflow-hidden border border-line bg-carbon shadow-[6px_6px_0_var(--color-signal-dim)]">
            <Image
              src={PORTRAIT}
              alt="Rickard Javanainen, hyrkart-förare, med VM-bronspokalen från 2016"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 z-30" aria-hidden="true">
            <span
              className="hud-bracket"
              style={{ left: "34.5%", top: "35.9%", ["--w" as string]: "15%" }}
            >
              <span ref={noseRef} className="hud-label hud-label-left">NOSE 98%</span>
            </span>
            <span
              className="hud-bracket"
              style={{ left: "37.5%", top: "40.4%", ["--w" as string]: "21%" }}
            >
              <span ref={mouthRef} className="hud-label hud-label-below">MOUTH 94%</span>
            </span>
            <span
              className="hud-bracket hud-bracket-eye"
              style={{ left: "39.7%", top: "30.2%", ["--w" as string]: "11%" }}
            >
              <span className="hud-label">EYE · LOCK</span>
            </span>
            <div className="hud-readout absolute bottom-2 left-2 flex gap-3">
              <span>YAW <span ref={yawRef}>+00.0°</span></span>
              <span>PITCH <span ref={pitchRef}>+00.0°</span></span>
            </div>
            <div className="hud-readout absolute right-2 top-2">
              <span ref={reg} data-status>SCANNING</span>
            </div>
          </div>
        </div>
      </div>

      <canvas
        ref={fxRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      />

      {/* Hörn-HUD */}
      <p className="hud-corner absolute left-4 top-20 z-30 sm:left-6" aria-hidden="true">
        FACE MESH · 468 PTS
      </p>
      <p className="hud-corner absolute bottom-4 right-4 z-30 hidden sm:right-6 lg:block" aria-hidden="true">
        <span className="hud-cue-pointer">Scrolla för att gå djupare</span>
      </p>

      <div ref={textRef} className="relative z-30 mx-auto w-full max-w-6xl">
        <p className="hud-corner mb-4 !text-[11px]">{micro}</p>
        <h1 className="heading-caps text-[2.5rem] font-extrabold leading-[0.92] sm:text-7xl lg:text-6xl xl:text-7xl">
          Rickard
          <br />
          Javanainen
        </h1>
        <p className="mt-5 max-w-md text-xl font-medium sm:text-2xl">Läser racet.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={ctaHref} className="btn btn-primary shadow-[4px_4px_0_var(--color-signal-dim)]">
            {ctaLabel}
          </Link>
          <Link href={secondaryHref} className="btn border border-current">
            {secondaryLabel}
          </Link>
        </div>
        <p className="hud-corner mt-8" aria-hidden="true">
          <span className="hud-cue-pointer">För musen för att avslöja</span>
          <span className="hud-cue-touch">Dra fingret över ansiktet</span>
        </p>
      </div>
    </section>
  );
}

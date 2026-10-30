/**
 * Robotskallen under porträttet. Allt ritas procedurellt ovanpå ett kromat
 * (avfärgat, kontrastat) lager av själva fotot, så ansiktets form är intakt.
 * Koordinater anges normaliserade mot fotots 1440×1920 (se PT).
 */

export const IMG_W = 1440;
export const IMG_H = 1920;

/** Landmärken i fotot (normaliserade) — HUD i DOM använder samma värden i procent. */
export const PT = {
  eyeR: [572 / IMG_W, 580 / IMG_H],
  eyeL: [395 / IMG_W, 622 / IMG_H],
  nose: [497 / IMG_W, 690 / IMG_H],
  mouth: [540 / IMG_W, 775 / IMG_H],
} as const;

const TIMING = "#3dffb0";
const SIGNAL = "#ff3b2e";

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bygger robotlagret i canvas-pixlar (w×h, samma proportion som fotot). */
export function buildRobot(img: CanvasImageSource, w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const sx = w / IMG_W;
  const sy = h / IMG_H;
  const X = (v: number) => v * sx;
  const Y = (v: number) => v * sy;
  const line = (pts: number[][], color: string, width: number, alpha = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width * sx;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))));
    ctx.stroke();
    ctx.restore();
  };

  // 1) Kromat foto: luminans → stålramp med band
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const l = (px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11) / 255;
    let v = Math.min(1, Math.max(0, (l - 0.1) * 1.55));
    v = v * 0.55 + (Math.floor(v * 7) / 7) * 0.45;
    px[i] = 18 + v * 190;
    px[i + 1] = 24 + v * 205;
    px[i + 2] = 34 + v * 221;
  }
  ctx.putImageData(data, 0, 0);

  // 2) Skalle: kupol, mittsöm, pannplatta, kindpaneler, käke
  const seam = "rgba(7,8,10,0.85)";
  const hi = "rgba(244,241,234,0.55)";
  const seams: number[][][] = [
    [[300, 520], [350, 400], [480, 330], [610, 360], [690, 470]],
    [[495, 340], [498, 450], [496, 548]],
    [[310, 545], [430, 566], [500, 548], [640, 524]],
    [[310, 645], [378, 765], [452, 805], [436, 700]],
    [[694, 560], [664, 722], [602, 802], [612, 690]],
    [[330, 800], [380, 880], [470, 925], [600, 880], [690, 730]],
    [[420, 640], [400, 700]],
    [[610, 640], [630, 700]],
  ];
  for (const s of seams) {
    line(s, seam, 5);
    line(s.map(([x, y]) => [x + 2, y - 2]), hi, 1.6);
  }

  // Munnens galler
  for (let i = 0; i < 9; i++) {
    const x = 440 + i * 24;
    line([[x, 748], [x, 802]], seam, 4);
  }
  line([[428, 744], [650, 744]], hi, 1.4);
  line([[428, 806], [650, 806]], seam, 4);

  // Kugghjul vid tinningen
  const gear = (cx: number, cy: number, r: number, teeth: number) => {
    ctx.save();
    ctx.translate(X(cx), Y(cy));
    ctx.strokeStyle = seam;
    ctx.fillStyle = "rgba(7,8,10,0.55)";
    ctx.lineWidth = 3 * sx;
    ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
      const a = (i / (teeth * 2)) * Math.PI * 2;
      const rr = (i % 2 ? r * 0.82 : r) * sx;
      ctx[i ? "lineTo" : "moveTo"](Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = hi;
    ctx.lineWidth = 1.5 * sx;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.42 * sx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };
  gear(668, 575, 38, 12);
  gear(618, 468, 22, 9);

  // Kablar från halsen
  const cable = (pts: number[][], color: string, width: number) => {
    line(pts, "rgba(7,8,10,0.9)", width + 4);
    line(pts, color, width);
  };
  cable([[430, 905], [395, 990], [430, 1090], [500, 1160]], "#555d6b", 9);
  cable([[470, 925], [470, 1020], [520, 1110]], "#777f8d", 7);
  cable([[560, 905], [585, 1000], [560, 1100]], SIGNAL, 6);
  cable([[610, 880], [660, 970], [700, 1060]], "#555d6b", 8);

  // 3) Kretsmönster på overallen (seedad så den blir densamma varje gång)
  const rnd = rng(2016);
  for (let n = 0; n < 34; n++) {
    let x = 160 + rnd() * 700;
    let y = 1080 + rnd() * 780;
    const pts: number[][] = [[x, y]];
    const steps = 3 + ((rnd() * 4) | 0);
    for (let s = 0; s < steps; s++) {
      if (s % 2 === 0) x += (rnd() - 0.5) * 220;
      else y += (rnd() - 0.2) * 140;
      pts.push([x, y]);
    }
    line(pts, TIMING, 2.2, 0.55);
    const end = pts[pts.length - 1];
    ctx.fillStyle = TIMING;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(X(end[0] - 5), Y(end[1] - 5), 10 * sx, 10 * sx);
    ctx.globalAlpha = 1;
  }

  // 4) Wireframe: näsa, kind, haka
  const mesh: number[][][] = [
    [[480, 600], [455, 705], [497, 690], [535, 708], [510, 600]],
    [[455, 705], [400, 690], [430, 640], [480, 600]],
    [[535, 708], [592, 690], [570, 640], [510, 600]],
    [[497, 690], [500, 760]],
    [[400, 690], [440, 780], [500, 760], [585, 780], [592, 690]],
    [[440, 780], [470, 900], [560, 905], [585, 780]],
    [[470, 900], [500, 760], [560, 905]],
  ];
  for (const m of mesh) line(m, TIMING, 1.8, 0.85);
  ctx.fillStyle = TIMING;
  for (const m of mesh)
    for (const [x, y] of m) ctx.fillRect(X(x - 4), Y(y - 4), 8 * sx, 8 * sx);

  // 5) Vänster öga: matt linsplatta. Höger öga ritas dynamiskt (pulserar) i effektlagret.
  const lens = (cx: number, cy: number, r: number) => {
    ctx.fillStyle = "#05080c";
    ctx.beginPath();
    ctx.arc(X(cx), Y(cy), r * sx, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(244,241,234,0.5)";
    ctx.lineWidth = 3 * sx;
    ctx.stroke();
  };
  lens(PT.eyeL[0] * IMG_W, PT.eyeL[1] * IMG_H, 30);
  ctx.fillStyle = SIGNAL;
  ctx.globalAlpha = 0.8;
  ctx.fillRect(X(PT.eyeL[0] * IMG_W - 5), Y(PT.eyeL[1] * IMG_H - 5), 10 * sx, 10 * sx);
  ctx.globalAlpha = 1;
  lens(PT.eyeR[0] * IMG_W, PT.eyeR[1] * IMG_H, 40);

  return c;
}

/** Det cyan ögat med pulserande glöd — ritas varje bildruta ovanpå robotlagret. */
export function drawEye(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cx = PT.eyeR[0] * w;
  const cy = PT.eyeR[1] * h;
  const r = (w / IMG_W) * 40;
  const pulse = 0.65 + Math.sin(t * 2.2) * 0.2;
  const glow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 3);
  glow.addColorStop(0, `rgba(61,255,176,${0.45 * pulse})`);
  glow.addColorStop(1, "rgba(61,255,176,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(cx - r * 3, cy - r * 3, r * 6, r * 6);

  const iris = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 0.86);
  iris.addColorStop(0, "#eafff6");
  iris.addColorStop(0.35, TIMING);
  iris.addColorStop(1, "#0b6a4a");
  ctx.fillStyle = iris;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.86, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(7,8,10,0.8)";
  ctx.lineWidth = Math.max(1, r * 0.08);
  for (const k of [0.62, 0.42]) {
    ctx.beginPath();
    ctx.arc(cx, cy, r * k, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = "#04120c";
  ctx.beginPath();
  ctx.arc(cx, cy, r * (0.16 + Math.sin(t * 1.3) * 0.02), 0, Math.PI * 2);
  ctx.fill();

  // Hårkors-tickar runt linsen
  ctx.strokeStyle = TIMING;
  ctx.lineWidth = Math.max(1, r * 0.06);
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + t * 0.4;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r * 1.05, cy + Math.sin(a) * r * 1.05);
    ctx.lineTo(cx + Math.cos(a) * r * 1.3, cy + Math.sin(a) * r * 1.3);
    ctx.stroke();
  }
}

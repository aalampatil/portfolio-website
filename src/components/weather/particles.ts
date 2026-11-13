import type { Season } from "@/lib/seasons";
import type { Burst, Particle, SceneSize } from "./types";

export function createParticles(season: Season, size: SceneSize): Particle[] {
  const density = Math.max(0.4, Math.min(1.25, (size.width * size.height) / 1_150_000));
  const count = { winter: 170, monsoon: 200, summer: 26, spring: 30, autumn: 23 }[season];
  return Array.from({ length: Math.round(count * density) }, () => {
    const depth = 0.2 + Math.random() * 0.8;
    return {
      x: Math.random() * size.width,
      y: Math.random() * size.height,
      radius: season === "winter" ? 0.6 + depth * 2.5 : 2 + depth * 4,
      speed: season === "monsoon" ? 500 + depth * 650 : season === "summer" ? -5 - depth * 9 : 14 + depth * 38,
      depth,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
    };
  });
}

export function createSnowSprite(): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 48;
  const ctx = sprite.getContext("2d");
  if (!ctx) return sprite;
  ctx.translate(24, 24);
  const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 23);
  glow.addColorStop(0, "rgba(243,250,255,0.9)");
  glow.addColorStop(0.35, "rgba(225,239,250,0.35)");
  glow.addColorStop(1, "rgba(174,206,230,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(-24, -24, 48, 48);
  ctx.strokeStyle = "rgba(246,251,255,0.95)";
  ctx.lineWidth = 1.7;
  ctx.lineCap = "round";
  for (let i = 0; i < 6; i++) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -16);
    ctx.moveTo(0, -10);
    ctx.lineTo(-4, -13);
    ctx.moveTo(0, -10);
    ctx.lineTo(4, -13);
    ctx.stroke();
  }
  return sprite;
}

export function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle, season: Season, sprite: HTMLCanvasElement) {
  const { x, y, radius, depth, rotation } = particle;
  ctx.globalAlpha = 0.25 + depth * 0.65;
  if (season === "winter") {
    const diameter = radius * 4;
    ctx.drawImage(sprite, x - diameter / 2, y - diameter / 2, diameter, diameter);
  } else if (season === "monsoon") {
    ctx.strokeStyle = "#a8c5df";
    ctx.lineWidth = 0.5 + depth * 0.65;
    ctx.globalAlpha = 0.13 + depth * 0.3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 3 - depth * 4, y + 8 + depth * 20);
    ctx.stroke();
  } else if (season === "summer") {
    ctx.fillStyle = "#f8dc9a";
    ctx.globalAlpha = 0.12 + depth * 0.25;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.22, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(1, 0.35 + Math.abs(Math.cos(rotation)) * 0.65);
    ctx.fillStyle = season === "spring" ? (depth > 0.6 ? "#f2b8c7" : "#e8ced6") : (depth > 0.6 ? "#cc8644" : "#bd5735");
    ctx.beginPath();
    ctx.moveTo(-radius, 0);
    ctx.bezierCurveTo(-radius * 0.5, -radius, radius * 0.8, -radius * 0.8, radius, 0);
    ctx.bezierCurveTo(radius * 0.4, radius * 0.8, -radius * 0.5, radius * 0.8, -radius, 0);
    ctx.fill();
    if (season === "autumn") {
      ctx.strokeStyle = "rgba(94,48,21,0.45)";
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      ctx.moveTo(-radius, 0);
      ctx.lineTo(radius * 0.7, 0);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

export function drawSunshine(ctx: CanvasRenderingContext2D, size: SceneSize, time: number) {
  const x = size.width * 0.88;
  const y = -35;
  const reach = Math.min(850, size.width * 0.85);
  const glow = ctx.createRadialGradient(x, y, 0, x, y, reach);
  glow.addColorStop(0, "rgba(255,221,141,0.2)");
  glow.addColorStop(0.3, "rgba(250,196,102,0.065)");
  glow.addColorStop(1, "rgba(244,177,76,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size.width, size.height);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(time * 0.035) * 0.045);
  for (let i = 0; i < 7; i++) {
    const angle = 0.6 + i * 0.25;
    const ray = ctx.createLinearGradient(0, 0, Math.cos(angle) * reach, Math.sin(angle) * reach);
    ray.addColorStop(0, "rgba(255,230,161,0.07)");
    ray.addColorStop(1, "rgba(255,223,152,0)");
    ctx.fillStyle = ray;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * reach, Math.sin(angle) * reach);
    ctx.lineTo(Math.cos(angle + 0.065) * reach, Math.sin(angle + 0.065) * reach);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

export function drawBursts(ctx: CanvasRenderingContext2D, bursts: Burst[], dt: number, rain: boolean) {
  for (let i = bursts.length - 1; i >= 0; i--) {
    const burst = bursts[i];
    burst.life -= dt;
    if (burst.life <= 0) {
      bursts.splice(i, 1);
      continue;
    }
    burst.x += burst.vx * dt;
    burst.y += burst.vy * dt;
    burst.vy += (rain ? 180 : 65) * dt;
    ctx.globalAlpha = (burst.life / burst.duration) * 0.65;
    ctx.fillStyle = rain ? "#b6d9ed" : "#f2f8ff";
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

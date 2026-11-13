import type { Season } from "@/lib/seasons";
import type { Burst, Particle, SceneSize } from "./types";

export function createParticles(season: Season, size: SceneSize): Particle[] {
  const density = Math.max(0.4, Math.min(1.25, (size.width * size.height) / 1_150_000));
  const count = season === "winter" ? 170 : 80;
  return Array.from({ length: Math.round(count * density) }, () => {
    const depth = 0.2 + Math.random() * 0.8;
    return {
      x: Math.random() * size.width,
      y: Math.random() * size.height,
      radius: season === "winter" ? 0.6 + depth * 2.5 : 2 + depth * 5.5,
      speed: 14 + depth * (season === "winter" ? 38 : 26),
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
  } else {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(1, 0.35 + Math.abs(Math.cos(rotation)) * 0.65);
    const petal = ctx.createLinearGradient(-radius, 0, radius, 0);
    petal.addColorStop(0, "#d987a4");
    petal.addColorStop(0.5, depth > 0.6 ? "#f2b8c7" : "#e8ced6");
    petal.addColorStop(1, "#fce9ef");
    ctx.fillStyle = petal;
    ctx.beginPath();
    ctx.moveTo(-radius, 0);
    ctx.bezierCurveTo(-radius * 0.55, -radius * 0.85, radius * 0.5, -radius * 0.85, radius, -radius * 0.3);
    // Sakura petals have a small notch at their rounded tip.
    ctx.lineTo(radius * 0.65, 0);
    ctx.lineTo(radius, radius * 0.28);
    ctx.bezierCurveTo(radius * 0.45, radius * 0.85, -radius * 0.65, radius * 0.8, -radius, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(188,100,133,0.3)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

export function drawBursts(ctx: CanvasRenderingContext2D, bursts: Burst[], dt: number) {
  for (let i = bursts.length - 1; i >= 0; i--) {
    const burst = bursts[i];
    burst.life -= dt;
    if (burst.life <= 0) {
      bursts.splice(i, 1);
      continue;
    }
    burst.x += burst.vx * dt;
    burst.y += burst.vy * dt;
    burst.vy += 65 * dt;
    ctx.globalAlpha = (burst.life / burst.duration) * 0.65;
    ctx.fillStyle = "#f2f8ff";
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

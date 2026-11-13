import type { SceneSize, Surface } from "./types";

// Only substantial controls catch snow; the contribution calendar stays clear.
const SURFACE_SELECTOR = "[data-weather-surface], button:not(.contribution-cell), .neo-button, .neo-button-secondary, .project-arrow, .project-website-link";
const SNOW_SAMPLES = 20;

export class WeatherSurfaces {
  private surfaces = new Map<HTMLElement, Surface>();
  visible: Surface[] = [];

  measure({ width, height }: SceneSize) {
    const next = new Map<HTMLElement, Surface>();
    document.querySelectorAll<HTMLElement>(SURFACE_SELECTOR).forEach(element => {
      const bounds = element.getBoundingClientRect();
      if (bounds.width < 26 || bounds.height < 24 || bounds.height > 100) return;
      const existing = this.surfaces.get(element);
      const surface: Surface = existing ?? {
        element, bounds, visible: false,
        snow: Array.from({ length: SNOW_SAMPLES }, () => 0.4 + Math.random() * 0.7),
      };
      surface.bounds = bounds;
      surface.visible = bounds.bottom > 0 && bounds.top < height && bounds.right > 0 && bounds.left < width;
      if (surface.visible) {
        const front = document.elementFromPoint(
          Math.max(0, Math.min(width - 1, bounds.left + bounds.width / 2)),
          Math.max(0, bounds.top + 2),
        );
        surface.visible = !!front && element.contains(front);
      }
      next.set(element, surface);
    });
    this.surfaces = next;
    this.visible = [...next.values()].filter(surface => surface.visible);
  }

  findCollision(x: number, previousY: number, y: number): Surface | undefined {
    return this.visible.find(({ bounds }) =>
      x >= bounds.left && x <= bounds.right && previousY <= bounds.top && y >= bounds.top,
    );
  }

  settle(surface: Surface, x: number, radius: number) {
    const center = Math.round(((x - surface.bounds.left) / surface.bounds.width) * (SNOW_SAMPLES - 1));
    const maximum = Math.min(18, surface.bounds.height * 0.4);
    for (let offset = -2; offset <= 2; offset++) {
      const index = center + offset;
      if (index < 0 || index >= SNOW_SAMPLES) continue;
      surface.snow[index] = Math.min(maximum, surface.snow[index] + (radius * 0.4) / (Math.abs(offset) + 1));
    }
  }

  brush(target: EventTarget | null): Surface | undefined {
    if (!(target instanceof Element)) return;
    const element = target.closest<HTMLElement>(SURFACE_SELECTOR);
    const surface = element ? this.surfaces.get(element) : undefined;
    if (!surface || Math.max(...surface.snow) < 2) return;
    surface.snow = surface.snow.map(value => value * 0.12);
    return surface;
  }

  update(dt: number) {
    // Distant fine snow deposits between the larger visible flakes.
    for (const surface of this.visible) {
      const maximum = Math.min(18, surface.bounds.height * 0.4);
      for (let i = 0; i < surface.snow.length; i++) {
        surface.snow[i] = Math.min(maximum, surface.snow[i] + dt * (0.16 + Math.sin(i * 1.7) * 0.045));
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, time: number) {
    for (const { bounds, snow } of this.visible) {
      const { left, top, width } = bounds;
      const depth = Math.max(...snow);
      const base = top + Math.min(5, depth * 0.32);
      const gradient = ctx.createLinearGradient(0, top - depth, 0, base + 3);
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.62, "#edf5fb");
      gradient.addColorStop(1, "#a9c5db");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(left, base);
      for (let i = 0; i < snow.length; i++) {
        const x = left + (i / (snow.length - 1)) * width;
        const taper = Math.min(1, i / 2, (snow.length - 1 - i) / 2);
        const y = top - snow[i] * taper;
        if (i === 0) ctx.lineTo(x, y);
        else {
          const previousX = left + ((i - 1) / (snow.length - 1)) * width;
          ctx.quadraticCurveTo(previousX, top - snow[i - 1] * Math.min(1, (i - 1) / 2, (snow.length - i) / 2), (x + previousX) / 2, y);
        }
      }
      ctx.lineTo(left + width, base);
      // Small rounded overhangs make the cap look like settled powder.
      for (let i = snow.length - 1; i >= 0; i--) {
        const x = left + (i / (snow.length - 1)) * width;
        ctx.lineTo(x, base + Math.max(0, Math.sin(i * 2.2)) * depth * 0.24);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(116,155,184,0.38)";
      ctx.lineWidth = 0.6;
      ctx.stroke();
      // Occasional ice glints; no flashing or high-contrast pulses.
      if (depth > 3) {
        ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.sin(time * 0.7 + left) * 0.18})`;
        ctx.fillRect(left + width * 0.28, top - snow[5] * 0.5, 1.5, 1.5);
      }
    }
  }
}

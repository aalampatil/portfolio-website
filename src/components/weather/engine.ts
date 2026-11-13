import type { Season } from "@/lib/seasons";
import { createParticles, createSnowSprite, drawBursts, drawParticle, drawSunshine } from "./particles";
import { WeatherSurfaces } from "./surfaces";
import type { Burst, SceneSize } from "./types";

/** Owns a single weather scene. The returned function releases every resource. */
export function startWeatherScene(canvas: HTMLCanvasElement, season: Season, reducedMotion: boolean): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const surfaces = new WeatherSurfaces();
  const sprite = createSnowSprite();
  let size: SceneSize = { width: window.innerWidth, height: window.innerHeight };
  let particles = createParticles(season, size);
  const bursts: Burst[] = [];
  let frame = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let layoutDirty = true;
  let disposed = false;
  let wind = 0;
  let targetWind = 0;
  const catchesWeather = season === "winter" || season === "monsoon";

  function burst(x: number, y: number, count: number) {
    for (let i = 0; i < count && bursts.length < 70; i++) {
      const duration = season === "monsoon" ? 0.25 + Math.random() * 0.2 : 0.6 + Math.random() * 0.5;
      bursts.push({
        x, y, vx: (Math.random() - 0.5) * 90, vy: -12 - Math.random() * 50,
        life: duration, duration, radius: 0.5 + Math.random() * 1.4,
      });
    }
  }

  function respawn(particle: typeof particles[number]) {
    particle.y = -15 - Math.random() * 40;
    particle.x = Math.random() * (size.width + 60) - 30;
  }

  function render(now: number) {
    frame = 0;
    if (disposed || document.hidden || !ctx) return;
    // 30fps keeps the weather light on battery without tying speed to frame rate.
    if (!reducedMotion && lastFrame && now - lastFrame < 32) {
      frame = requestAnimationFrame(render);
      return;
    }
    const dt = reducedMotion || !lastFrame ? 0 : Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    elapsed += dt;
    wind += (targetWind - wind) * Math.min(1, dt * 1.5);
    if (layoutDirty && catchesWeather) {
      surfaces.measure(size);
      layoutDirty = false;
    }
    ctx.clearRect(0, 0, size.width, size.height);

    if (season === "summer") drawSunshine(ctx, size, elapsed);
    if (season === "winter" || season === "monsoon") {
      const haze = ctx.createLinearGradient(0, 0, 0, size.height * 0.65);
      haze.addColorStop(0, season === "winter" ? "rgba(144,183,222,0.055)" : "rgba(85,122,164,0.07)");
      haze.addColorStop(1, "rgba(120,160,205,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, size.width, size.height);
    }

    for (const particle of particles) {
      const previousY = particle.y;
      const breeze = Math.sin(elapsed * 0.45 + particle.phase) * 16;
      particle.y += particle.speed * dt;
      particle.x += (season === "monsoon" ? -140 - particle.depth * 100 : breeze + wind * particle.depth + 7) * dt;
      particle.rotation += dt * (0.5 + particle.depth);

      if (catchesWeather && particle.depth > 0.35 && !reducedMotion) {
        const surface = surfaces.findCollision(particle.x, previousY, particle.y);
        if (surface) {
          if (season === "winter") surfaces.settle(surface, particle.x, particle.radius);
          else burst(particle.x, surface.bounds.top, 3);
          respawn(particle);
        }
      }
      if (particle.y > size.height + 30) {
        if (season === "monsoon" && Math.random() > 0.65) burst(particle.x, size.height - 2, 2);
        respawn(particle);
      }
      if (season === "summer" && particle.y < -15) particle.y = size.height + 10;
      if (particle.x < -40) particle.x = size.width + 30;
      if (particle.x > size.width + 40) particle.x = -30;
      drawParticle(ctx, particle, season, sprite);
    }

    if (season === "winter") surfaces.update(dt);
    if (catchesWeather) surfaces.draw(ctx, season, elapsed);
    drawBursts(ctx, bursts, dt, season === "monsoon");
    if (!reducedMotion) frame = requestAnimationFrame(render);
  }

  function invalidateLayout() {
    layoutDirty = true;
    if (!frame && !document.hidden && !disposed) frame = requestAnimationFrame(render);
  }

  function resize() {
    size = { width: window.innerWidth, height: window.innerHeight };
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(size.width * pixelRatio);
    canvas.height = Math.round(size.height * pixelRatio);
    ctx?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    particles = createParticles(season, size);
    invalidateLayout();
  }

  function onVisibility() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = 0;
    if (!document.hidden) invalidateLayout();
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerType === "mouse") targetWind = (event.clientX / size.width - 0.5) * 30;
  }

  function onBrush(event: PointerEvent | FocusEvent) {
    if (season !== "winter" || reducedMotion) return;
    const surface = surfaces.brush(event.target);
    if (surface) {
      for (let i = 0; i < 14; i++) burst(surface.bounds.left + Math.random() * surface.bounds.width, surface.bounds.top, 1);
      invalidateLayout();
    }
  }

  const observer = new ResizeObserver(invalidateLayout);
  const mutationObserver = new MutationObserver(invalidateLayout);
  // Surface positions are read together, only when page layout changes.
  if (catchesWeather) {
    observer.observe(document.body);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", invalidateLayout, { passive: true, capture: true });
  }
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  if (!reducedMotion) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onBrush, { passive: true });
    document.addEventListener("pointerdown", onBrush, { passive: true });
    document.addEventListener("focusin", onBrush);
  }
  resize();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    mutationObserver.disconnect();
    window.removeEventListener("scroll", invalidateLayout, true);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerover", onBrush);
    document.removeEventListener("pointerdown", onBrush);
    document.removeEventListener("focusin", onBrush);
    ctx.clearRect(0, 0, size.width, size.height);
  };
}

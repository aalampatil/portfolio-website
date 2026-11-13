export type Particle = {
  x: number;
  y: number;
  radius: number;
  depth: number;
  speed: number;
  phase: number;
  rotation: number;
};

export type Burst = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  duration: number;
  radius: number;
};

export type Surface = {
  element: HTMLElement;
  bounds: DOMRect;
  snow: number[];
  visible: boolean;
};

export type SceneSize = { width: number; height: number };

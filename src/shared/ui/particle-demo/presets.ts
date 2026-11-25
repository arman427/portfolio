/** Order matters: it maps to the `uWeights[i]` slots in the vertex shader. */
export const SHAPES = ['sphere', 'wave', 'ring', 'helix', 'cube', 'galaxy'] as const;
export type ShapeName = (typeof SHAPES)[number];

export type ScenePreset = {
  shape: ShapeName;
  /** Offset from the center as a fraction of the visible viewport (−0.5…0.5). */
  x: number;
  y: number;
  scale: number;
  /** Base Euler rotation (radians). */
  rotation: [number, number, number];
  opacity: number;
  /** Continuous spin around the local Y axis (rad/s). */
  spin: number;
};

const base = { x: 0, y: 0, opacity: 1 } as const;

/** The shapes the demo walks through, each sized to fit a 16:10 frame. */
export const DEMO_SEQUENCE: ScenePreset[] = [
  { ...base, shape: 'sphere', scale: 1, rotation: [0, 0, 0], spin: 0.12 },
  { ...base, shape: 'ring', scale: 0.95, rotation: [1.15, 0, 0.18], spin: 0.08 },
  { ...base, shape: 'helix', scale: 0.62, rotation: [0, 0, 0.32], spin: 0.4 },
  { ...base, shape: 'cube', scale: 0.9, rotation: [0.55, 0.65, 0], spin: 0.15 },
  { ...base, shape: 'wave', scale: 0.52, rotation: [0.55, 0, 0], spin: 0 },
];

/** Seconds each shape holds before morphing into the next one. */
export const DEMO_HOLD = 3.6;

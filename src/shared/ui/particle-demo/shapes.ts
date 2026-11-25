const TAU = Math.PI * 2;

export type ShapeBuffers = {
  sphere: Float32Array;
  wave: Float32Array;
  ring: Float32Array;
  helix: Float32Array;
  cube: Float32Array;
  galaxy: Float32Array;
  /** x: size, y: phase, z: color mix, w: speed */
  random: Float32Array;
};

/** Deterministic PRNG so the field looks identical on every visit. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates the same number of particles for every target shape so the
 * vertex shader can blend between them.
 */
export function createShapeBuffers(count: number, seed = 1337): ShapeBuffers {
  const rand = mulberry32(seed);
  const gauss = () => {
    const u = Math.max(rand(), 1e-6);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * rand());
  };
  const inSphere = (radius: number): [number, number, number] => {
    const u = rand() * 2 - 1;
    const phi = rand() * TAU;
    const r = Math.cbrt(rand()) * radius;
    const s = Math.sqrt(1 - u * u);
    return [Math.cos(phi) * s * r, u * r, Math.sin(phi) * s * r];
  };

  const sphere = new Float32Array(count * 3);
  const wave = new Float32Array(count * 3);
  const ring = new Float32Array(count * 3);
  const helix = new Float32Array(count * 3);
  const cube = new Float32Array(count * 3);
  const galaxy = new Float32Array(count * 3);
  const random = new Float32Array(count * 4);

  const golden = Math.PI * (3 - Math.sqrt(5));
  const waveCols = Math.ceil(Math.sqrt(count * 2.2));
  const waveRows = Math.ceil(count / waveCols);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Sphere — fibonacci shell + a little dust inside
    {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const interior = rand() < 0.12;
      const radius = 1.65 * (interior ? Math.cbrt(rand()) * 0.92 : 1 + (rand() - 0.5) * 0.045);
      sphere[i3] = Math.cos(theta) * r * radius;
      sphere[i3 + 1] = y * radius;
      sphere[i3 + 2] = Math.sin(theta) * r * radius;
    }

    // Wave — wide grid plane, animated in the shader
    {
      const col = i % waveCols;
      const row = Math.floor(i / waveCols);
      const x = (col / (waveCols - 1) - 0.5) * 15.5;
      const z = (row / Math.max(waveRows - 1, 1) - 0.5) * 7.5;
      wave[i3] = x + (rand() - 0.5) * 0.04;
      wave[i3 + 1] = Math.sin(x * 0.45) * 0.22 + Math.cos(z * 0.8 + x * 0.25) * 0.16;
      wave[i3 + 2] = z + (rand() - 0.5) * 0.04;
    }

    // Ring — planetary rings around a small core
    {
      const band = rand();
      if (band < 0.12) {
        const [x, y, z] = inSphere(0.55);
        ring[i3] = x;
        ring[i3 + 1] = y;
        ring[i3 + 2] = z;
      } else {
        const angle = rand() * TAU;
        const radius = band < 0.72 ? 2.25 + gauss() * 0.2 : band < 0.92 ? 3.05 + gauss() * 0.06 : 1.35 + gauss() * 0.04;
        ring[i3] = Math.cos(angle) * radius;
        ring[i3 + 1] = gauss() * 0.045;
        ring[i3 + 2] = Math.sin(angle) * radius;
      }
    }

    // Helix — vertical double strand with rungs
    {
      const t = i / count;
      const height = 7.5;
      const radius = 0.95;
      const turns = 3.4;
      const kind = i % 3;
      if (kind < 2) {
        const y = (t - 0.5) * height;
        const angle = t * TAU * turns + kind * Math.PI;
        helix[i3] = Math.cos(angle) * radius + gauss() * 0.035;
        helix[i3 + 1] = y + gauss() * 0.035;
        helix[i3 + 2] = Math.sin(angle) * radius + gauss() * 0.035;
      } else {
        const step = 0.34;
        const y = Math.round(((t - 0.5) * height) / step) * step;
        const angle = (y / height + 0.5) * TAU * turns;
        const s = rand();
        const ax = Math.cos(angle) * radius;
        const az = Math.sin(angle) * radius;
        helix[i3] = ax + (-ax - ax) * s;
        helix[i3 + 1] = y + gauss() * 0.01;
        helix[i3 + 2] = az + (-az - az) * s;
      }
    }

    // Cube — glowing edges, gridded faces and an inner lattice
    {
      const h = 1.35;
      const pick = rand();
      const sign = () => (rand() < 0.5 ? -h : h);
      if (pick < 0.42) {
        const axis = Math.floor(rand() * 3);
        const v = (rand() * 2 - 1) * h;
        const p: [number, number, number] = [sign(), sign(), sign()];
        p[axis] = v;
        cube[i3] = p[0];
        cube[i3 + 1] = p[1];
        cube[i3 + 2] = p[2];
      } else if (pick < 0.82) {
        const axis = Math.floor(rand() * 3);
        const divisions = 6;
        const snap = (Math.round(rand() * divisions) / divisions) * 2 * h - h;
        const free = (rand() * 2 - 1) * h;
        const p: [number, number, number] = [0, 0, 0];
        p[axis] = sign();
        const others = [0, 1, 2].filter((a) => a !== axis);
        const flip = rand() < 0.5;
        p[others[0]] = flip ? snap : free;
        p[others[1]] = flip ? free : snap;
        cube[i3] = p[0];
        cube[i3 + 1] = p[1];
        cube[i3 + 2] = p[2];
      } else {
        const n = 4;
        const node = () => (Math.floor(rand() * n) / (n - 1)) * 2 * h * 0.6 - h * 0.6;
        cube[i3] = node() + gauss() * 0.02;
        cube[i3 + 1] = node() + gauss() * 0.02;
        cube[i3 + 2] = node() + gauss() * 0.02;
      }
    }

    // Galaxy — three logarithmic arms and a dense core
    {
      const arms = 3;
      const maxRadius = 4.4;
      const radius = Math.pow(rand(), 1.7) * maxRadius;
      const branch = ((i % arms) / arms) * TAU;
      const twist = radius * 1.05;
      const spread = 0.12 + radius * 0.16;
      const offset = () => Math.pow(rand(), 2.6) * (rand() < 0.5 ? -1 : 1) * spread;
      galaxy[i3] = Math.cos(branch + twist) * radius + offset();
      galaxy[i3 + 1] = offset() * 0.45;
      galaxy[i3 + 2] = Math.sin(branch + twist) * radius + offset();
    }

    const i4 = i * 4;
    random[i4] = rand();
    random[i4 + 1] = rand();
    random[i4 + 2] = rand();
    random[i4 + 3] = rand();
  }

  return { sphere, wave, ring, helix, cube, galaxy, random };
}

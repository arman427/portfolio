import * as THREE from 'three';
import { SHAPES, type ScenePreset } from './presets';
import { createShapeBuffers } from './shapes';
import { particlesFragmentShader, particlesVertexShader } from './shaders';

/** Parses #rrggbb into an sRGB vector — the shader writes colors as-is. */
function hexToVector(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255);
}

export type ParticleFrame = {
  delta: number;
  elapsed: number;
  camera: THREE.Camera;
  /** Visible size of the z = 0 plane in world units. */
  viewport: { width: number; height: number };
  pixelRatio: number;
  preset: ScenePreset;
  /** Pointer in normalized device coordinates. */
  pointer: { x: number; y: number; active: boolean };
  /** Normalized scroll velocity (−1.5…1.5). */
  velocity: number;
};

/**
 * Framework-agnostic GPU particle field. Every particle stores its position in
 * six shapes; the vertex shader blends them with `uWeights`, so morphing costs
 * nothing on the CPU. React only drives `update()` once per frame.
 */
export class ParticleField {
  readonly points: THREE.Points;
  /** Tweened from 0 to 1 when the preloader finishes. */
  readonly intro = { value: 0 };

  private readonly geometry = new THREE.BufferGeometry();
  private readonly material: THREE.ShaderMaterial;
  private readonly weights: number[] = [1, 0, 0, 0, 0, 0];
  private readonly state = {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    spin: 0,
    spinAngle: 0,
    pointerX: 0,
    pointerY: 0,
    pointerStrength: 0,
    velocity: 0,
  };
  private readonly raycaster = new THREE.Raycaster();
  private readonly plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  private readonly ndc = new THREE.Vector2();
  private readonly hit = new THREE.Vector3();
  private initialized = false;

  constructor(count: number, { size = 2.5 }: { size?: number } = {}) {
    const buffers = createShapeBuffers(count);
    this.geometry.setAttribute('position', new THREE.BufferAttribute(buffers.sphere, 3));
    this.geometry.setAttribute('aWave', new THREE.BufferAttribute(buffers.wave, 3));
    this.geometry.setAttribute('aRing', new THREE.BufferAttribute(buffers.ring, 3));
    this.geometry.setAttribute('aHelix', new THREE.BufferAttribute(buffers.helix, 3));
    this.geometry.setAttribute('aCube', new THREE.BufferAttribute(buffers.cube, 3));
    this.geometry.setAttribute('aGalaxy', new THREE.BufferAttribute(buffers.galaxy, 3));
    this.geometry.setAttribute('aRandom', new THREE.BufferAttribute(buffers.random, 4));

    this.material = new THREE.ShaderMaterial({
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: size },
        uPixelRatio: { value: 1 },
        uWeights: { value: this.weights },
        uScatter: { value: 0 },
        uIntro: { value: 0 },
        uFlow: { value: 1 },
        uMouse: { value: new THREE.Vector3(999, 999, 0) },
        uMouseStrength: { value: 0 },
        uVelocity: { value: 0 },
        uOpacity: { value: 0 },
        uColorBase: { value: hexToVector('#f2efe9') },
        uColorAccent: { value: hexToVector('#ff5a1f') },
        uColorHot: { value: hexToVector('#ffb48c') },
      },
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
  }

  setReducedMotion(reduced: boolean) {
    this.material.uniforms.uFlow.value = reduced ? 0.2 : 1;
  }

  update(frame: ParticleFrame) {
    const dt = Math.min(frame.delta, 0.1);
    const ease = (speed: number) => 1 - Math.exp(-dt * speed);
    const { preset, viewport } = frame;
    const uniforms = this.material.uniforms;
    const s = this.state;

    // Responsive scale: keep shapes proportional on any aspect ratio
    const responsive = THREE.MathUtils.clamp(Math.min(viewport.width / 9.5, viewport.height / 5.4), 0.5, 1.25);
    const target = {
      x: preset.x * viewport.width,
      y: preset.y * viewport.height,
      scale: preset.scale * responsive,
    };

    if (!this.initialized) {
      this.initialized = true;
      Object.assign(s, target, { rx: preset.rotation[0], ry: preset.rotation[1], rz: preset.rotation[2], spin: preset.spin });
      this.weights.fill(0);
      this.weights[SHAPES.indexOf(preset.shape)] = 1;
    }

    // Morph weights towards the requested shape
    const shapeIndex = SHAPES.indexOf(preset.shape);
    const morph = ease(1.8);
    let strongest = 0;
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += ((i === shapeIndex ? 1 : 0) - this.weights[i]) * morph;
      strongest = Math.max(strongest, this.weights[i]);
    }
    uniforms.uScatter.value = THREE.MathUtils.clamp((1 - strongest) * 1.5, 0, 1);

    // Transform
    const move = ease(2.1);
    s.x += (target.x - s.x) * move;
    s.y += (target.y - s.y) * move;
    s.scale += (target.scale - s.scale) * move;
    s.rx += (preset.rotation[0] - s.rx) * move;
    s.ry += (preset.rotation[1] - s.ry) * move;
    s.rz += (preset.rotation[2] - s.rz) * move;
    s.spin += (preset.spin - s.spin) * move;
    s.spinAngle += s.spin * dt;
    s.opacity += (preset.opacity - s.opacity) * ease(2.4);

    // Pointer: tilt + world-space repulsion
    const follow = ease(3.2);
    s.pointerX += (frame.pointer.x - s.pointerX) * follow;
    s.pointerY += (frame.pointer.y - s.pointerY) * follow;
    s.pointerStrength += ((frame.pointer.active ? 1 : 0) - s.pointerStrength) * ease(2);

    this.points.position.set(s.x, s.y, 0);
    this.points.scale.setScalar(s.scale);
    this.points.rotation.set(s.rx - s.pointerY * 0.12, s.ry + s.spinAngle + s.pointerX * 0.2, s.rz);

    this.ndc.set(s.pointerX, s.pointerY);
    this.raycaster.setFromCamera(this.ndc, frame.camera);
    if (this.raycaster.ray.intersectPlane(this.plane, this.hit)) {
      (uniforms.uMouse.value as THREE.Vector3).copy(this.hit);
    }

    s.velocity += (frame.velocity - s.velocity) * ease(5);

    uniforms.uTime.value = frame.elapsed;
    uniforms.uPixelRatio.value = frame.pixelRatio;
    uniforms.uOpacity.value = s.opacity;
    uniforms.uIntro.value = this.intro.value;
    uniforms.uMouseStrength.value = s.pointerStrength;
    uniforms.uVelocity.value = s.velocity;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

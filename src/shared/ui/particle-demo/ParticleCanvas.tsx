'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type RefObject } from 'react';
import { EASE, gsap, prefersReducedMotion } from '@/shared/lib/gsap';
import { ParticleField } from './particle-field';
import { DEMO_HOLD, DEMO_SEQUENCE } from './presets';

export type DemoPointer = { x: number; y: number; active: boolean };

type ParticleCanvasProps = {
  count: number;
  /** Renders frames only while the demo is on screen. */
  active: boolean;
  pointer: RefObject<DemoPointer>;
};

/** Loaded on the client only, and only once the demo is opened (see index.tsx). */
export default function ParticleCanvas({ count, active, pointer }: ParticleCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 35, near: 0.1, far: 60 }}
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: false, alpha: true, depth: false, stencil: false, powerPreference: 'high-performance' }}
    >
      <Particles count={count} pointer={pointer} />
    </Canvas>
  );
}

function Particles({ count, pointer }: Pick<ParticleCanvasProps, 'count' | 'pointer'>) {
  const scene = useThree((state) => state.scene);
  const field = useRef<ParticleField | null>(null);
  const step = useRef({ index: 0, held: 0, still: false });

  useEffect(() => {
    const instance = new ParticleField(count, { size: 2 });
    const still = prefersReducedMotion();
    instance.setReducedMotion(still);
    step.current = { index: 0, held: 0, still };
    scene.add(instance.points);
    field.current = instance;

    // The points gather into the first shape when the demo opens.
    const intro = gsap.to(instance.intro, { value: 1, duration: 1.6, ease: EASE });

    return () => {
      intro.kill();
      scene.remove(instance.points);
      instance.dispose();
      field.current = null;
    };
  }, [scene, count]);

  useFrame((state, delta) => {
    const instance = field.current;
    if (!instance) return;

    const current = step.current;
    if (!current.still) {
      current.held += Math.min(delta, 0.1);
      if (current.held > DEMO_HOLD) {
        current.held = 0;
        current.index = (current.index + 1) % DEMO_SEQUENCE.length;
      }
    }

    instance.update({
      delta,
      elapsed: state.clock.elapsedTime,
      camera: state.camera,
      viewport: state.viewport,
      pixelRatio: state.viewport.dpr,
      preset: DEMO_SEQUENCE[current.index],
      pointer: pointer.current,
      velocity: 0,
    });
  });

  return null;
}

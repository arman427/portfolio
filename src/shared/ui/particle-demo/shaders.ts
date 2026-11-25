/* Simplex 3D noise — Ian McEwan, Ashima Arts / Stefan Gustavson (MIT). */
const simplexNoise = /* glsl */ `
  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

export const particlesVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uWeights[6];
  uniform float uScatter;
  uniform float uIntro;
  uniform float uFlow;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform float uVelocity;
  uniform float uOpacity;
  uniform vec3 uColorBase;
  uniform vec3 uColorAccent;
  uniform vec3 uColorHot;

  attribute vec3 aWave;
  attribute vec3 aRing;
  attribute vec3 aHelix;
  attribute vec3 aCube;
  attribute vec3 aGalaxy;
  attribute vec4 aRandom;

  varying vec3 vColor;
  varying float vAlpha;

  ${simplexNoise}

  void main() {
    float total = uWeights[0] + uWeights[1] + uWeights[2] + uWeights[3] + uWeights[4] + uWeights[5] + 1e-5;
    vec3 target = (
      position * uWeights[0] +
      aWave * uWeights[1] +
      aRing * uWeights[2] +
      aHelix * uWeights[3] +
      aCube * uWeights[4] +
      aGalaxy * uWeights[5]
    ) / total;

    // Ambient flow field, stronger while morphing and during the intro
    float t = uTime * (0.1 + aRandom.w * 0.2) * uFlow;
    vec3 flow = vec3(
      snoise(target * 0.42 + vec3(t, 0.0, 0.0)),
      snoise(target * 0.42 + vec3(0.0, t, 13.7)),
      snoise(target * 0.42 + vec3(27.1, 0.0, t))
    );
    float energy = uScatter + (1.0 - uIntro) * 3.2;
    vec3 pos = target + flow * (0.045 + energy * 1.15);

    // Rolling swell on the wave shape
    float waveMix = uWeights[1] / total;
    pos.y += (sin(pos.x * 0.85 + uTime * 0.65) * 0.2 + cos(pos.z * 1.25 + uTime * 0.45) * 0.14) * waveMix;

    // Breathing
    pos *= 1.0 + 0.022 * sin(uTime * 0.75 + aRandom.y * 6.2831);

    vec4 world = modelMatrix * vec4(pos, 1.0);

    // Cursor repulsion on the XY plane
    vec2 diff = world.xy - uMouse.xy;
    float push = smoothstep(1.35, 0.0, length(diff)) * uMouseStrength;
    world.xy += normalize(diff + 1e-4) * push * 0.5;
    world.z += push * 0.55;

    // Scroll velocity drag
    world.y += uVelocity * (0.35 + aRandom.w) * 0.22;

    vec4 mvPosition = viewMatrix * world;
    gl_Position = projectionMatrix * mvPosition;

    float size = uSize * (0.35 + aRandom.x * aRandom.x * 1.7);
    gl_PointSize = size * uPixelRatio * (9.0 / -mvPosition.z);

    vec3 color = uColorBase;
    color = mix(color, uColorAccent, step(0.72, aRandom.z));
    color = mix(color, uColorHot, step(0.955, aRandom.z));
    vColor = color;

    float twinkle = 0.62 + 0.38 * sin(uTime * (0.7 + aRandom.w * 2.2) + aRandom.y * 6.2831);
    float depth = smoothstep(-5.5, 2.5, world.z);
    vAlpha = uOpacity * uIntro * twinkle * mix(0.22, 1.0, depth);
  }
`;

export const particlesFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float strength = pow(smoothstep(0.5, 0.0, d), 1.7);
    gl_FragColor = vec4(vColor, strength * vAlpha);
  }
`;

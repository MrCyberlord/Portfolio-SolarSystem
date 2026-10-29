// All imagery is procedural. These shaders need no textures or postprocessing.
export const pointVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  uniform float uPixelRatio;
  uniform float uScale;
  void main() {
    vColor = aColor;
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * view;
    gl_PointSize = clamp(aSize * uScale * uPixelRatio / max(1.0, -view.z), 1.0, 58.0 * uPixelRatio);
  }
`
export const pointFragment = /* glsl */ `
  varying vec3 vColor;
  uniform float uOpacity;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float glow = exp(-r * r * 6.0) * (1.0 - smoothstep(0.5, 1.0, r));
    gl_FragColor = vec4(vColor, glow * uOpacity);
  }
`
export const nebulaVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
export const nebulaFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uPhase;
  uniform float uTime;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float value = 0.0, amplitude = 0.5;
    for (int i = 0; i < OCTAVES; i++) { value += noise(p) * amplitude; p = mat2(1.6, 1.2, -1.2, 1.6) * p + 3.7; amplitude *= 0.5; }
    return value;
  }
  void main() {
    vec2 p = (vUv - 0.5) * vec2(4.8, 3.2);
    p += vec2(uPhase * 0.14, uTime * 0.014);
    float warp = fbm(p * 1.3 + vec2(0.0, uPhase * 0.08));
    float cloud = fbm(p * 2.3 + warp * 2.2);
    float band = exp(-pow(p.y + sin(p.x * 1.4) * 0.45, 2.0) * 1.5);
    float density = smoothstep(0.22, 0.83, cloud) * band;
    float veil = fbm(p * 4.0 + warp);
    vec3 color = mix(vec3(0.035, 0.10, 0.25), vec3(0.23, 0.105, 0.39), smoothstep(-1.6, 1.5, p.x));
    color += vec3(0.07, 0.19, 0.32) * pow(veil, 3.0);
    float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(0.0, 0.18, 1.0-vUv.x) * smoothstep(0.0, 0.2, vUv.y) * smoothstep(0.0, 0.2, 1.0-vUv.y);
    gl_FragColor = vec4(color, density * edge * 0.9);
  }
`

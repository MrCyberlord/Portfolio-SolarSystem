export const solarVertex = /* glsl */ `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vPosition = position;
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    vView = -view.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * view;
  }
`
export const sunFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vView;
  float hash(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7))) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }
  void main() {
    vec3 p = normalize(vPosition) * 14.0 + vec3(0.0, uTime * 0.025, 0.0);
    float cells = noise(p) * 0.65 + noise(p * 2.7) * 0.35;
    float veins = pow(1.0 - abs(cells * 2.0 - 1.0), 4.0);
    vec3 color = mix(vec3(0.78,0.20,0.025), vec3(1.0,0.76,0.22), cells);
    color += vec3(0.12,0.12,0.055) * veins;
    float facing = max(0.0,dot(normalize(vNormal),normalize(vView)));
    color *= 0.65 + 0.35 * pow(facing,0.35);
    gl_FragColor = vec4(color,1.0);
  }
`
export const atmosphereFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(vView))),3.0);
    gl_FragColor=vec4(0.2,0.5,1.0,rim*0.22);
  }
`
export const ringVertex = /* glsl */ `
  varying vec3 vPosition;
  varying vec3 vWorld;
  varying vec3 vNormal;
  void main(){ vPosition=position; vec4 world=modelMatrix*vec4(position,1.0); vWorld=world.xyz; vNormal=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*viewMatrix*world; }
`
export const ringFragment = /* glsl */ `
  varying vec3 vPosition;
  varying vec3 vWorld;
  varying vec3 vNormal;
  void main(){
    float radius=length(vPosition.xy);
    float bands=0.7+sin(radius*180.0)*0.1+sin(radius*470.0)*0.07;
    float gap=1.0-smoothstep(0.012,0.02,abs(radius-0.35));
    float light=0.3+0.7*abs(dot(normalize(vNormal),normalize(-vWorld)));
    vec3 color=mix(vec3(0.42,0.33,0.21),vec3(0.76,0.7,0.53),bands)*light;
    gl_FragColor=vec4(color, (0.68-gap*0.5)*bands);
  }
`

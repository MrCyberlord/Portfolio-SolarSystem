export const sceneQuality = {
  mobile: { dpr: 1, sphereSegments: 24, textureWidth: 128, orbitSegments: 96, stars: 260, dust: 14, nebulaOctaves: 3 },
  desktop: { dpr: 1.5, sphereSegments: 48, textureWidth: 256, orbitSegments: 160, stars: 850, dust: 45, nebulaOctaves: 5 },
} as const
export type SceneQuality = typeof sceneQuality.mobile | typeof sceneQuality.desktop
export interface Composition { distance: number; tilt: number; turn: number; elevation: number; targetY: number; nebula: number }
// A coherent system throughout: scroll changes perspective, never planetary scale.
export const compositions: Composition[] = [
  { distance: 11.8, tilt: 0.08, turn: -0.12, elevation: 7.2, targetY: 0, nebula: 0 },
  { distance: 12.5, tilt: 0.04, turn: 0.05, elevation: 8.5, targetY: 0.1, nebula: 0.8 },
  { distance: 12.1, tilt: -0.05, turn: 0.25, elevation: 9.6, targetY: 0, nebula: 1.7 },
  { distance: 12.8, tilt: 0.02, turn: 0.45, elevation: 7.4, targetY: 0.2, nebula: 2.4 },
  { distance: 11.8, tilt: 0.06, turn: 0.62, elevation: 8.1, targetY: -0.1, nebula: 3.1 },
]

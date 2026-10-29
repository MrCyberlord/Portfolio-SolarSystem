export type PlanetName = 'Mercury' | 'Venus' | 'Earth' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune'
export interface PlanetDefinition {
  name: PlanetName; radius: number; orbit: number; speed: number; phase: number; inclination: number; axis: number; spin: number
}
export const SUN_RADIUS = 0.7
export const SYSTEM_SCALE = 0.7
export const ORBIT_SPEED_MULTIPLIER = 1.1
// Deliberately non-scientific sizes/distances; separated radial envelopes keep
// bodies and Saturn's rings apart at every orbital phase and inclination.
export const planets: PlanetDefinition[] = [
  { name: 'Mercury', radius: 0.065, orbit: 1.08, speed: 0.075, phase: 0.7, inclination: 0.045, axis: 0.02, spin: 0.045 },
  { name: 'Venus', radius: 0.105, orbit: 1.47, speed: 0.058, phase: 3.3, inclination: -0.035, axis: 0.05, spin: -0.025 },
  { name: 'Earth', radius: 0.115, orbit: 1.89, speed: 0.047, phase: 5.25, inclination: 0.015, axis: 0.41, spin: 0.12 },
  { name: 'Mars', radius: 0.082, orbit: 2.25, speed: 0.038, phase: 2.4, inclination: 0.055, axis: 0.44, spin: 0.115 },
  { name: 'Jupiter', radius: 0.255, orbit: 2.88, speed: 0.025, phase: 4.3, inclination: -0.025, axis: 0.055, spin: 0.19 },
  { name: 'Saturn', radius: 0.215, orbit: 3.72, speed: 0.018, phase: 0.1, inclination: 0.035, axis: 0.47, spin: 0.16 },
  { name: 'Uranus', radius: 0.15, orbit: 4.52, speed: 0.013, phase: 2.0, inclination: -0.04, axis: 1.7, spin: -0.09 },
  { name: 'Neptune', radius: 0.145, orbit: 5.23, speed: 0.01, phase: 5.6, inclination: 0.025, axis: 0.49, spin: 0.1 },
]

export function orbitalPosition(orbit: number, phase: number): [number, number, number] {
  return [Math.cos(phase) * orbit, 0, Math.sin(phase) * orbit]
}

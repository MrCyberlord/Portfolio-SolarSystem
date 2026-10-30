import type { Camera } from 'three'

// Solve the projection for a point on the world X axis. A screen-space anchor
// stays fixed even when camera distance, elevation, and perspective change.
export function horizontalAnchor(camera: Camera, screenX: number) {
  const view = camera.matrixWorldInverse.elements
  const focal = camera.projectionMatrix.elements[0]
  return (-focal * view[12] - screenX * view[14]) / (screenX * view[2] + focal * view[0])
}

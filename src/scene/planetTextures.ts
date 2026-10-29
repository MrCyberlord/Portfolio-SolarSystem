import { DataTexture, LinearFilter, RepeatWrapping, RGBAFormat, SRGBColorSpace } from 'three'
import type { PlanetName } from './solarConfig'

function hash(x: number, y: number, z: number) {
  const value = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return value - Math.floor(value)
}
function noise(x: number, y: number, z: number) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z)
  let fx = x - ix, fy = y - iy, fz = z - iz
  fx *= fx * (3 - 2 * fx); fy *= fy * (3 - 2 * fy); fz *= fz * (3 - 2 * fz)
  const mix = (a: number, b: number, t: number) => a + (b - a) * t
  return mix(mix(mix(hash(ix, iy, iz), hash(ix + 1, iy, iz), fx), mix(hash(ix, iy + 1, iz), hash(ix + 1, iy + 1, iz), fx), fy), mix(mix(hash(ix, iy, iz + 1), hash(ix + 1, iy, iz + 1), fx), mix(hash(ix, iy + 1, iz + 1), hash(ix + 1, iy + 1, iz + 1), fx), fy), fz)
}
function fbm(x: number, y: number, z: number) {
  return noise(x, y, z) * 0.57 + noise(x * 2, y * 2, z * 2) * 0.28 + noise(x * 4, y * 4, z * 4) * 0.15
}
function blend(a: number[], b: number[], t: number) { return a.map((channel, i) => channel + (b[i] - channel) * Math.max(0, Math.min(1, t))) }

// Spherical sampling avoids a longitude seam. All artwork is generated locally;
// Earth is an ocean/land/cloud impression, not a geographic map.
export function createPlanetTexture(name: PlanetName, width: number) {
  const height = width / 2
  const data = new Uint8Array(width * height * 4)
  for (let row = 0; row < height; row++) {
    const latitude = (row / (height - 1) - 0.5) * Math.PI
    for (let col = 0; col < width; col++) {
      const longitude = col / (width - 1) * Math.PI * 2
      const x = Math.cos(latitude) * Math.cos(longitude), y = Math.sin(latitude), z = Math.cos(latitude) * Math.sin(longitude)
      const n = fbm(x * 5 + 11, y * 5 + 5, z * 5 + 3)
      let color: number[]
      if (name === 'Earth') {
        const land = fbm(x * 2.7 + 8, y * 2.7, z * 2.7 + 5)
        color = land > 0.53 ? blend([43, 83, 58], [164, 148, 97], (land - 0.53) * 4) : blend([7, 28, 66], [20, 91, 140], n)
        const cloud = Math.max(0, fbm(x * 6 + y * 2, y * 5 + 21, z * 6) - 0.56) * 3.6
        color = blend(color, [230, 238, 239], Math.max(cloud, Math.max(0, Math.abs(y) - 0.91) * 9))
      } else if (name === 'Jupiter' || name === 'Saturn') {
        const bands = Math.sin(latitude * (name === 'Jupiter' ? 38 : 48) + (n - 0.5) * 5) * 0.5 + 0.5
        color = name === 'Jupiter' ? blend([137, 90, 62], [225, 207, 170], bands * 0.75 + n * 0.25) : blend([153, 132, 91], [224, 210, 166], bands * 0.45 + n * 0.45)
        if (name === 'Jupiter') {
          const storm = Math.pow((longitude - 2.2) / 0.27, 2) + Math.pow((latitude + 0.33) / 0.12, 2)
          if (storm < 1) color = blend(color, [177, 85, 53], (1 - storm) * 0.85)
        }
      } else if (name === 'Venus') color = blend([139, 100, 49], [229, 206, 151], n * 0.8 + Math.sin(latitude * 18 + n * 4) * 0.1)
      else if (name === 'Mars') color = blend([102, 47, 31], [204, 114, 71], n)
      else if (name === 'Mercury') color = blend([73, 68, 63], [169, 155, 139], n)
      else if (name === 'Uranus') color = blend([91, 164, 178], [166, 213, 211], 0.45 + Math.sin(latitude * 24) * 0.03 + n * 0.15)
      else color = blend([21, 54, 130], [55, 109, 197], n * 0.6 + Math.sin(latitude * 27 + n * 2) * 0.1 + 0.15)
      const offset = (row * width + col) * 4
      for (let channel = 0; channel < 3; channel++) data[offset + channel] = Math.round(color[channel])
      data[offset + 3] = 255
    }
  }
  const texture = new DataTexture(data, width, height, RGBAFormat)
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = RepeatWrapping
  texture.magFilter = LinearFilter; texture.minFilter = LinearFilter
  texture.needsUpdate = true
  return texture
}

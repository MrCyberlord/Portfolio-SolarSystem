import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, DataTexture, LinearFilter, RGBAFormat, ShaderMaterial } from 'three'
import { solarVertex, sunFragment } from './solarShaders'
import { SUN_RADIUS } from './solarConfig'
import type { SceneQuality } from './config'

function createCorona() {
  const size = 64, data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const r = Math.hypot((x + 0.5) / size - 0.5, (y + 0.5) / size - 0.5) * 2
    const index = (y * size + x) * 4
    data[index] = 255; data[index + 1] = 144; data[index + 2] = 37
    data[index + 3] = Math.round(Math.max(0, 1 - r) ** 3 * 100)
  }
  const texture = new DataTexture(data, size, size, RGBAFormat)
  texture.magFilter = LinearFilter; texture.minFilter = LinearFilter; texture.needsUpdate = true
  return texture
}
export function Sun({ quality, time }: { quality: SceneQuality; time: RefObject<number> }) {
  const material = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  const corona = useMemo(() => createCorona(), [])
  useEffect(() => () => corona.dispose(), [corona])
  useFrame(() => { if (material.current) Object.assign(material.current.uniforms.uTime, { value: time.current }) })
  return <group name="sun" position={[0, 0, 0]}>
    <mesh><sphereGeometry args={[SUN_RADIUS, quality.sphereSegments, quality.sphereSegments / 2]} /><shaderMaterial ref={material} uniforms={uniforms} vertexShader={solarVertex} fragmentShader={sunFragment} toneMapped={false} /></mesh>
    <sprite scale={[4.3, 4.3, 1]}><spriteMaterial map={corona} blending={AdditiveBlending} transparent depthWrite={false} toneMapped={false} /></sprite>
  </group>
}

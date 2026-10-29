import { useEffect, useMemo, type RefObject } from 'react'
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, ShaderMaterial } from 'three'
import { seededRandom } from './random'
import { nebulaFragment, nebulaVertex, pointFragment, pointVertex } from './shaders'
import type { SceneQuality } from './config'

function createField(count: number, dust: boolean) {
  const random = seededRandom(dust ? 533 : 136)
  const positions: number[] = [], colors: number[] = [], sizes: number[] = []
  for (let i = 0; i < count; i++) {
    // Three distance strata provide depth without hundreds of scene objects.
    const layer = i % 3
    positions.push((random() - 0.5) * (24 + layer * 16), (random() - 0.5) * (24 + layer * 10), -3 - layer * 10 - random() * 8)
    const warmth = random()
    colors.push(...(warmth > 0.92 ? [0.8, 0.68, 0.63] : warmth > 0.65 ? [0.48, 0.59, 0.88] : [0.63, 0.79, 0.96]))
    sizes.push(dust ? 3 + random() * 5 : 0.45 + Math.pow(random(), 5) * 2.0)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('aColor', new Float32BufferAttribute(colors, 3))
  geometry.setAttribute('aSize', new Float32BufferAttribute(sizes, 1))
  return geometry
}

function StarField({ quality, dust = false }: { quality: SceneQuality; dust?: boolean }) {
  const geometry = useMemo(() => createField(dust ? quality.dust : quality.stars, dust), [quality, dust])
  const uniforms = useMemo(() => ({ uPixelRatio: { value: quality.dpr }, uScale: { value: dust ? 18 : 28 }, uOpacity: { value: dust ? 0.07 : 0.95 } }), [quality, dust])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <points geometry={geometry}><shaderMaterial vertexShader={pointVertex} fragmentShader={pointFragment} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending} /></points>
}

export function Cosmos({ quality, nebula }: { quality: SceneQuality; nebula: RefObject<ShaderMaterial | null> }) {
  const uniforms = useMemo(() => ({ uPhase: { value: 0 }, uTime: { value: 0 } }), [])
  return <group>
    <mesh position={[0, 0, -24]} renderOrder={-2}><planeGeometry args={[50, 38]} /><shaderMaterial ref={nebula} defines={{ OCTAVES: quality.nebulaOctaves }} vertexShader={nebulaVertex} fragmentShader={nebulaFragment} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending} /></mesh>
    <StarField quality={quality} /><StarField quality={quality} dust />
  </group>
}

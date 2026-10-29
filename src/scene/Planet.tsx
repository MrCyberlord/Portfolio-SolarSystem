import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferGeometry, DoubleSide, Group, Mesh, Vector3 } from 'three'
import { createPlanetTexture } from './planetTextures'
import { atmosphereFragment, ringFragment, ringVertex, solarVertex } from './solarShaders'
import { ORBIT_SPEED_MULTIPLIER, orbitalPosition, type PlanetDefinition } from './solarConfig'
import type { SceneQuality } from './config'

function PlanetaryOrbit({ radius, segments }: { radius: number; segments: number }) {
  const geometry = useMemo(() => new BufferGeometry().setFromPoints(Array.from({ length: segments }, (_, i) => new Vector3(Math.cos(i / segments * Math.PI * 2) * radius, 0, Math.sin(i / segments * Math.PI * 2) * radius))), [radius, segments])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <lineLoop geometry={geometry}><lineBasicMaterial color="#718399" transparent opacity={0.15} depthWrite={false} /></lineLoop>
}

export function Planet({ planet, quality, time }: { planet: PlanetDefinition; quality: SceneQuality; time: RefObject<number> }) {
  const body = useRef<Group>(null), surface = useRef<Mesh>(null)
  const texture = useMemo(() => createPlanetTexture(planet.name, quality.textureWidth), [planet.name, quality.textureWidth])
  useEffect(() => () => texture.dispose(), [texture])
  useFrame(() => {
    body.current?.position.set(...orbitalPosition(planet.orbit, planet.phase + time.current * planet.speed * ORBIT_SPEED_MULTIPLIER))
    surface.current?.rotation.set(0, time.current * planet.spin, 0)
  })
  return <group rotation={[planet.inclination, 0, 0]}>
    <PlanetaryOrbit radius={planet.orbit} segments={quality.orbitSegments} />
    <group ref={body} name={planet.name} position={orbitalPosition(planet.orbit, planet.phase)}>
      <group rotation={[0, 0, planet.axis]}>
        <mesh ref={surface}><sphereGeometry args={[planet.radius, quality.sphereSegments, quality.sphereSegments / 2]} /><meshStandardMaterial map={texture} roughness={planet.name === 'Earth' ? 0.65 : 0.95} metalness={0} /></mesh>
        {planet.name === 'Saturn' && <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[planet.radius * 1.3, planet.radius * 1.95, quality.orbitSegments]} /><shaderMaterial vertexShader={ringVertex} fragmentShader={ringFragment} transparent depthWrite={false} side={DoubleSide} /></mesh>}
        {planet.name === 'Earth' && <mesh scale={1.045}><sphereGeometry args={[planet.radius, quality.sphereSegments, quality.sphereSegments / 2]} /><shaderMaterial vertexShader={solarVertex} fragmentShader={atmosphereFragment} transparent depthWrite={false} blending={AdditiveBlending} /></mesh>}
      </group>
    </group>
  </group>
}

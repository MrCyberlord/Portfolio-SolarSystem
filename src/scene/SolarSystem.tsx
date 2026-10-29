import { forwardRef, type RefObject } from 'react'
import { Group } from 'three'
import { Sun } from './Sun'
import { Planet } from './Planet'
import { planets, SYSTEM_SCALE } from './solarConfig'
import type { SceneQuality } from './config'

export const SolarSystem = forwardRef<Group, { quality: SceneQuality; time: RefObject<number> }>(function SolarSystem({ quality, time }, ref) {
  return <group ref={ref} scale={SYSTEM_SCALE}>
    <Sun quality={quality} time={time} />
    {planets.map((planet) => <Planet key={planet.name} planet={planet} quality={quality} time={time} />)}
    {/* Sun-local light: every planet is illuminated toward the same origin. */}
    <pointLight position={[0, 0, 0]} color="#ffe0b6" intensity={2.5} decay={0} />
  </group>
})

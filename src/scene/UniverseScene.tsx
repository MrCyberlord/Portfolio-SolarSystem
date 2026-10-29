import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Group, ShaderMaterial } from 'three'
import { SceneFallback } from '../components/SceneBoundary'
import { SolarSystem } from './SolarSystem'
import { Cosmos } from './Cosmos'
import { ScrollDirector } from './ScrollDirector'
import { sceneQuality, type SceneQuality } from './config'
import { useSceneTime } from './useSceneTime'
import type { ScrollSignal } from '../hooks/usePortfolioScroll'

interface SceneProps { signal: ScrollSignal; mobile: boolean; ambientMotion: boolean; reducedMotion: boolean }

function SceneContents({ signal, mobile, ambientMotion, reducedMotion, quality }: SceneProps & { quality: SceneQuality }) {
  const sculpture = useRef<Group>(null)
  const nebula = useRef<ShaderMaterial>(null)
  const time = useSceneTime(mobile, reducedMotion)
  return <>
    <ambientLight intensity={0.2} color="#9fb9ee" />
    <Cosmos quality={quality} nebula={nebula} />
    <SolarSystem ref={sculpture} quality={quality} time={time} />
    <ScrollDirector sculpture={sculpture} nebula={nebula} signal={signal} time={time} mobile={mobile} ambientMotion={ambientMotion} reducedMotion={reducedMotion} />
  </>
}

export default function UniverseScene({ signal, mobile, ambientMotion, reducedMotion }: SceneProps) {
  const [contextLost, setContextLost] = useState(false)
  const quality = mobile ? sceneQuality.mobile : sceneQuality.desktop
  if (contextLost) return <SceneFallback />
  return <Canvas frameloop="demand" dpr={[1, quality.dpr]} camera={{ position: [0, 0.6, 9], fov: 43, near: 0.1, far: 90 }} gl={{ antialias: !mobile, alpha: true, powerPreference: 'low-power' }} fallback={<SceneFallback />} onCreated={({ gl }) => {
    gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); setContextLost(true) }, { once: true })
  }}>
    <SceneContents signal={signal} mobile={mobile} ambientMotion={ambientMotion} reducedMotion={reducedMotion} quality={quality} />
  </Canvas>
}

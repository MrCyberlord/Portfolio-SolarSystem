import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group, MathUtils, ShaderMaterial } from 'three'
import { compositions } from './config'
import { SYSTEM_SCALE } from './solarConfig'
import { horizontalAnchor } from './horizontalAnchor'
import type { ScrollSignal } from '../hooks/usePortfolioScroll'

export function ScrollDirector({ sculpture, nebula, signal, time, mobile, ambientMotion, reducedMotion }: { sculpture: RefObject<Group | null>; nebula: RefObject<ShaderMaterial | null>; signal: ScrollSignal; time: RefObject<number>; mobile: boolean; ambientMotion: boolean; reducedMotion: boolean }) {
  const { camera, invalidate, size } = useThree()
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const unsubscribe = signal.subscribe(invalidate)
    invalidate()
    return unsubscribe
  }, [signal, invalidate])
  useEffect(() => {
    if (!ambientMotion) return
    const move = (event: PointerEvent) => {
      pointer.current = { x: (event.clientX / window.innerWidth - 0.5) * 0.12, y: (event.clientY / window.innerHeight - 0.5) * 0.08 }
      invalidate()
    }
    const reset = () => { pointer.current = { x: 0, y: 0 }; invalidate() }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', reset)
    window.addEventListener('blur', reset)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
    }
  }, [ambientMotion, invalidate])
  useFrame(() => {
    const root = sculpture.current
    if (!root) return
    const progress = reducedMotion ? Math.floor(signal.getProgress()) : signal.getProgress()
    const index = Math.min(4, Math.floor(progress))
    const a = compositions[index]
    const b = compositions[Math.min(4, index + 1)]
    const t = reducedMotion ? 0 : MathUtils.smoothstep(progress - index, 0, 1)
    const mix = (key: keyof typeof a) => MathUtils.lerp(a[key], b[key], t)
    const motion = time.current * 0.036
    root.rotation.set(mix('tilt') + (ambientMotion ? pointer.current.y * 0.3 : 0), mix('turn') + (ambientMotion ? pointer.current.x * 0.3 : 0), 0)
    if (nebula.current) {
      // Shader uniforms are imperative renderer state, not React state.
      Object.assign(nebula.current.uniforms.uPhase, { value: mix('nebula') })
      Object.assign(nebula.current.uniforms.uTime, { value: motion })
    }
    // Fit the whole system into the existing visual zone, including narrow
    // tablets. Desktop framing leaves the reading column clear of the Sun.
    const aspect = size.width / Math.max(1, size.height)
    const tanHalfFov = Math.tan(43 * Math.PI / 360)
    const distance = Math.max(mix('distance') * (mobile ? 1.1 : 1), 3.85 / (tanHalfFov * aspect * (mobile ? 0.9 : 0.6)))
    const elevation = mix('elevation') * distance / mix('distance')
    const offset = mobile ? 0 : Math.hypot(distance, elevation) * tanHalfFov * aspect * 0.36
    // A restrained foreground-only adjustment fades out before Projects.
    // The camera, Canvas, and background retain their existing scale.
    const roomToEnlarge = mobile ? 1 : MathUtils.smoothstep(aspect, 1.25, 1.65)
    const homeWeight = index === 0 ? (1 - t) * roomToEnlarge : 0
    const homeScale = 1 + (mobile ? 0.15 : 0.17) * homeWeight
    // Preserve Home exactly. After entering Projects, keep a 14% smaller
    // apparent size relative to Home, compensating for each camera's distance.
    const contentWeight = MathUtils.smoothstep(progress, 1, 1.2)
    const origin = compositions[0]
    const originDistance = Math.max(origin.distance * (mobile ? 1.1 : 1), 3.85 / (tanHalfFov * aspect * (mobile ? 0.9 : 0.6)))
    const originElevation = origin.elevation * originDistance / origin.distance
    const contentScale = (1 + (mobile ? 0.15 : 0.17) * roomToEnlarge) * 0.86 * Math.hypot(distance, elevation) / Math.hypot(originDistance, originElevation)
    root.scale.setScalar(SYSTEM_SCALE * MathUtils.lerp(homeScale, contentScale, contentWeight))
    camera.position.set(-offset + (mobile ? 0 : 0.5), elevation, distance)
    camera.lookAt(-offset, mix('targetY'), 0)
    camera.updateMatrixWorld()
    // One horizontal anchor for every section. Never blend two X positions
    // at Home/Projects: only the scale and viewing angle may evolve.
    root.position.setX(horizontalAnchor(camera, mobile ? 0 : 0.42))
  })
  return null
}

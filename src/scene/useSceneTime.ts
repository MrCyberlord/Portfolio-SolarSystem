import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'

// One animation budget for foreground and background. Paused time is excluded.
export function useSceneTime(mobile: boolean, reducedMotion: boolean) {
  const time = useRef(0)
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    if (reducedMotion) { invalidate(); return }
    let timer: ReturnType<typeof setInterval> | undefined
    let previous = performance.now()
    const sync = () => {
      clearInterval(timer)
      previous = performance.now()
      if (document.hidden || !document.hasFocus()) return
      timer = setInterval(() => {
        const now = performance.now()
        time.current += Math.min((now - previous) / 1000, 0.12)
        previous = now
        invalidate()
      }, 1000 / (mobile ? 15 : 24))
    }
    sync()
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('focus', sync)
    window.addEventListener('blur', sync)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('focus', sync)
      window.removeEventListener('blur', sync)
    }
  }, [invalidate, mobile, reducedMotion])
  return time
}

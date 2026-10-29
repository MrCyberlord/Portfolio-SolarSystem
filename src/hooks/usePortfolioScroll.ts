import { useEffect, useState } from 'react'
import { sections, type Section } from '../content'

export interface ScrollSignal {
  getProgress: () => number
  update: (value: number) => void
  subscribe: (listener: () => void) => () => void
}

export function usePortfolioScroll() {
  const [signal] = useState<ScrollSignal>(() => {
    let progress = 0
    const listeners = new Set<() => void>()
    return {
      getProgress: () => progress,
      update: (value) => { progress = value; listeners.forEach((listener) => listener()) },
      subscribe: (listener) => { listeners.add(listener); return () => { listeners.delete(listener) } },
    }
  })
  const [active, setActive] = useState<Section>('home')
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const tops = sections.map(({ id }) => document.getElementById(id)?.offsetTop ?? 0)
      const position = window.scrollY + window.innerHeight * 0.23
      let index = 0
      while (index < tops.length - 1 && position >= tops[index + 1]) index++
      const length = (tops[index + 1] ?? tops[index] + window.innerHeight) - tops[index]
      signal.update(Math.min(4, index + Math.max(0, Math.min(1, (position - tops[index]) / Math.max(1, length)))))
      setActive(sections[index].id)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(schedule)
    observer.observe(document.documentElement)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('hashchange', schedule)
    // React inserts anchor targets after the initial document parse. Resolve a
    // direct hash once; later navigation and history stay entirely native.
    frame = requestAnimationFrame(() => {
      const target = sections.find(({ id }) => id === window.location.hash.slice(1))
      if (target) document.getElementById(target.id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
      measure()
    })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('hashchange', schedule)
    }
  }, [signal])
  return { signal, active }
}

import { lazy, Suspense } from 'react'
import { Navigation } from './components/Navigation'
import { Content } from './components/Content'
import { SceneBoundary, SceneFallback } from './components/SceneBoundary'
import { useMediaQuery } from './hooks/useMediaQuery'
import { usePortfolioScroll } from './hooks/usePortfolioScroll'
import './App.css'
const UniverseScene = lazy(() => import('./scene/UniverseScene'))
export default function App() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const mobile = useMediaQuery('(max-width: 767px)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const { signal, active } = usePortfolioScroll()
  return <div className="app-shell">
    <a className="skip-link" href="#content">Skip to content</a>
    <Navigation active={active} />
    <div className="universe-stage" aria-hidden="true"><SceneBoundary><Suspense fallback={<SceneFallback loading />}><UniverseScene signal={signal} mobile={mobile} ambientMotion={!mobile && finePointer && !reducedMotion} reducedMotion={reducedMotion} /></Suspense></SceneBoundary></div>
    <Content />
    <footer className="site-footer"><span>AMAN JAIN / BUILDING INTELLIGENT SYSTEMS</span><a href="#home">BACK TO TOP ↑</a><span>© 2026</span></footer>
  </div>
}

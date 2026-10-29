import { Component, type ReactNode } from 'react'
export function SceneFallback({ loading = false }: { loading?: boolean }) {
  return <div className="scene-fallback"><div className="fallback-mark" aria-hidden="true">◇</div><p>{loading ? 'An orbit is taking shape.' : 'A quieter universe.'}</p><small>{loading ? 'The portfolio is ready to explore while 3D loads.' : '3D is unavailable. Explore every section using the navigation.'}</small></div>
}
export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children }
}

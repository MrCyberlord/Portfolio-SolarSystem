import { sections, type Section } from '../content'
export function Navigation({ active }: { active: Section }) {
  return <header className="site-header"><a className="wordmark" href="#home" aria-label="Aman Jain home">aj<span> / AMAN JAIN</span></a><nav className="navigation" aria-label="Main navigation">{sections.map(({ id, label }, index) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}><span className="nav-index">0{index + 1}</span>{label}</a>)}</nav><span className="header-note">AI ENGINEER / FULL-STACK DEVELOPER</span></header>
}

import { experience, profile, projects, sections, skillGroups, type Project } from '../content'

function ProjectShowcase({ project }: { project: Project }) {
  return <article className={`project project-${project.number}`}>
    <div className="project-visual">{project.screenshot ? <img src={project.screenshot.src} alt={project.screenshot.alt} loading="lazy" width="800" height="500" /> : <><span className="project-symbol" aria-hidden="true">{project.number === '01' ? '⌘' : project.number === '02' ? '◈' : '↗'}</span><span className="visual-label">{project.name.toUpperCase()} / CONCEPT VISUAL</span></>}</div>
    <div className="project-heading"><span className="project-number">{project.number}</span><h3>{project.name}</h3><span className="placeholder-tag">AI APPLICATION</span></div>
    <p className="project-theme">{project.theme}</p><p className="body-copy">{project.description}</p>
    <ul className="project-technologies" aria-label={`${project.name} technologies and concepts`}>{project.technologies.map((item) => <li key={item}>{item}</li>)}</ul>
    <details><summary>Architecture overview</summary><p className="body-copy">{project.architecture}</p></details>
    {(project.github || project.demo) && <div className="project-links">{project.github && <a href={project.github} target="_blank" rel="noreferrer">GitHub ↗</a>}{project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live demo ↗</a>}</div>}
  </article>
}

export function Content() {
  return <main id="content" tabIndex={-1}>
    <section id="home" className="portfolio-section home-section" aria-labelledby="home-title"><div className="section-content">
      <p className="eyebrow">{sections[0].coordinate} / {profile.name.toUpperCase()}</p><p className="role-label">{profile.identity.toUpperCase()}</p>
      <h1 id="home-title">Building<br /><em>Intelligent</em><br />Systems</h1>
      <p className="intro">I'm Aman Jain. I bring 4+ years of software development experience, a foundation in frontend engineering, and a current focus on AI applications and intelligent workflows.</p>
      <div className="about-note"><span className="micro-label">FRONTEND ROOTS. AI-FOCUSED EXPLORATION.</span><p>I build across interfaces, APIs, and data, exploring how retrieval, language models, and thoughtful product engineering can work together.</p></div>
      <a className="scroll-cue" href="#projects"><span aria-hidden="true">↓</span> ENTER THE UNIVERSE</a>
    </div></section>
    <section id="projects" className="portfolio-section" aria-labelledby="projects-title"><div className="section-content">
      <p className="eyebrow">{sections[1].coordinate}</p><h2 id="projects-title">Engineering<br /><em>the next question.</em></h2><p className="intro">Research, intelligence, and everyday decisions. Three applications exploring different possibilities for AI.</p>
      <div className="project-list">{projects.map((project) => <ProjectShowcase key={project.name} project={project} />)}</div>
    </div></section>
    <section id="skills" className="portfolio-section" aria-labelledby="skills-title"><div className="section-content">
      <p className="eyebrow">{sections[2].coordinate}</p><h2 id="skills-title">From interface<br /><em>to intelligence.</em></h2><p className="intro">The technologies connecting my frontend experience with my current AI engineering work.</p>
      <div className="skills-list">{skillGroups.map((group, index) => <article key={group.title}><h3 className="micro-label">0{index + 1} / {group.title.toUpperCase()}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
    </div></section>
    <section id="experience" className="portfolio-section" aria-labelledby="experience-title"><div className="section-content">
      <p className="eyebrow">{sections[3].coordinate}</p><h2 id="experience-title">A foundation<br /><em>built over time.</em></h2><p className="intro">4+ years in software development.<br />A professional journey shaped by building.</p>
      <ol className="experience-list">{experience.map((item) => <li key={item.company} className="timeline"><span className="timeline-dot" /><p className="micro-label"><time dateTime={item.start}>{item.dates.split(' – ')[0]}</time> – <time dateTime={item.end}>{item.dates.split(' – ')[1]}</time></p><h3>{item.company}</h3></li>)}</ol>
      <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">View LinkedIn profile <span aria-hidden="true">↗</span></a>
    </div></section>
    <section id="contact" className="portfolio-section contact-section" aria-labelledby="contact-title"><div className="section-content">
      <p className="eyebrow">{sections[4].coordinate}</p><h2 id="contact-title">Good systems<br />begin with<br /><em>a conversation.</em></h2><p className="intro">Connect with me about frontend engineering, AI applications, or an interesting technical problem.</p>
      <div className="social-links"><a href={profile.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a><a href={profile.x} target="_blank" rel="noreferrer">X <span aria-hidden="true">↗</span></a></div>
      <a className="text-link" href="#home">Back to the origin <span aria-hidden="true">↑</span></a>
    </div></section>
  </main>
}

export const sections = [
  { id: 'home', label: 'Home', coordinate: '01 / ORIGIN' },
  { id: 'projects', label: 'Projects', coordinate: '02 / EXPLORATIONS' },
  { id: 'skills', label: 'Skills', coordinate: '03 / NEURAL STACK' },
  { id: 'experience', label: 'Experience', coordinate: '04 / TRAJECTORY' },
  { id: 'contact', label: 'Contact', coordinate: '05 / CONNECTION' },
] as const
export type Section = typeof sections[number]['id']
export const profile = {
  name: 'Aman Jain', identity: 'AI Engineer / Full-Stack Developer',
  github: 'https://github.com/MrCyberlord', linkedin: 'https://www.linkedin.com/in/theamanjain/', x: 'https://x.com/MrCyberlord',
}
export interface Project {
  name: string; number: string; theme: string; description: string; technologies: string[]
  screenshot?: { src: string; alt: string }; architecture: string; github?: string; demo?: string
}
export const projects: Project[] = [
  {
    name: 'ResearchLab', number: '01', theme: 'From information to understanding.',
    description: 'An AI engineering research application exploring retrieval-augmented generation, semantic search, hybrid retrieval, reranking, and evaluation.',
    technologies: ['RAG', 'Semantic search', 'Reranking', 'Evaluation'],
    architecture: 'ResearchLab explores retrieval and generation workflows, including semantic and hybrid retrieval, reranking, and evaluation. Detailed system diagrams and implementation notes will be added as the case study develops.',
  },
  {
    name: 'RivalIQ', number: '02', theme: 'Intelligence with perspective.',
    description: 'An AI-powered competitor intelligence application using FastAPI, React, MongoDB Atlas, Ollama, SerpApi, and predictive modeling.',
    technologies: ['React', 'FastAPI', 'MongoDB Atlas', 'Ollama', 'SerpApi'],
    architecture: 'The application brings together a React interface, FastAPI services, MongoDB Atlas, Ollama, SerpApi, and predictive modeling. Detailed data flows and model evaluation notes are not yet published.',
  },
  {
    name: 'Runningo', number: '03', theme: 'A more personal way forward.',
    description: 'An AI-assisted pedestrian route planning application using React, FastAPI, Leaflet, OSRM, and local LLM-based preference extraction.',
    technologies: ['React', 'FastAPI', 'Leaflet', 'OSRM', 'Local LLMs'],
    architecture: 'React and Leaflet provide the map interface, with FastAPI, OSRM, and local LLM-based preference extraction supporting route planning. A complete architecture walkthrough will follow.',
  },
]
export const skillGroups = [
  { title: 'Frontend engineering', items: ['React', 'TypeScript', 'JavaScript'] },
  { title: 'AI engineering', items: ['Python', 'RAG', 'LLMs', 'LangChain', 'LangGraph', 'Ollama', 'pgvector'] },
  { title: 'Backend & delivery', items: ['FastAPI', 'PostgreSQL', 'Docker', 'GitHub Actions'] },
]
export const experience = [
  { company: 'Anlage Infotech / Luxia AI', dates: 'January 2025 – April 2026', start: '2025-01', end: '2026-04' },
  { company: 'Magnibot Technology Solutions', dates: 'August 2022 – December 2024', start: '2022-08', end: '2024-12' },
  { company: 'Informist Data and Analytics', dates: 'December 2021 – July 2022', start: '2021-12', end: '2022-07' },
]

export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  github: string
  description: string
}

export interface Education {
  university: string
  major: string
  graduation: string
}

export interface Experience {
  company: string
  position: string
  period: string
  description: string[]
}

export interface Skill {
  category: string
  technologies: string[]
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  link?: string
  github?: string
}

export interface Language {
  name: string
  level: string
}
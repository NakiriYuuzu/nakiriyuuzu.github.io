import type { PersonalInfo, Education, Experience, Skill, Project, Language } from '@/types'

export const personalInfo: PersonalInfo = {
  name: '蔡淇鴻',
  title: 'Full-Stack Engineer',
  email: 'yuuzu@yuuzu.net',
  phone: '0958728030',
  github: 'NakiriYuuzu',
  description: 'During my university years, I participated in many Android App development, Unity, and gesture recognition projects. These experiences sparked my passion for app development, especially in user experience.'
}

export const education: Education = {
  university: 'Providence University',
  major: 'Information Communication Engineering',
  graduation: 'January 2024'
}

export const experiences: Experience[] = [
  {
    company: 'Tian Si Digital',
    position: 'Engineer',
    period: 'May 2024 - Present',
    description: [
      'Developed GIS platform and MIS management systems',
      'Implemented location-based services and data visualization',
      'Collaborated with cross-functional teams on system architecture'
    ]
  },
  {
    company: 'Hanrong Technology',
    position: 'Contract Engineer',
    period: 'July 2023 - September 2023',
    description: [
      'Integrated APIs into mobile applications',
      'Optimized application performance and user experience',
      'Worked on cross-platform development solutions'
    ]
  },
  {
    company: 'Guoxing Information',
    position: 'Intern',
    period: 'July 2022 - January 2023',
    description: [
      'Participated in order system development',
      'Upgraded .NET version for legacy systems',
      'Fixed bugs and improved system stability',
      'Learned enterprise development practices'
    ]
  }
]

export const skills: Skill[] = [
  {
    category: 'Programming Languages',
    technologies: ['Java', 'Python', 'Kotlin', 'C#', 'Swift', 'JavaScript', 'TypeScript']
  },
  {
    category: 'Backend Development',
    technologies: ['JSP Servlet', 'Django', 'Flask', 'ASP.NET Core']
  },
  {
    category: 'Frontend/Cross-Platform',
    technologies: ['Kotlin Multiplatform', 'SwiftUI', 'Vue.js', 'React.js']
  },
  {
    category: 'Tools & DevOps',
    technologies: ['Git', 'Docker', 'LAMP Stack', 'CI/CD']
  }
]

export const projects: Project[] = [
  {
    name: 'Weather App',
    description: 'Cross-platform weather application built with Kotlin Multiplatform',
    technologies: ['Kotlin Multiplatform', 'Compose', 'Weather API']
  },
  {
    name: 'Expense Tracking App',
    description: 'Personal finance management application with data visualization',
    technologies: ['Kotlin', 'Room Database', 'Charts']
  },
  {
    name: 'Diary Note App',
    description: 'Secure note-taking application with encryption features',
    technologies: ['Swift', 'SwiftUI', 'Core Data']
  },
  {
    name: 'Campus Micro-Positioning Project',
    description: 'Indoor positioning system for university campus navigation',
    technologies: ['Java', 'Android', 'Bluetooth LE', 'Machine Learning']
  },
  {
    name: 'Course Interaction App',
    description: 'Educational platform for student-teacher interaction',
    technologies: ['Vue.js', 'Node.js', 'WebSocket', 'MongoDB']
  },
  {
    name: 'AR/IoT UI Technology App',
    description: 'Augmented reality interface for IoT device control',
    technologies: ['Unity', 'ARCore', 'C#', 'IoT Protocols']
  }
]

export const languages: Language[] = [
  { name: 'Chinese', level: 'Native' },
  { name: 'English', level: 'Intermediate' },
  { name: 'Malay', level: 'Basic' },
  { name: 'Japanese', level: 'Listening' }
]
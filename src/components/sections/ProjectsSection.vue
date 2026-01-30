<template>
    <section id="projects" class="section">
        <!-- Background Decorations -->
        <div class="projects-bg" aria-hidden="true"></div>
        <div class="corner-decoration top-left" aria-hidden="true"></div>
        <div class="corner-decoration top-right" aria-hidden="true"></div>
        <div class="corner-decoration bottom-left" aria-hidden="true"></div>
        <div class="corner-decoration bottom-right" aria-hidden="true"></div>

        <div class="container mx-auto px-6 lg:px-8">
            <div class="max-w-7xl mx-auto">
                <!-- Section Header -->
                <header class="section-header">
                    <div class="section-label">Portfolio</div>
                    <h2 class="section-title">Featured Projects</h2>
                    <p class="section-description">
                        A showcase of applications and solutions I've built
                    </p>
                </header>

                <!-- Bento Grid Projects -->
                <div class="bento-projects">
                    <article
                        v-for="(project, index) in projectsWithSize"
                        :key="project.name"
                        class="bento-project-card"
                        :class="[project.size, { 'is-visible': visibleProjects.has(index) }]"
                        :style="{ '--delay': `${index * 100}ms` }"
                        @mouseenter="hoveredProject = index"
                        @mouseleave="hoveredProject = null"
                    >
                        <!-- Project Number - Gradient -->
                        <span
                            class="project-number-gradient"
                            :class="{ 'is-hovered': hoveredProject === index }"
                        >
                            {{ String(index + 1).padStart(2, '0') }}
                        </span>

                        <!-- Background Gradient on Hover -->
                        <div class="project-card-bg"></div>

                        <!-- Content -->
                        <div class="project-card-content">
                            <!-- Icon -->
                            <div class="project-icon-wrapper">
                                <component
                                    :is="getProjectIcon(project.name)"
                                    class="w-7 h-7"
                                />
                            </div>

                            <!-- Title -->
                            <h3 class="project-title">
                                {{ project.name }}
                            </h3>

                            <!-- Description -->
                            <p class="project-description">
                                {{ project.description }}
                            </p>

                            <!-- Technologies -->
                            <div class="project-tech-wrapper">
                                <div class="project-tech-list">
                                    <span
                                        v-for="tech in project.technologies.slice(0, project.size === 'size-2x2' ? 6 : 4)"
                                        :key="tech"
                                        class="project-tech-tag"
                                    >
                                        {{ tech }}
                                    </span>
                                    <span
                                        v-if="project.technologies.length > (project.size === 'size-2x2' ? 6 : 4)"
                                        class="project-tech-more"
                                    >
                                        +{{ project.technologies.length - (project.size === 'size-2x2' ? 6 : 4) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="project-actions">
                                <button
                                    v-if="project.link"
                                    class="project-action-btn"
                                    @click.stop="openLink(project.link)"
                                >
                                    <ExternalLink class="w-4 h-4" />
                                    <span>Demo</span>
                                </button>
                                <button
                                    v-if="project.github"
                                    class="project-action-btn"
                                    @click.stop="openLink(project.github)"
                                >
                                    <Github class="w-4 h-4" />
                                    <span>Code</span>
                                </button>
                                <span
                                    v-if="!project.link && !project.github"
                                    class="project-private-badge"
                                >
                                    <Lock class="w-4 h-4" />
                                    <span>Private</span>
                                </span>
                            </div>
                        </div>

                        <!-- Featured Badge for Large Cards -->
                        <div v-if="project.size === 'size-2x2'" class="featured-badge">
                            <Sparkles class="w-3 h-3" />
                            <span>Featured</span>
                        </div>
                    </article>
                </div>

                <!-- Project Stats -->
                <div class="project-stats mt-16">
                    <div
                        v-for="stat in projectStats"
                        :key="stat.label"
                        class="project-stat-item glass-card"
                    >
                        <component :is="stat.icon" class="w-6 h-6 text-accent-purple" />
                        <span class="stat-value">{{ stat.value }}</span>
                        <span class="stat-label">{{ stat.label }}</span>
                    </div>
                </div>

                <!-- CTA -->
                <div class="mt-20 text-center">
                    <div class="cta-card glass-card">
                        <div class="cta-glow"></div>
                        <h3 class="headline-3 text-foreground mb-4">
                            Interested in Collaboration?
                        </h3>
                        <p class="body-md text-muted-foreground mb-8">
                            I'm always open to discussing new opportunities and
                            interesting projects.
                        </p>
                        <button class="btn-primary btn-cta" @click="scrollToContact">
                            <Mail class="w-4 h-4" />
                            Let's Talk
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
    Cloud,
    Smartphone,
    FileText,
    MapPin,
    GraduationCap,
    Gamepad2,
    ExternalLink,
    Github,
    Lock,
    Mail,
    Sparkles,
    Code2,
    Layers,
    Zap
} from 'lucide-vue-next'
import { projects } from '@/data/portfolio'

// Hover state
const hoveredProject = ref<number | null>(null)

// Visibility for scroll animation
const visibleProjects = ref<Set<number>>(new Set())

onMounted(() => {
    // Staggered reveal animation
    projects.forEach((_, index) => {
        setTimeout(() => {
            visibleProjects.value.add(index)
            visibleProjects.value = new Set(visibleProjects.value)
        }, index * 100 + 200)
    })
})

// Assign sizes to projects for Bento Grid
interface ProjectWithSize {
    name: string
    description: string
    technologies: string[]
    link?: string
    github?: string
    size: string
}

const projectsWithSize = computed<ProjectWithSize[]>(() => {
    return projects.map((project, index) => {
        // Featured projects get larger cards
        const featuredProjects = ['Campus Micro-Positioning Project', 'Weather App']
        const size = featuredProjects.includes(project.name) ? 'size-2x2' : 'size-1x1'

        return {
            ...project,
            size
        }
    })
})

const getProjectIcon = (projectName: string) => {
    const iconMap: Record<string, any> = {
        'Weather App': Cloud,
        'Expense Tracking App': FileText,
        'Diary Note App': FileText,
        'Campus Micro-Positioning Project': MapPin,
        'Course Interaction App': GraduationCap,
        'AR/IoT UI Technology App': Gamepad2
    }
    return iconMap[projectName] || Smartphone
}

const projectStats = [
    { icon: Code2, value: '6+', label: 'Projects' },
    { icon: Layers, value: '15+', label: 'Technologies' },
    { icon: Smartphone, value: '3', label: 'Mobile Apps' },
    { icon: Zap, value: '2', label: 'Featured' }
]

const openLink = (url?: string) => {
    if (url) {
        window.open(url, '_blank')
    }
}

const scrollToContact = () => {
    const contactSection = document.getElementById('contact')
    contactSection?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
/* Projects Background */
.projects-bg {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 80% 50% at 20% 20%, rgba(201, 169, 98, 0.05) 0%, transparent 50%),
        radial-gradient(ellipse 60% 60% at 80% 80%, rgba(128, 81, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
}

/* Bento Projects Grid */
.bento-projects {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(280px, auto);
    gap: 1.5rem;
}

/* Bento Project Card */
.bento-project-card {
    position: relative;
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px) scale(0.98);
    transition: all 0.5s var(--ease-shopify);
    transition-delay: var(--delay, 0ms);
    cursor: pointer;
}

.bento-project-card.is-visible {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* Bento Sizes */
.bento-project-card.size-1x1 {
    grid-column: span 1;
    grid-row: span 1;
}

.bento-project-card.size-2x2 {
    grid-column: span 2;
    grid-row: span 2;
}

/* Push Out Pop In Animation */
.bento-project-card:hover {
    animation: push-out-pop-in 0.4s var(--ease-shopify) forwards;
    box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.2);
    border-color: var(--color-accent);
    z-index: 10;
}

.dark .bento-project-card:hover {
    box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.5);
}

/* Project Number - Gradient */
.project-number-gradient {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    font-family: var(--font-display);
    font-size: 4rem;
    font-weight: 300;
    line-height: 1;
    background: linear-gradient(135deg, var(--color-border) 0%, transparent 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.3s ease;
    z-index: 1;
}

.bento-project-card.size-2x2 .project-number-gradient {
    font-size: 6rem;
}

.project-number-gradient.is-hovered {
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-purple) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* Project Card Background */
.project-card-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        135deg,
        transparent 0%,
        rgba(201, 169, 98, 0.03) 50%,
        rgba(128, 81, 255, 0.03) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
}

.bento-project-card:hover .project-card-bg {
    opacity: 1;
}

/* Project Card Content */
.project-card-content {
    position: relative;
    z-index: 2;
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.bento-project-card.size-2x2 .project-card-content {
    padding: 2.5rem;
}

/* Project Icon */
.project-icon-wrapper {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--color-accent) 0%, rgba(201, 169, 98, 0.2) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent-foreground);
    margin-bottom: 1.5rem;
    transition: all 0.3s var(--ease-shopify);
}

.bento-project-card:hover .project-icon-wrapper {
    background: linear-gradient(135deg, var(--color-accent-purple) 0%, rgba(128, 81, 255, 0.2) 100%);
    transform: scale(1.1) rotate(-5deg);
}

/* Project Title */
.project-title {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--color-foreground);
    margin-bottom: 0.75rem;
    transition: color 0.3s ease;
}

.bento-project-card.size-2x2 .project-title {
    font-size: 2rem;
}

.bento-project-card:hover .project-title {
    color: var(--color-accent);
}

/* Project Description */
.project-description {
    font-size: 0.875rem;
    color: var(--color-muted-foreground);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    flex-grow: 1;
}

.bento-project-card.size-2x2 .project-description {
    font-size: 1rem;
}

/* Project Tech */
.project-tech-wrapper {
    margin-bottom: 1.5rem;
}

.project-tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.project-tech-tag {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    background: var(--color-secondary);
    border-radius: 9999px;
    color: var(--color-foreground);
    transition: all 0.2s ease;
}

.bento-project-card:hover .project-tech-tag {
    background: var(--color-accent-purple);
    color: var(--color-accent-purple-foreground);
}

.project-tech-more {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-muted-foreground);
}

/* Project Actions */
.project-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: auto;
}

.project-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    color: var(--color-foreground);
    transition: all var(--duration-interaction) var(--ease-shopify);
    cursor: pointer;
}

.project-action-btn:hover {
    background: var(--color-accent-purple);
    color: var(--color-accent-purple-foreground);
    border-color: var(--color-accent-purple);
    transform: translateY(-2px);
}

.project-private-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-muted-foreground);
}

/* Featured Badge */
.featured-badge {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-purple) 100%);
    border-radius: 9999px;
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: white;
}

/* Project Stats */
.project-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
}

.project-stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem;
    text-align: center;
}

.stat-value {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 500;
    color: var(--color-foreground);
}

.stat-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* CTA Card */
.cta-card {
    position: relative;
    max-width: 42rem;
    margin: 0 auto;
    padding: 3rem;
    overflow: hidden;
}

.cta-glow {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, var(--color-accent-purple) 0%, transparent 70%);
    opacity: 0.1;
    filter: blur(40px);
    pointer-events: none;
}

.btn-cta {
    position: relative;
    overflow: hidden;
}

.btn-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-purple), var(--color-accent));
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
    animation: gradient-shift 3s ease infinite;
}

.btn-cta:hover::before {
    opacity: 0.2;
}

/* Responsive */
@media (max-width: 1024px) {
    .bento-projects {
        grid-template-columns: repeat(2, 1fr);
    }

    .project-stats {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .bento-projects {
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
    }

    .bento-project-card.size-1x1,
    .bento-project-card.size-2x2 {
        grid-column: span 1;
        grid-row: span 1;
    }

    .project-stats {
        grid-template-columns: repeat(2, 1fr);
    }

    .project-number-gradient {
        font-size: 3rem;
    }

    .bento-project-card.size-2x2 .project-number-gradient {
        font-size: 3rem;
    }
}
</style>

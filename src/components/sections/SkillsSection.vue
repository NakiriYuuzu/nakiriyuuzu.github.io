<template>
    <section id="skills" class="section section-alternate">
        <!-- Background Decorations -->
        <div class="skills-bg-pattern" aria-hidden="true"></div>
        <div class="geo-shape circle geo-shape-2" aria-hidden="true"></div>
        <div class="geo-shape diamond geo-shape-3" aria-hidden="true"></div>

        <div class="container mx-auto px-6 lg:px-8">
            <div class="max-w-6xl mx-auto">
                <!-- Section Header -->
                <header class="section-header">
                    <div class="section-label">Expertise</div>
                    <h2 class="section-title">Technical Skills</h2>
                    <p class="section-description">
                        A comprehensive toolkit for building modern applications
                    </p>
                </header>

                <!-- Category Filter Pills -->
                <div class="flex flex-wrap justify-center gap-3 mb-12">
                    <button
                        class="skill-pill"
                        :class="{ active: activeCategory === null }"
                        @click="activeCategory = null"
                    >
                        <Sparkles class="w-4 h-4" />
                        <span>All Skills</span>
                    </button>
                    <button
                        v-for="skill in skills"
                        :key="skill.category"
                        class="skill-pill"
                        :class="{ active: activeCategory === skill.category }"
                        @click="activeCategory = skill.category"
                    >
                        <component :is="getCategoryIcon(skill.category)" class="w-4 h-4" />
                        <span>{{ skill.category }}</span>
                    </button>
                </div>

                <!-- Interactive Skills Matrix -->
                <div class="skills-matrix glass-card p-8 lg:p-12">
                    <div class="skills-grid">
                        <div
                            v-for="(tech, index) in filteredTechnologies"
                            :key="tech.name"
                            ref="skillItemsRef"
                            class="skill-item"
                            :class="{ 'is-visible': visibleItems.has(index) }"
                            :style="{ '--delay': `${index * 50}ms` }"
                            @mouseenter="hoveredSkill = tech"
                            @mouseleave="hoveredSkill = null"
                        >
                            <div class="skill-item-inner">
                                <span class="skill-item-name">{{ tech.name }}</span>

                                <!-- Proficiency Ring (shows on hover) -->
                                <div
                                    class="skill-proficiency-ring"
                                    :class="{ 'is-visible': hoveredSkill?.name === tech.name }"
                                >
                                    <svg viewBox="0 0 36 36" class="ring-svg">
                                        <circle
                                            class="ring-bg"
                                            cx="18"
                                            cy="18"
                                            r="15.5"
                                            fill="none"
                                            stroke-width="3"
                                        />
                                        <circle
                                            class="ring-progress"
                                            cx="18"
                                            cy="18"
                                            r="15.5"
                                            fill="none"
                                            stroke-width="3"
                                            :stroke-dasharray="`${tech.proficiency} 100`"
                                        />
                                    </svg>
                                    <span class="ring-text">{{ tech.proficiency }}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Skill Detail Tooltip -->
                    <Transition name="tooltip">
                        <div v-if="hoveredSkill" class="skill-tooltip">
                            <div class="skill-tooltip-header">
                                <component
                                    :is="getCategoryIcon(hoveredSkill.category)"
                                    class="w-5 h-5 text-accent"
                                />
                                <span class="skill-tooltip-name">{{ hoveredSkill.name }}</span>
                            </div>
                            <div class="skill-tooltip-meta">
                                <Badge variant="outline">{{ hoveredSkill.category }}</Badge>
                                <span class="skill-tooltip-level">
                                    {{ getProficiencyLabel(hoveredSkill.proficiency) }}
                                </span>
                            </div>
                        </div>
                    </Transition>
                </div>

                <!-- Development Focus - Bento Grid -->
                <div class="mt-20">
                    <h3 class="headline-3 text-center text-foreground mb-12">
                        Development Focus
                    </h3>
                    <div class="bento-grid focus-grid">
                        <div
                            v-for="(focus, index) in developmentFocus"
                            :key="focus.title"
                            class="bento-item focus-card glass-card p-8"
                            :class="focus.size"
                        >
                            <div
                                class="focus-icon-wrapper"
                                :style="{ '--accent': focus.accent }"
                            >
                                <component :is="focus.icon" class="w-8 h-8" />
                            </div>
                            <h4 class="headline-4 text-foreground mt-6 mb-3">
                                {{ focus.title }}
                            </h4>
                            <p class="body-sm text-muted-foreground">
                                {{ focus.description }}
                            </p>
                            <div v-if="focus.stats" class="focus-stats mt-6">
                                <div
                                    v-for="stat in focus.stats"
                                    :key="stat.label"
                                    class="focus-stat"
                                >
                                    <span class="focus-stat-value">{{ stat.value }}</span>
                                    <span class="focus-stat-label">{{ stat.label }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Proficiency Overview - Ring Progress -->
                <div class="mt-20 glass-card p-8 lg:p-12">
                    <h3 class="headline-3 text-center text-foreground mb-12">
                        Proficiency Overview
                    </h3>
                    <div class="proficiency-rings">
                        <div
                            v-for="proficiency in skillProficiency"
                            :key="proficiency.skill"
                            class="proficiency-ring-item"
                        >
                            <div class="ring-progress-large">
                                <svg viewBox="0 0 100 100" class="ring-svg-large">
                                    <circle
                                        class="ring-bg-large"
                                        cx="50"
                                        cy="50"
                                        r="42"
                                        fill="none"
                                        stroke-width="8"
                                    />
                                    <circle
                                        class="ring-progress-large-bar"
                                        cx="50"
                                        cy="50"
                                        r="42"
                                        fill="none"
                                        stroke-width="8"
                                        :stroke-dasharray="`${proficiency.level * 2.64} 264`"
                                    />
                                </svg>
                                <div class="ring-center">
                                    <span class="ring-value">{{ proficiency.level }}%</span>
                                </div>
                            </div>
                            <span class="proficiency-label">{{ proficiency.skill }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
    Code2,
    Database,
    Smartphone,
    Settings,
    Monitor,
    Layers,
    Zap,
    Sparkles,
    Globe,
    Server,
    Palette
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { skills } from '@/data/portfolio'
import { useScrollRevealGroup } from '@/composables/useScrollReveal'

// Active category filter
const activeCategory = ref<string | null>(null)

// Hovered skill for tooltip
const hoveredSkill = ref<Technology | null>(null)

// Skill items ref for scroll reveal
const skillItemsRef = ref<HTMLElement[]>([])

interface Technology {
    name: string
    category: string
    proficiency: number
}

// Transform skills data to flat list with proficiency
const allTechnologies = computed<Technology[]>(() => {
    const techList: Technology[] = []
    const proficiencyMap: Record<string, number> = {
        // Programming Languages
        'Kotlin': 85,
        'Java': 80,
        'TypeScript': 90,
        'JavaScript': 90,
        'Python': 75,
        'HTML/CSS': 95,
        // Backend
        'Spring Boot': 80,
        'Flask': 70,
        'Elysia.js': 85,
        'FastAPI': 75,
        'PostgreSQL': 80,
        'MongoDB': 75,
        'Redis': 70,
        // Frontend/Cross-Platform
        'Vue.js': 90,
        'Nuxt.js': 85,
        'React.js': 80,
        'Next.js': 75,
        'Jetpack Compose': 85,
        'Flutter': 70,
        'Kotlin Multiplatform': 80,
        'React Native': 70,
        'TailwindCSS': 95,
        // Tools
        'Git': 90,
        'Docker': 80,
        'CI/CD': 75,
        'Linux': 80,
        'Nginx': 75,
        'Figma': 85,
        'Android SDK': 85
    }

    skills.forEach(category => {
        category.technologies.forEach(tech => {
            techList.push({
                name: tech,
                category: category.category,
                proficiency: proficiencyMap[tech] || 70
            })
        })
    })

    return techList
})

// Filtered technologies based on active category
const filteredTechnologies = computed(() => {
    if (!activeCategory.value) return allTechnologies.value
    return allTechnologies.value.filter(t => t.category === activeCategory.value)
})

// Scroll reveal for skill items
const visibleItems = ref<Set<number>>(new Set())

onMounted(() => {
    // Staggered reveal animation
    filteredTechnologies.value.forEach((_, index) => {
        setTimeout(() => {
            visibleItems.value.add(index)
            visibleItems.value = new Set(visibleItems.value)
        }, index * 50 + 200)
    })
})

const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
        'Programming Languages': Code2,
        'Backend Development': Database,
        'Frontend/Cross-Platform': Smartphone,
        'Tools & DevOps': Settings
    }
    return iconMap[category] || Code2
}

const getProficiencyLabel = (level: number) => {
    if (level >= 90) return 'Expert'
    if (level >= 80) return 'Advanced'
    if (level >= 70) return 'Proficient'
    return 'Intermediate'
}

const developmentFocus = [
    {
        title: 'Mobile First',
        description: 'Cross-platform apps with native performance using Kotlin Multiplatform and Flutter',
        icon: Smartphone,
        accent: 'var(--color-accent-purple)',
        size: 'size-2x1',
        stats: [
            { value: '5+', label: 'Apps Built' },
            { value: '2', label: 'Platforms' }
        ]
    },
    {
        title: 'Web Apps',
        description: 'Modern responsive web applications with Vue.js and Nuxt.js',
        icon: Globe,
        accent: 'var(--color-accent)',
        size: 'size-1x1'
    },
    {
        title: 'Full Stack',
        description: 'End-to-end application development with TypeScript',
        icon: Layers,
        accent: 'var(--color-accent-purple)',
        size: 'size-1x1'
    },
    {
        title: 'Backend',
        description: 'Scalable server-side solutions with Spring Boot and FastAPI',
        icon: Server,
        accent: 'var(--color-accent)',
        size: 'size-1x1'
    },
    {
        title: 'Performance',
        description: 'Optimized and scalable solutions',
        icon: Zap,
        accent: 'var(--color-accent-purple)',
        size: 'size-1x1'
    }
]

const skillProficiency = [
    { skill: 'JavaScript / TypeScript', level: 90 },
    { skill: 'Vue.js / React.js', level: 85 },
    { skill: 'Kotlin / Java', level: 80 },
    { skill: 'Python', level: 75 },
    { skill: 'Mobile Development', level: 85 },
    { skill: 'Backend Development', level: 80 }
]
</script>

<style scoped>
/* Skills Background Pattern */
.skills-bg-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
        circle at 20% 50%,
        rgba(128, 81, 255, 0.05) 0%,
        transparent 50%
    ),
    radial-gradient(
        circle at 80% 50%,
        rgba(201, 169, 98, 0.05) 0%,
        transparent 50%
    );
    pointer-events: none;
}

/* Skills Matrix */
.skills-matrix {
    position: relative;
    min-height: 300px;
}

.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
}

/* Skill Item */
.skill-item {
    position: relative;
    opacity: 0;
    transform: translateY(10px) scale(0.95);
    transition: all 0.4s var(--ease-shopify);
    transition-delay: var(--delay, 0ms);
}

.skill-item.is-visible {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.skill-item-inner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: var(--color-secondary);
    border: 1px solid var(--color-border);
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-foreground);
    transition: all var(--duration-interaction) var(--ease-shopify);
    cursor: default;
}

.skill-item:hover .skill-item-inner {
    background: var(--color-accent-purple);
    color: var(--color-accent-purple-foreground);
    border-color: var(--color-accent-purple);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px -8px rgba(128, 81, 255, 0.4);
}

/* Proficiency Ring */
.skill-proficiency-ring {
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%) scale(0.8);
    width: 50px;
    height: 50px;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s var(--ease-shopify);
}

.skill-proficiency-ring.is-visible {
    opacity: 1;
    transform: translateX(-50%) scale(1);
}

.ring-svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
}

.ring-bg {
    stroke: var(--color-border);
}

.ring-progress {
    stroke: var(--color-accent-purple);
    stroke-linecap: round;
    transition: stroke-dasharray 0.6s ease-out;
}

.ring-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    font-weight: 700;
    color: var(--color-foreground);
}

/* Skill Tooltip */
.skill-tooltip {
    position: absolute;
    bottom: -80px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 1rem;
    min-width: 200px;
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.2);
    z-index: 10;
}

.skill-tooltip-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.skill-tooltip-name {
    font-weight: 600;
    color: var(--color-foreground);
}

.skill-tooltip-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.skill-tooltip-level {
    font-size: 0.75rem;
    color: var(--color-accent-purple);
    font-weight: 500;
}

.tooltip-enter-active,
.tooltip-leave-active {
    transition: all 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
}

/* Focus Grid */
.focus-grid {
    grid-template-columns: repeat(4, 1fr);
}

.focus-card {
    display: flex;
    flex-direction: column;
}

.focus-icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: linear-gradient(135deg, var(--accent, var(--color-accent)) 0%, transparent 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-foreground);
    opacity: 0.9;
}

.focus-stats {
    display: flex;
    gap: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
}

.focus-stat {
    display: flex;
    flex-direction: column;
}

.focus-stat-value {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--color-accent);
}

.focus-stat-label {
    font-size: 0.75rem;
    color: var(--color-muted-foreground);
}

/* Proficiency Rings */
.proficiency-rings {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 2rem;
    justify-items: center;
}

.proficiency-ring-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.ring-progress-large {
    position: relative;
    width: 100px;
    height: 100px;
}

.ring-svg-large {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
}

.ring-bg-large {
    stroke: var(--color-border);
}

.ring-progress-large-bar {
    stroke: var(--color-accent-purple);
    stroke-linecap: round;
    transition: stroke-dasharray 1s ease-out;
}

.ring-center {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ring-value {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--color-foreground);
}

.proficiency-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-muted-foreground);
    text-align: center;
    max-width: 120px;
}

/* Responsive */
@media (max-width: 1024px) {
    .focus-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .focus-grid {
        grid-template-columns: 1fr;
    }

    .proficiency-rings {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>

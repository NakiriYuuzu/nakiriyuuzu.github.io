<template>
    <section id="experience" class="section section-alternate">
        <!-- Background Decorations -->
        <div class="experience-bg" aria-hidden="true"></div>
        <div class="geo-shape diamond geo-shape-1" aria-hidden="true"></div>
        <div class="geo-shape circle geo-shape-3" aria-hidden="true"></div>

        <div class="container mx-auto px-6 lg:px-8">
            <div class="max-w-5xl mx-auto">
                <!-- Section Header -->
                <header class="section-header">
                    <div class="section-label">Journey</div>
                    <h2 class="section-title">Professional Experience</h2>
                    <p class="section-description">
                        My journey through different roles and companies
                    </p>
                </header>

                <!-- Enhanced Timeline -->
                <div
                    ref="timelineRef"
                    class="timeline-enhanced max-w-4xl mx-auto"
                >
                    <!-- Timeline Line with Animation -->
                    <div class="timeline-line">
                        <div
                            class="timeline-line-progress"
                            :style="{ height: `${timelineProgress}%` }"
                        ></div>
                    </div>

                    <!-- Timeline Items -->
                    <div
                        v-for="(experience, index) in experiences"
                        :key="experience.company"
                        ref="timelineItemsRef"
                        class="timeline-item-enhanced"
                        :class="{ 'is-visible': visibleItems.has(index) }"
                        :style="{ '--delay': `${index * 150}ms` }"
                    >
                        <!-- Timeline Node with Pulse -->
                        <div class="timeline-node" :class="{ 'is-active': visibleItems.has(index) }">
                            <div class="timeline-node-inner"></div>
                            <div class="timeline-node-pulse"></div>
                        </div>

                        <!-- Experience Card -->
                        <div class="experience-card glass-card">
                            <!-- Company Logo Placeholder -->
                            <div class="experience-logo">
                                <Briefcase class="w-6 h-6" />
                            </div>

                            <!-- Card Header -->
                            <div class="experience-header">
                                <div class="experience-date-badge">
                                    <Calendar class="w-3 h-3" />
                                    <span>{{ experience.period }}</span>
                                </div>
                                <h3 class="experience-position">
                                    {{ experience.position }}
                                </h3>
                                <div class="experience-company">
                                    <Building class="w-4 h-4" />
                                    <span>{{ experience.company }}</span>
                                </div>
                            </div>

                            <!-- Card Content -->
                            <div class="experience-content">
                                <ul class="experience-list">
                                    <li
                                        v-for="desc in experience.description"
                                        :key="desc"
                                        class="experience-item"
                                    >
                                        <ChevronRight class="w-4 h-4 text-accent-purple flex-shrink-0" />
                                        <span>{{ desc }}</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- Technologies Used (if any) -->
                            <div v-if="experienceTechs[index]" class="experience-techs">
                                <span
                                    v-for="tech in experienceTechs[index]"
                                    :key="tech"
                                    class="experience-tech-tag"
                                >
                                    {{ tech }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Key Skills Gained -->
                <div class="mt-20">
                    <h3 class="headline-3 text-center text-foreground mb-12">
                        Key Skills Gained
                    </h3>
                    <div class="skills-bento">
                        <div
                            v-for="(skill, index) in keySkills"
                            :key="skill.title"
                            class="skill-card glass-card"
                            :class="skill.size"
                        >
                            <div class="skill-icon-wrapper" :style="{ '--accent': skill.accent }">
                                <component :is="skill.icon" class="w-6 h-6" />
                            </div>
                            <h4 class="skill-title">{{ skill.title }}</h4>
                            <p class="skill-description">{{ skill.description }}</p>
                        </div>
                    </div>
                </div>

                <!-- Career Progression -->
                <div class="mt-20 career-progression glass-card">
                    <h3 class="headline-3 text-center text-foreground mb-10">
                        Career Growth
                    </h3>
                    <div class="career-stages">
                        <div
                            v-for="(stage, index) in careerStages"
                            :key="stage.stage"
                            class="career-stage"
                        >
                            <div class="stage-connector" v-if="index < careerStages.length - 1"></div>
                            <div class="stage-node">
                                <span class="stage-number">{{ stage.stage }}</span>
                            </div>
                            <div class="stage-content">
                                <h4 class="stage-title">{{ stage.title }}</h4>
                                <p class="stage-description">{{ stage.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
    ChevronRight,
    Code,
    Users,
    Lightbulb,
    Target,
    Rocket,
    Trophy,
    Calendar,
    Building,
    Briefcase
} from 'lucide-vue-next'
import { experiences } from '@/data/portfolio'

// Timeline animation
const timelineRef = ref<HTMLElement | null>(null)
const timelineItemsRef = ref<HTMLElement[]>([])
const visibleItems = ref<Set<number>>(new Set())
const timelineProgress = ref(0)

// Technologies for each experience
const experienceTechs = [
    ['Vue.js', 'TypeScript', 'Spring Boot', 'PostgreSQL'],
    ['Kotlin', 'Android', 'Jetpack Compose', 'REST API'],
    ['React', 'Node.js', 'MongoDB', 'Docker']
]

onMounted(() => {
    // Create intersection observer for timeline items
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const index = timelineItemsRef.value.indexOf(entry.target as HTMLElement)
                if (index === -1) return

                if (entry.isIntersecting) {
                    setTimeout(() => {
                        visibleItems.value.add(index)
                        visibleItems.value = new Set(visibleItems.value)

                        // Update timeline progress
                        const maxVisible = Math.max(...Array.from(visibleItems.value)) + 1
                        timelineProgress.value = (maxVisible / experiences.length) * 100
                    }, 150 * index)
                }
            })
        },
        { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    )

    // Observe all timeline items
    timelineItemsRef.value.forEach((item) => {
        if (item) observer.observe(item)
    })
})

const keySkills = [
    {
        title: 'System Architecture',
        description: 'Designing scalable and maintainable software architectures',
        icon: Code,
        accent: 'var(--color-accent)',
        size: 'size-2x1'
    },
    {
        title: 'Team Collaboration',
        description: 'Working effectively in cross-functional teams',
        icon: Users,
        accent: 'var(--color-accent-purple)',
        size: 'size-1x1'
    },
    {
        title: 'Problem Solving',
        description: 'Analyzing and implementing solutions',
        icon: Lightbulb,
        accent: 'var(--color-accent)',
        size: 'size-1x1'
    },
    {
        title: 'Project Management',
        description: 'Managing timelines and deliverables',
        icon: Target,
        accent: 'var(--color-accent-purple)',
        size: 'size-1x1'
    },
    {
        title: 'Innovation',
        description: 'Exploring and implementing new technologies',
        icon: Rocket,
        accent: 'var(--color-accent)',
        size: 'size-1x1'
    },
    {
        title: 'Quality Assurance',
        description: 'Ensuring high-quality code and testing',
        icon: Trophy,
        accent: 'var(--color-accent-purple)',
        size: 'size-2x1'
    }
]

const careerStages = [
    {
        stage: '1',
        title: 'Learning Foundation',
        description: 'Started as an intern, learning core development practices and enterprise workflows'
    },
    {
        stage: '2',
        title: 'Skill Development',
        description: 'Worked as a contract engineer, expanding technical skills and project experience'
    },
    {
        stage: '3',
        title: 'Professional Growth',
        description: 'Currently working as a full-time engineer, leading projects and mentoring others'
    }
]
</script>

<style scoped>
/* Experience Background */
.experience-bg {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 50% 50% at 20% 30%, rgba(128, 81, 255, 0.05) 0%, transparent 50%),
        radial-gradient(ellipse 60% 40% at 80% 70%, rgba(201, 169, 98, 0.05) 0%, transparent 50%);
    pointer-events: none;
}

/* Enhanced Timeline */
.timeline-enhanced {
    position: relative;
    padding-left: 3rem;
}

/* Timeline Line */
.timeline-line {
    position: absolute;
    left: 12px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--color-border);
    border-radius: 1px;
}

.timeline-line-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(180deg, var(--color-accent), var(--color-accent-purple));
    border-radius: 1px;
    transition: height 0.6s ease-out;
}

/* Timeline Item */
.timeline-item-enhanced {
    position: relative;
    padding-bottom: 3rem;
    opacity: 0;
    transform: translateX(-20px);
    transition: all 0.6s var(--ease-shopify);
    transition-delay: var(--delay, 0ms);
}

.timeline-item-enhanced.is-visible {
    opacity: 1;
    transform: translateX(0);
}

.timeline-item-enhanced:last-child {
    padding-bottom: 0;
}

/* Timeline Node */
.timeline-node {
    position: absolute;
    left: -3rem;
    top: 0;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.timeline-node-inner {
    width: 12px;
    height: 12px;
    background: var(--color-background);
    border: 2px solid var(--color-border);
    border-radius: 50%;
    transition: all 0.3s var(--ease-shopify);
    z-index: 1;
}

.timeline-node.is-active .timeline-node-inner {
    background: var(--color-accent-purple);
    border-color: var(--color-accent-purple);
    transform: scale(1.2);
}

.timeline-node-pulse {
    position: absolute;
    inset: 0;
    border: 2px solid var(--color-accent-purple);
    border-radius: 50%;
    opacity: 0;
}

.timeline-node.is-active .timeline-node-pulse {
    animation: node-pulse 2s ease-out infinite;
}

@keyframes node-pulse {
    0% {
        transform: scale(1);
        opacity: 0.8;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

/* Experience Card */
.experience-card {
    position: relative;
    padding: 2rem;
    overflow: hidden;
}

.experience-logo {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: var(--color-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent);
}

.experience-header {
    margin-bottom: 1.5rem;
    padding-right: 4rem;
}

.experience-date-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-purple) 100%);
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
    margin-bottom: 1rem;
}

.experience-position {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--color-foreground);
    margin-bottom: 0.5rem;
}

.experience-company {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    color: var(--color-muted-foreground);
}

/* Experience Content */
.experience-content {
    margin-bottom: 1.5rem;
}

.experience-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.experience-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-size: 0.9375rem;
    color: var(--color-muted-foreground);
    line-height: 1.6;
}

/* Experience Technologies */
.experience-techs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
}

.experience-tech-tag {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    background: var(--color-secondary);
    border-radius: 9999px;
    color: var(--color-foreground);
    transition: all 0.2s ease;
}

.experience-card:hover .experience-tech-tag {
    background: var(--color-accent-purple);
    color: var(--color-accent-purple-foreground);
}

/* Skills Bento */
.skills-bento {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
}

.skill-card {
    padding: 1.5rem;
}

.skill-card.size-1x1 {
    grid-column: span 1;
}

.skill-card.size-2x1 {
    grid-column: span 2;
}

.skill-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--accent, var(--color-accent)) 0%, transparent 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-foreground);
    margin-bottom: 1rem;
}

.skill-title {
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--color-foreground);
    margin-bottom: 0.5rem;
}

.skill-description {
    font-size: 0.875rem;
    color: var(--color-muted-foreground);
    line-height: 1.5;
}

/* Career Progression */
.career-progression {
    padding: 3rem;
}

.career-stages {
    display: flex;
    justify-content: space-between;
    position: relative;
}

.career-stage {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
}

.stage-connector {
    position: absolute;
    top: 32px;
    left: calc(50% + 32px);
    right: calc(-50% + 32px);
    height: 2px;
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-purple));
}

.stage-node {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-purple) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    z-index: 1;
}

.stage-number {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
}

.stage-content {
    max-width: 200px;
}

.stage-title {
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--color-foreground);
    margin-bottom: 0.5rem;
}

.stage-description {
    font-size: 0.875rem;
    color: var(--color-muted-foreground);
    line-height: 1.5;
}

/* Responsive */
@media (max-width: 1024px) {
    .skills-bento {
        grid-template-columns: repeat(2, 1fr);
    }

    .career-stages {
        flex-direction: column;
        gap: 2rem;
    }

    .stage-connector {
        display: none;
    }

    .career-stage {
        flex-direction: row;
        text-align: left;
        gap: 1.5rem;
    }

    .stage-content {
        max-width: none;
    }
}

@media (max-width: 640px) {
    .timeline-enhanced {
        padding-left: 2.5rem;
    }

    .timeline-node {
        left: -2.5rem;
    }

    .skills-bento {
        grid-template-columns: 1fr;
    }

    .skill-card.size-1x1,
    .skill-card.size-2x1 {
        grid-column: span 1;
    }

    .experience-card {
        padding: 1.5rem;
    }

    .experience-logo {
        display: none;
    }

    .experience-header {
        padding-right: 0;
    }
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
    CloudSun,
    Wallet,
    BookOpen,
    MapPin,
    Users,
    Scan,
    ArrowRight,
    ExternalLink
} from 'lucide-vue-next'
import { projects } from '@/data/portfolio'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import ScrollReveal from '@/components/animation/ScrollReveal.vue'

const projectsRef = ref<HTMLElement | null>(null)

const getProjectIcon = (projectName: string) => {
    const iconMap: Record<string, any> = {
        'Weather App': CloudSun,
        'Expense Tracking App': Wallet,
        'Diary Note App': BookOpen,
        'Campus Micro-Positioning Project': MapPin,
        'Course Interaction App': Users,
        'AR/IoT UI Technology App': Scan
    }
    return iconMap[projectName] || CloudSun
}

const getProjectGradient = (index: number) => {
    const gradients = [
        'from-green-500 to-emerald-600',
        'from-blue-500 to-cyan-600',
        'from-purple-500 to-violet-600',
        'from-orange-500 to-amber-600',
        'from-pink-500 to-rose-600',
        'from-indigo-500 to-blue-600'
    ]
    return gradients[index % gradients.length]
}

const getProjectTags = (projectName: string) => {
    const tagMap: Record<string, Array<{ label: string; class: string }>> = {
        'Weather App': [
            { label: 'Mobile', class: 'tag-blue' },
            { label: 'Multiplatform', class: 'tag-purple' }
        ],
        'Expense Tracking App': [
            { label: 'Android', class: 'tag-accent' },
            { label: 'Finance', class: 'tag-blue' }
        ],
        'Diary Note App': [
            { label: 'iOS', class: 'tag-purple' },
            { label: 'SwiftUI', class: 'tag-accent' }
        ],
        'Campus Micro-Positioning Project': [
            { label: 'IoT', class: 'tag-blue' },
            { label: 'ML', class: 'tag-purple' }
        ],
        'Course Interaction App': [
            { label: 'Web', class: 'tag-accent' },
            { label: 'Real-time', class: 'tag-blue' }
        ],
        'AR/IoT UI Technology App': [
            { label: 'AR', class: 'tag-purple' },
            { label: 'IoT', class: 'tag-accent' }
        ]
    }
    return tagMap[projectName] || [{ label: 'Project', class: 'tag' }]
}

onMounted(() => {
    if (projectsRef.value) {
        const projectCards = projectsRef.value.querySelectorAll('.project-item')

        projectCards.forEach((card, index) => {
            const isEven = index % 2 === 0
            const content = card.querySelector('.project-content')
            const image = card.querySelector('.project-image')

            // Set initial state
            gsap.set(content, {
                x: isEven ? -100 : 100,
                opacity: 0
            })
            gsap.set(image, {
                x: isEven ? 100 : -100,
                opacity: 0
            })

            // Create scroll trigger
            ScrollTrigger.create({
                trigger: card,
                start: 'top 75%',
                onEnter: () => {
                    gsap.to(content, {
                        x: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power3.out'
                    })
                    gsap.to(image, {
                        x: 0,
                        opacity: 1,
                        duration: 0.8,
                        delay: 0.1,
                        ease: 'power3.out'
                    })
                }
            })

            // Parallax effect on image
            ScrollTrigger.create({
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    if (image) {
                        gsap.set(image, {
                            y: (self.progress - 0.5) * -50
                        })
                    }
                }
            })
        })
    }
})

onUnmounted(() => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<template>
    <section id="projects" class="section py-24 section-dark">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section Header -->
            <ScrollReveal direction="up" class="text-center mb-16">
                <span class="section-badge">Portfolio</span>
                <h2 class="headline-2 mb-4 text-text-primary">
                    Featured <span class="gradient-text">Projects</span>
                </h2>
                <p class="text-text-secondary max-w-2xl mx-auto">
                    A selection of projects that showcase my skills in mobile development, web applications, and cutting-edge technologies.
                </p>
            </ScrollReveal>

            <!-- Projects Grid -->
            <div ref="projectsRef" class="space-y-32">
                <!-- Project Cards - Alternating Layout -->
                <article
                    v-for="(project, index) in projects"
                    :key="project.name"
                    class="project-item project-card"
                    :class="{ 'lg:[&>*:first-child]:order-2': index % 2 !== 0 }"
                >
                    <!-- Content Side -->
                    <div class="project-content relative">
                        <span class="project-number">{{ String(index + 1).padStart(2, '0') }}</span>
                        <div class="relative z-10">
                            <!-- Tags -->
                            <div class="flex items-center gap-2 mb-4">
                                <span
                                    v-for="tag in getProjectTags(project.name)"
                                    :key="tag.label"
                                    class="tag"
                                    :class="tag.class"
                                >
                                    {{ tag.label }}
                                </span>
                            </div>

                            <!-- Title -->
                            <h3 class="headline-3 mb-4 text-text-primary">{{ project.name }}</h3>

                            <!-- Description -->
                            <p class="text-text-secondary mb-6 text-lg leading-relaxed">{{ project.description }}</p>

                            <!-- Technologies -->
                            <div class="flex flex-wrap gap-2 mb-8">
                                <span
                                    v-for="tech in project.technologies"
                                    :key="tech"
                                    class="px-3 py-1.5 glass text-text-secondary text-sm rounded-lg"
                                >
                                    {{ tech }}
                                </span>
                            </div>

                            <!-- Action Link -->
                            <a
                                href="#"
                                class="group inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all cursor-pointer"
                            >
                                <span>View Project</span>
                                <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>

                    <!-- Image Side -->
                    <div class="project-image overflow-hidden rounded-2xl">
                        <div
                            class="project-image-gradient shadow-2xl h-full"
                            :class="`bg-gradient-to-br ${getProjectGradient(index)}`"
                        >
                            <component
                                :is="getProjectIcon(project.name)"
                                class="w-32 h-32 text-white/20"
                            />
                            <!-- Overlay Effect -->
                            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            <!-- External Link Icon -->
                            <div class="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink class="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>

<style scoped>
.project-item {
    position: relative;
}

.project-image-gradient {
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
    aspect-ratio: 4/3;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-item:hover .project-image-gradient {
    transform: scale(1.02);
}

.project-number {
    font-family: var(--font-heading);
    font-size: 8rem;
    font-weight: 700;
    opacity: 0.03;
    position: absolute;
    top: -2rem;
    left: -1rem;
    line-height: 1;
    color: var(--color-text-primary);
    pointer-events: none;
}

@media (min-width: 1024px) {
    .project-number {
        font-size: 12rem;
        top: -3rem;
        left: -2rem;
    }
}
</style>

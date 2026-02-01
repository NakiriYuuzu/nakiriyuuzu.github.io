<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Building2, GraduationCap, Briefcase, Calendar } from 'lucide-vue-next'
import { experiences, education } from '@/data/portfolio'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import ScrollReveal from '@/components/animation/ScrollReveal.vue'

const timelineRef = ref<HTMLElement | null>(null)
const timelineLineRef = ref<SVGPathElement | null>(null)

interface ExperienceItem {
    type: 'work' | 'education'
    data: {
        company: string
        position: string
        period: string
        description: string[]
    }
    color: string
    colorClass: string
    textColorClass: string
    shadowClass: string
    tags: string[]
}

const experienceItems: ExperienceItem[] = [
    {
        type: 'work',
        data: {
            company: experiences[0]?.company ?? '',
            position: experiences[0]?.position ?? '',
            period: experiences[0]?.period ?? '',
            description: experiences[0]?.description ?? []
        },
        color: 'accent',
        colorClass: 'bg-accent',
        textColorClass: 'text-accent',
        shadowClass: 'shadow-accent/20',
        tags: ['Vue.js', 'ASP.NET', 'AI']
    },
    {
        type: 'work',
        data: {
            company: experiences[1]?.company ?? '',
            position: experiences[1]?.position ?? '',
            period: experiences[1]?.period ?? '',
            description: experiences[1]?.description ?? []
        },
        color: 'purple',
        colorClass: 'bg-purple-500',
        textColorClass: 'text-purple-500',
        shadowClass: 'shadow-purple-500/20',
        tags: ['Kotlin', 'Android']
    },
    {
        type: 'work',
        data: {
            company: experiences[2]?.company ?? '',
            position: experiences[2]?.position ?? '',
            period: experiences[2]?.period ?? '',
            description: experiences[2]?.description ?? []
        },
        color: 'blue',
        colorClass: 'bg-blue-500',
        textColorClass: 'text-blue-500',
        shadowClass: 'shadow-blue-500/20',
        tags: ['Java', 'Web']
    },
    {
        type: 'education',
        data: {
            company: education.university,
            position: education.major,
            period: `Graduated ${education.graduation}`,
            description: ['Computer Science', 'Software Engineering']
        },
        color: 'orange',
        colorClass: 'bg-orange-500',
        textColorClass: 'text-orange-500',
        shadowClass: 'shadow-orange-500/20',
        tags: ['Computer Science', 'Software Engineering']
    }
]

onMounted(() => {
    if (timelineRef.value) {
        const items = timelineRef.value.querySelectorAll('.timeline-item')
        const nodes = timelineRef.value.querySelectorAll('.timeline-node')
        const cards = timelineRef.value.querySelectorAll('.experience-card')

        // Set initial states
        gsap.set(nodes, { scale: 0, opacity: 0 })
        gsap.set(cards, { y: 30, opacity: 0 })

        // Timeline line draw animation
        if (timelineLineRef.value) {
            const length = timelineLineRef.value.getTotalLength()
            gsap.set(timelineLineRef.value, {
                strokeDasharray: length,
                strokeDashoffset: length
            })

            ScrollTrigger.create({
                trigger: timelineRef.value,
                start: 'top 70%',
                end: 'bottom 30%',
                scrub: 1,
                onUpdate: (self) => {
                    if (timelineLineRef.value) {
                        gsap.set(timelineLineRef.value, {
                            strokeDashoffset: length * (1 - self.progress)
                        })
                    }
                }
            })
        }

        // Animate nodes and cards on scroll
        items.forEach((item, index) => {
            const node = nodes[index]
            const card = cards[index]
            const isEven = index % 2 === 0

            if (card) {
                gsap.set(card, {
                    x: isEven ? -50 : 50
                })
            }

            ScrollTrigger.create({
                trigger: item,
                start: 'top 75%',
                onEnter: () => {
                    // Animate node
                    if (node) {
                        gsap.to(node, {
                            scale: 1,
                            opacity: 1,
                            duration: 0.5,
                            ease: 'back.out(2)'
                        })
                    }
                    // Animate card
                    if (card) {
                        gsap.to(card, {
                            x: 0,
                            y: 0,
                            opacity: 1,
                            duration: 0.6,
                            delay: 0.1,
                            ease: 'power3.out'
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
    <section id="experience" class="section py-24 section-dark">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section Header -->
            <ScrollReveal direction="up" class="text-center mb-16">
                <span class="section-badge">Career</span>
                <h2 class="headline-2 mb-4 text-text-primary">
                    Experience & <span class="gradient-text">Education</span>
                </h2>
                <p class="text-text-secondary max-w-2xl mx-auto">
                    My professional journey in software development and academic background.
                </p>
            </ScrollReveal>

            <!-- Timeline -->
            <div ref="timelineRef" class="timeline relative">
                <!-- SVG Timeline Line -->
                <svg
                    class="absolute left-0 md:left-1/2 top-0 h-full w-2 -translate-x-1/2 hidden md:block"
                    viewBox="0 0 8 100"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="transparent" />
                            <stop offset="10%" stop-color="#22C55E" />
                            <stop offset="90%" stop-color="#3B82F6" />
                            <stop offset="100%" stop-color="transparent" />
                        </linearGradient>
                    </defs>
                    <path
                        ref="timelineLineRef"
                        d="M 4 0 L 4 100"
                        stroke="url(#timeline-gradient)"
                        stroke-width="2"
                        fill="none"
                        vector-effect="non-scaling-stroke"
                    />
                </svg>

                <!-- Mobile Timeline Line -->
                <div class="timeline-line md:hidden"></div>

                <!-- Timeline Items -->
                <div class="space-y-16 md:space-y-24">
                    <div
                        v-for="(item, index) in experienceItems"
                        :key="index"
                        class="timeline-item relative flex flex-col md:flex-row md:items-center md:gap-8"
                        :class="{ 'md:flex-row-reverse': index % 2 !== 0 }"
                    >
                        <!-- Date/Period - Mobile: Above card, Desktop: Side -->
                        <div
                            class="flex-1 mb-4 md:mb-0 pl-8 md:pl-0"
                            :class="{
                                'md:text-right': index % 2 === 0,
                                'md:text-left': index % 2 !== 0
                            }"
                        >
                            <div class="flex items-center gap-2 md:justify-end text-text-secondary">
                                <Calendar class="w-4 h-4" :class="{ 'md:order-2': index % 2 === 0 }" />
                                <span class="text-sm font-medium">{{ item.data.period }}</span>
                            </div>
                        </div>

                        <!-- Timeline Node -->
                        <div
                            class="timeline-node"
                            :class="item.colorClass"
                        >
                            <component
                                :is="item.type === 'education' ? GraduationCap : Briefcase"
                                class="w-4 h-4 text-white"
                            />
                        </div>

                        <!-- Card -->
                        <div class="flex-1 pl-8 md:pl-0">
                            <div
                                class="experience-card"
                                :class="item.shadowClass"
                            >
                                <div class="flex items-center gap-3 mb-3">
                                    <component
                                        :is="item.type === 'education' ? GraduationCap : Building2"
                                        class="w-5 h-5"
                                        :class="item.textColorClass"
                                    />
                                    <span
                                        class="text-sm font-medium"
                                        :class="item.textColorClass"
                                    >
                                        {{ item.data.company }}
                                    </span>
                                </div>
                                <h3 class="font-heading font-bold text-xl mb-3 text-text-primary">
                                    {{ item.data.position }}
                                </h3>
                                <p class="text-text-secondary text-sm mb-4">
                                    {{ Array.isArray(item.data.description) ? item.data.description[0] : item.data.description }}
                                </p>
                                <div class="flex flex-wrap gap-2">
                                    <span
                                        v-for="tag in item.tags"
                                        :key="tag"
                                        class="tag"
                                    >
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.timeline {
    position: relative;
    max-width: 56rem;
    margin: 0 auto;
}

.timeline-node {
    position: absolute;
    left: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 4px solid var(--color-bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transform: translateX(-12px);
    box-shadow: 0 0 0 4px currentColor;
}

@media (min-width: 768px) {
    .timeline-node {
        left: 50%;
        transform: translateX(-50%);
    }
}

.experience-card {
    box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.3);
}

.experience-card:hover {
    box-shadow: 0 8px 30px -5px rgba(0, 0, 0, 0.4);
}

/* SVG Timeline */
svg path {
    stroke-linecap: round;
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Code2, Server, Layout, Wrench } from 'lucide-vue-next'
import { skills } from '@/data/portfolio'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import ScrollReveal from '@/components/animation/ScrollReveal.vue'

const sectionRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const marqueeRef1 = ref<HTMLElement | null>(null)
const marqueeRef2 = ref<HTMLElement | null>(null)

const marqueeRow1 = [
    'Java', 'Python', 'Kotlin', 'C#', 'Swift',
    'JavaScript', 'TypeScript', 'Vue.js', 'React.js', 'ASP.NET Core'
]

const marqueeRow2 = [
    'Docker', 'Git', 'CI/CD', 'LAMP Stack', 'Django',
    'Flask', 'SwiftUI', 'Jetpack Compose', 'Node.js', 'MongoDB'
]

const skillCategories = computed(() => [
    {
        icon: Code2,
        title: 'Languages',
        items: skills[0]?.technologies || [],
        color: 'from-blue-500 to-blue-600',
        dotColor: 'bg-blue-500'
    },
    {
        icon: Server,
        title: 'Backend',
        items: skills[1]?.technologies || [],
        color: 'from-green-500 to-green-600',
        dotColor: 'bg-green-500'
    },
    {
        icon: Layout,
        title: 'Frontend',
        items: skills[2]?.technologies || [],
        color: 'from-purple-500 to-purple-600',
        dotColor: 'bg-purple-500'
    },
    {
        icon: Wrench,
        title: 'Tools',
        items: skills[3]?.technologies || [],
        color: 'from-orange-500 to-orange-600',
        dotColor: 'bg-orange-500'
    }
])

let scrollTrigger: ScrollTrigger | null = null

onMounted(() => {
    // Marquee speed up on scroll
    if (sectionRef.value && marqueeRef1.value && marqueeRef2.value) {
        const marquee1 = marqueeRef1.value.querySelector('.marquee-content') as HTMLElement
        const marquee2 = marqueeRef2.value.querySelector('.marquee-content') as HTMLElement

        scrollTrigger = ScrollTrigger.create({
            trigger: sectionRef.value,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
                const speed = 1 + self.progress * 2
                if (marquee1) {
                    marquee1.style.animationDuration = `${30 / speed}s`
                }
                if (marquee2) {
                    marquee2.style.animationDuration = `${30 / speed}s`
                }
            }
        })
    }

    // Stagger animation for cards
    if (cardsRef.value) {
        const cards = cardsRef.value.querySelectorAll('.skill-card')
        gsap.set(cards, { y: 60, opacity: 0 })

        ScrollTrigger.create({
            trigger: cardsRef.value,
            start: 'top 75%',
            onEnter: () => {
                gsap.to(cards, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out'
                })
            }
        })
    }
})

onUnmounted(() => {
    scrollTrigger?.kill()
})
</script>

<template>
    <section
        id="skills"
        ref="sectionRef"
        class="skills-section section py-24 overflow-hidden"
    >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section Header -->
            <ScrollReveal direction="up" class="text-center mb-16">
                <span class="section-badge">
                    Technical Skills
                </span>
                <h2 class="headline-2 mb-4 text-text-primary">
                    Skills & <span class="gradient-text">Technologies</span>
                </h2>
                <p class="text-text-secondary max-w-2xl mx-auto">
                    A comprehensive toolkit built over years of hands-on experience across multiple platforms and frameworks.
                </p>
            </ScrollReveal>
        </div>

        <!-- Skill Marquee -->
        <div class="mb-16 space-y-6">
            <!-- Row 1 - Left to Right -->
            <div ref="marqueeRef1" class="marquee">
                <div class="marquee-content">
                    <div class="flex gap-4 px-2">
                        <span
                            v-for="skill in marqueeRow1"
                            :key="skill"
                            class="skill-tag"
                        >
                            {{ skill }}
                        </span>
                    </div>
                    <div class="flex gap-4 px-2">
                        <span
                            v-for="skill in marqueeRow1"
                            :key="`${skill}-dup`"
                            class="skill-tag"
                        >
                            {{ skill }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Row 2 - Right to Left -->
            <div ref="marqueeRef2" class="marquee marquee-reverse">
                <div class="marquee-content">
                    <div class="flex gap-4 px-2">
                        <span
                            v-for="skill in marqueeRow2"
                            :key="skill"
                            class="skill-tag"
                        >
                            {{ skill }}
                        </span>
                    </div>
                    <div class="flex gap-4 px-2">
                        <span
                            v-for="skill in marqueeRow2"
                            :key="`${skill}-dup`"
                            class="skill-tag"
                        >
                            {{ skill }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Skills Grid -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref="cardsRef" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    v-for="category in skillCategories"
                    :key="category.title"
                    class="skill-card p-6"
                >
                    <div
                        class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg"
                        :class="`bg-gradient-to-br ${category.color}`"
                        :style="{ boxShadow: `0 10px 20px -5px rgba(0, 0, 0, 0.3)` }"
                    >
                        <component :is="category.icon" class="w-6 h-6 text-white" />
                    </div>
                    <h3 class="font-heading font-semibold text-xl mb-4 text-text-primary">
                        {{ category.title }}
                    </h3>
                    <ul class="space-y-3">
                        <li
                            v-for="item in category.items"
                            :key="item"
                            class="flex items-center gap-3 text-text-secondary"
                        >
                            <span
                                class="w-2 h-2 rounded-full"
                                :class="category.dotColor"
                            ></span>
                            {{ item }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* Skill card hover glow */
.skill-card:hover {
    box-shadow: 0 0 40px rgba(34, 197, 94, 0.1);
}
</style>

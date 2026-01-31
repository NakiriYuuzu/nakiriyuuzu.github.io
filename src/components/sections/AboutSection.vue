<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { GraduationCap, Languages, Rocket, Heart, Zap, Target } from 'lucide-vue-next'
import { education, languages } from '@/data/portfolio'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import ScrollReveal from '@/components/animation/ScrollReveal.vue'

const sectionRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const progressBarsVisible = ref(false)

let trigger: ScrollTrigger | null = null

const getLanguageLevel = (level: string): string => {
    const levelMap: Record<string, string> = {
        'Native': '100%',
        'Intermediate': '75%',
        'Basic': '33%',
        'Listening': '25%'
    }
    return levelMap[level] || '50%'
}

const traits = [
    { icon: Target, label: 'Problem Solver', color: 'from-green-500 to-emerald-600' },
    { icon: Heart, label: 'Team Player', color: 'from-blue-500 to-cyan-600' },
    { icon: Zap, label: 'Fast Learner', color: 'from-purple-500 to-violet-600' },
    { icon: Target, label: 'Detail-Oriented', color: 'from-orange-500 to-amber-600' }
]

onMounted(() => {
    // Animate progress bars when in view
    if (sectionRef.value) {
        trigger = ScrollTrigger.create({
            trigger: sectionRef.value,
            start: 'top 60%',
            onEnter: () => {
                progressBarsVisible.value = true
            }
        })
    }

    // Stagger animation for cards
    if (cardsRef.value) {
        const cards = cardsRef.value.querySelectorAll('.about-card')
        gsap.set(cards, { y: 50, opacity: 0 })

        ScrollTrigger.create({
            trigger: cardsRef.value,
            start: 'top 70%',
            onEnter: () => {
                gsap.to(cards, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out'
                })
            }
        })
    }
})

onUnmounted(() => {
    trigger?.kill()
})
</script>

<template>
    <section
        id="about"
        ref="sectionRef"
        class="about-section section py-24"
    >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-16 items-start">
                <!-- Left Content -->
                <ScrollReveal direction="left" :delay="0.2">
                    <div>
                        <span class="section-badge mb-6">
                            About Me
                        </span>
                        <h2 class="headline-2 mb-6 text-text-primary">
                            Passionate about creating
                            <span class="gradient-text">impactful solutions</span>
                        </h2>
                        <p class="text-text-secondary text-lg mb-8 leading-relaxed">
                            我是一位熱衷於軟體開發的全端工程師，專注於建構優雅且高效的解決方案。從行動應用到網頁平台，我享受將創意轉化為實際產品的過程。
                        </p>

                        <!-- Traits -->
                        <div class="flex flex-wrap gap-3 mb-8">
                            <div
                                v-for="trait in traits"
                                :key="trait.label"
                                class="flex items-center gap-2 px-4 py-2 glass rounded-full"
                            >
                                <div
                                    class="w-6 h-6 rounded-full flex items-center justify-center"
                                    :class="`bg-gradient-to-br ${trait.color}`"
                                >
                                    <component :is="trait.icon" class="w-3 h-3 text-white" />
                                </div>
                                <span class="text-sm text-text-primary font-medium">{{ trait.label }}</span>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                <!-- Right Content - Cards -->
                <div ref="cardsRef" class="space-y-6">
                    <!-- Education Card -->
                    <div class="about-card">
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <GraduationCap class="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 class="font-heading font-semibold text-lg text-text-primary">Education</h3>
                                <p class="text-text-secondary text-sm">{{ education.university }}</p>
                            </div>
                        </div>
                        <p class="text-text-secondary">專注於軟體工程、演算法與資料結構，並在多項專題競賽中獲得佳績。</p>
                        <div class="mt-4 flex items-center gap-2">
                            <span class="tag tag-accent">{{ education.major }}</span>
                            <span class="tag">{{ education.graduation }}</span>
                        </div>
                    </div>

                    <!-- Languages Card -->
                    <div class="about-card">
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Languages class="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 class="font-heading font-semibold text-lg text-text-primary">Languages</h3>
                                <p class="text-text-secondary text-sm">Multilingual Capabilities</p>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div v-for="language in languages" :key="language.name">
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-text-primary font-medium">{{ language.name }}</span>
                                    <span class="text-text-secondary">{{ language.level }}</span>
                                </div>
                                <div class="progress-bar">
                                    <div
                                        class="progress-bar-fill"
                                        :style="{
                                            width: progressBarsVisible ? getLanguageLevel(language.level) : '0%'
                                        }"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Motivation Card -->
                    <div class="about-card">
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <Rocket class="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 class="font-heading font-semibold text-lg text-text-primary">What Drives Me</h3>
                                <p class="text-text-secondary text-sm">Passion & Purpose</p>
                            </div>
                        </div>
                        <p class="text-text-secondary">熱愛探索新技術，持續學習並挑戰自我。相信好的軟體能夠改變世界，致力於創造有價值的數位產品。</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.progress-bar-fill {
    transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>

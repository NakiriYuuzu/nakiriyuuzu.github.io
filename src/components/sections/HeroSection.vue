<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Github, ArrowDown, Smartphone, TrendingUp, Code2 } from 'lucide-vue-next'
import { personalInfo } from '@/data/portfolio'
import { useLenisScroll } from '@/composables/useLenisScroll'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const { scrollTo } = useLenisScroll()

const scrollToProjects = () => {
    scrollTo('#projects', { duration: 1.2 })
}

// Refs for GSAP animations
const heroContentRef = ref<HTMLElement | null>(null)
const floatingCardsRef = ref<HTMLElement | null>(null)
const codeCardRef = ref<HTMLElement | null>(null)
const projectCardRef = ref<HTMLElement | null>(null)
const statsCardRef = ref<HTMLElement | null>(null)

// Mouse parallax for floating cards
const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (e: MouseEvent) => {
    const rect = floatingCardsRef.value?.getBoundingClientRect()
    if (!rect) return

    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height

    mouseX.value = x * 20
    mouseY.value = y * 20

    // Apply parallax to cards
    if (codeCardRef.value) {
        gsap.to(codeCardRef.value, {
            x: mouseX.value * 0.5,
            y: mouseY.value * 0.5,
            duration: 0.3,
            ease: 'power2.out'
        })
    }
    if (projectCardRef.value) {
        gsap.to(projectCardRef.value, {
            x: mouseX.value * 0.8,
            y: mouseY.value * 0.8,
            duration: 0.3,
            ease: 'power2.out'
        })
    }
    if (statsCardRef.value) {
        gsap.to(statsCardRef.value, {
            x: mouseX.value * 0.3,
            y: mouseY.value * 0.3,
            duration: 0.3,
            ease: 'power2.out'
        })
    }
}

let scrollTrigger: ScrollTrigger | null = null

onMounted(() => {
    // Hero content fade out on scroll
    if (heroContentRef.value) {
        scrollTrigger = ScrollTrigger.create({
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            onUpdate: (self) => {
                if (heroContentRef.value) {
                    gsap.set(heroContentRef.value, {
                        y: self.progress * -100,
                        opacity: 1 - self.progress * 1.5
                    })
                }
            }
        })
    }

    // Floating cards scatter animation on scroll
    if (floatingCardsRef.value) {
        ScrollTrigger.create({
            trigger: '#hero',
            start: '60% top',
            end: 'bottom top',
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress

                if (codeCardRef.value) {
                    gsap.set(codeCardRef.value, {
                        x: progress * 200,
                        y: progress * -150,
                        rotation: progress * 15,
                        opacity: 1 - progress
                    })
                }
                if (projectCardRef.value) {
                    gsap.set(projectCardRef.value, {
                        x: progress * -200,
                        y: progress * 100,
                        rotation: progress * -10,
                        opacity: 1 - progress
                    })
                }
                if (statsCardRef.value) {
                    gsap.set(statsCardRef.value, {
                        x: progress * 150,
                        y: progress * 200,
                        rotation: progress * 20,
                        opacity: 1 - progress
                    })
                }
            }
        })
    }

    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
    scrollTrigger?.kill()
    window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
    <section id="hero" class="hero-container relative">
        <!-- Gradient Orbs -->
        <div class="orb orb-1" aria-hidden="true"></div>
        <div class="orb orb-2" aria-hidden="true"></div>
        <div class="orb orb-3" aria-hidden="true"></div>

        <!-- Grid Pattern -->
        <div class="absolute inset-0 grid-pattern" aria-hidden="true"></div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
            <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <!-- Left Content -->
                <div ref="heroContentRef" class="hero-content">
                    <!-- Status Badge -->
                    <div
                        class="status-badge mb-6 opacity-0 animate-fade-in-up"
                        style="animation-delay: 0.2s"
                    >
                        <span>Available for new opportunities</span>
                    </div>

                    <!-- Main Heading -->
                    <h1
                        class="headline-1 leading-tight mb-6 opacity-0 animate-fade-in-up"
                        style="animation-delay: 0.4s"
                    >
                        Hi, I'm <span class="gradient-text">{{ personalInfo.name }}</span>
                        <br>
                        <span class="text-text-secondary">{{ personalInfo.title }}</span>
                    </h1>

                    <!-- Description -->
                    <p
                        class="body-lg text-text-secondary max-w-lg mb-8 opacity-0 animate-fade-in-up"
                        style="animation-delay: 0.6s"
                    >
                        Crafting elegant solutions for complex problems. Specializing in
                        <span class="text-text-primary font-medium">Kotlin</span>,
                        <span class="text-text-primary font-medium">Swift</span>,
                        <span class="text-text-primary font-medium">Vue.js</span>, and
                        <span class="text-text-primary font-medium">.NET</span>.
                    </p>

                    <!-- CTA Buttons -->
                    <div
                        class="flex flex-wrap gap-4 opacity-0 animate-fade-in-up"
                        style="animation-delay: 0.8s"
                    >
                        <button class="btn-primary" @click="scrollToProjects">
                            <span>View Projects</span>
                            <ArrowDown class="w-4 h-4" />
                        </button>
                        <a
                            :href="`https://github.com/${personalInfo.github}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="btn-secondary"
                        >
                            <Github class="w-4 h-4" />
                            <span>GitHub</span>
                        </a>
                    </div>

                    <!-- Stats -->
                    <div
                        class="flex gap-8 mt-12 pt-8 border-t border-border opacity-0 animate-fade-in-up"
                        style="animation-delay: 1s"
                    >
                        <div>
                            <div class="text-3xl font-heading font-bold gradient-text">3+</div>
                            <div class="text-sm text-text-secondary">Years Experience</div>
                        </div>
                        <div>
                            <div class="text-3xl font-heading font-bold gradient-text">20+</div>
                            <div class="text-sm text-text-secondary">Projects Completed</div>
                        </div>
                        <div>
                            <div class="text-3xl font-heading font-bold gradient-text">7</div>
                            <div class="text-sm text-text-secondary">Languages</div>
                        </div>
                    </div>
                </div>

                <!-- Right Content - Floating Cards -->
                <div
                    ref="floatingCardsRef"
                    class="relative hidden lg:block h-[600px]"
                    @mousemove="handleMouseMove"
                >
                    <!-- Code Card -->
                    <div
                        ref="codeCardRef"
                        class="floating-card absolute top-0 right-0 w-[380px] code-block p-4 shadow-2xl opacity-0 animate-fade-in-up"
                        style="animation-delay: 0.6s"
                    >
                        <div class="flex items-center gap-2 mb-4">
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div class="w-3 h-3 rounded-full bg-green-500"></div>
                            <span class="ml-2 text-text-muted text-sm">Developer.kt</span>
                        </div>
                        <div class="space-y-1 text-sm text-text-primary">
                            <div class="code-line"><span class="line-number">1</span><span><span class="code-keyword">class</span> <span class="code-type">Developer</span> {</span></div>
                            <div class="code-line"><span class="line-number">2</span><span>    <span class="code-keyword">val</span> <span class="code-variable">name</span> = <span class="code-string">"{{ personalInfo.name }}"</span></span></div>
                            <div class="code-line"><span class="line-number">3</span><span>    <span class="code-keyword">val</span> <span class="code-variable">role</span> = <span class="code-string">"Full-Stack"</span></span></div>
                            <div class="code-line"><span class="line-number">4</span><span></span></div>
                            <div class="code-line"><span class="line-number">5</span><span>    <span class="code-keyword">fun</span> <span class="code-function">skills</span>() = <span class="code-keyword">listOf</span>(</span></div>
                            <div class="code-line"><span class="line-number">6</span><span>        <span class="code-string">"Kotlin"</span>, <span class="code-string">"Swift"</span>,</span></div>
                            <div class="code-line"><span class="line-number">7</span><span>        <span class="code-string">"Vue.js"</span>, <span class="code-string">"ASP.NET"</span></span></div>
                            <div class="code-line"><span class="line-number">8</span><span>    )</span></div>
                            <div class="code-line"><span class="line-number">9</span><span>}</span></div>
                        </div>
                    </div>

                    <!-- Project Preview Card -->
                    <div
                        ref="projectCardRef"
                        class="floating-card absolute top-40 left-0 w-[320px] glass rounded-2xl shadow-2xl overflow-hidden opacity-0 animate-fade-in-up"
                        style="animation-delay: 0.8s"
                    >
                        <div class="h-40 bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
                            <Smartphone class="w-16 h-16 text-white/80" />
                        </div>
                        <div class="p-5">
                            <h4 class="font-heading font-semibold text-lg mb-2 text-text-primary">Weather App</h4>
                            <p class="text-sm text-text-secondary mb-3">Kotlin Multiplatform weather application with Material 3 design</p>
                            <div class="flex gap-2">
                                <span class="tag tag-accent">Kotlin</span>
                                <span class="tag tag-purple">Compose</span>
                            </div>
                        </div>
                    </div>

                    <!-- Stats Card -->
                    <div
                        ref="statsCardRef"
                        class="floating-card absolute bottom-20 right-20 w-[200px] glass rounded-2xl shadow-2xl p-5 opacity-0 animate-fade-in-up"
                        style="animation-delay: 1s"
                    >
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                                <TrendingUp class="w-5 h-5 text-accent" />
                            </div>
                            <span class="text-sm text-text-secondary">Commits</span>
                        </div>
                        <div class="text-3xl font-heading font-bold text-text-primary">1,234+</div>
                        <div class="text-sm text-accent mt-1">+12% this month</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scroll Indicator -->
        <div
            class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary opacity-0 animate-fade-in-up"
            style="animation-delay: 1.2s"
        >
            <span class="text-sm">Scroll to explore</span>
            <div class="w-6 h-10 rounded-full border-2 border-text-muted/30 flex justify-center pt-2">
                <div class="w-1 h-3 bg-accent rounded-full animate-bounce"></div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.hero-content {
    position: relative;
    z-index: 10;
}

/* Floating card hover effects */
.floating-card {
    transition: transform 0.3s var(--ease-out), box-shadow 0.3s ease-out;
    will-change: transform;
}

.floating-card:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Mobile styles */
@media (max-width: 640px) {
    .hero-container {
        min-height: auto;
        padding-top: 6rem;
        padding-bottom: 4rem;
    }
}
</style>

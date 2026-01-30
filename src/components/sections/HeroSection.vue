<template>
    <section class="hero-container relative bg-background">
        <!-- Background Effects -->
        <div class="hero-bg" aria-hidden="true"></div>
        <div class="grid-bg" aria-hidden="true"></div>
        <div class="spotlight spotlight-enhanced" aria-hidden="true"></div>
        <div class="noise-overlay" aria-hidden="true"></div>

        <!-- Floating Orbs - Enhanced -->
        <div class="orb orb-1 orb-enhanced" aria-hidden="true"></div>
        <div class="orb orb-2 orb-enhanced" aria-hidden="true"></div>
        <div class="orb orb-3 orb-enhanced" aria-hidden="true"></div>

        <!-- Glow Lines -->
        <div class="glow-line glow-line-1" aria-hidden="true"></div>
        <div class="glow-line glow-line-2" aria-hidden="true"></div>
        <div class="glow-line glow-line-3" aria-hidden="true"></div>
        <div class="glow-line-v glow-line-v-1" aria-hidden="true"></div>
        <div class="glow-line-v glow-line-v-2" aria-hidden="true"></div>

        <!-- Particles -->
        <div class="particles" aria-hidden="true">
            <div v-for="n in 15" :key="n" class="particle"></div>
        </div>

        <!-- Renaissance Decorative Lines -->
        <div class="renaissance-lines" aria-hidden="true">
            <div class="horizontal-line top"></div>
            <div class="horizontal-line bottom"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 container mx-auto px-6 lg:px-8">
            <div class="hero-title-wrapper">
                <!-- Role Badge -->
                <div
                    class="hero-role opacity-0 animate-fade-in-up"
                    style="animation-delay: 0.2s"
                >
                    {{ personalInfo.title }}
                </div>

                <!-- Main Title with Text Reveal Animation -->
                <h1
                    ref="titleRef"
                    class="hero-title-mega mt-8 opacity-0"
                    :class="{ 'animate-text-reveal opacity-100': showTitle }"
                    style="animation-delay: 0.4s"
                >
                    {{ personalInfo.name }}
                </h1>

                <!-- Subtitle with Typewriter Effect -->
                <p class="hero-subtitle-typewriter mt-4">
                    <span class="typewriter-text">{{ displayText }}</span>
                    <span
                        class="typewriter-cursor"
                        :class="{ 'animate-cursor-blink': !isTyping }"
                    >|</span>
                </p>

                <!-- Description -->
                <p
                    class="body-lg text-muted-foreground max-w-2xl mx-auto mt-8 text-center opacity-0 animate-fade-in-up"
                    style="animation-delay: 0.8s"
                >
                    {{ personalInfo.description }}
                </p>

                <!-- CTA Buttons -->
                <div
                    class="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 opacity-0 animate-fade-in-up"
                    style="animation-delay: 1s"
                >
                    <button class="btn-primary btn-glow" @click="scrollToContact">
                        <Mail class="w-4 h-4" />
                        Get In Touch
                    </button>

                    <button class="btn-secondary" @click="openGithub">
                        <Github class="w-4 h-4" />
                        View GitHub
                    </button>
                </div>

                <!-- Social Links -->
                <div
                    class="flex justify-center gap-4 mt-12 opacity-0 animate-fade-in-up"
                    style="animation-delay: 1.2s"
                >
                    <a
                        :href="`mailto:${personalInfo.email}`"
                        class="btn-icon btn-icon-hover"
                        aria-label="Email"
                    >
                        <Mail class="w-4 h-4" />
                    </a>
                    <a
                        :href="`https://github.com/${personalInfo.github}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn-icon btn-icon-hover"
                        aria-label="GitHub"
                    >
                        <Github class="w-4 h-4" />
                    </a>
                    <a
                        :href="`tel:${personalInfo.phone}`"
                        class="btn-icon btn-icon-hover"
                        aria-label="Phone"
                    >
                        <Phone class="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>

        <!-- Section Preview Tags -->
        <div
            class="section-preview opacity-0 animate-fade-in-up"
            style="animation-delay: 1.4s"
        >
            <div class="section-preview-scroll">
                <button
                    v-for="section in sections"
                    :key="section.id"
                    class="section-preview-tag"
                    @click="scrollToSection(section.id)"
                >
                    <component :is="section.icon" class="w-4 h-4" />
                    <span>{{ section.label }}</span>
                </button>
            </div>
        </div>

        <!-- Scroll Indicator -->
        <div
            class="scroll-indicator opacity-0 animate-fade-in-up"
            style="animation-delay: 1.5s"
        >
            <span>Scroll</span>
            <div class="scroll-line"></div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, markRaw, type Component } from 'vue'
import { Mail, Github, Phone, User, Briefcase, FolderGit2, Code2, MessageSquare } from 'lucide-vue-next'
import { personalInfo } from '@/data/portfolio'
import { useTypewriter } from '@/composables/useTypewriter'

// Typewriter effect for subtitle
const subtitles = ['NakiriYuuzu', 'Full Stack Developer', 'UI/UX Enthusiast']
const currentSubtitleIndex = ref(0)
const currentSubtitle = ref(subtitles[0])

const { displayText, isTyping, isComplete } = useTypewriter(currentSubtitle, {
    speed: 100,
    startDelay: 800,
    showCursor: false,
    loop: false
})

// Cycle through subtitles
let subtitleTimeout: ReturnType<typeof setTimeout> | null = null

const cycleSubtitle = () => {
    if (subtitleTimeout) clearTimeout(subtitleTimeout)

    subtitleTimeout = setTimeout(() => {
        currentSubtitleIndex.value = (currentSubtitleIndex.value + 1) % subtitles.length
        currentSubtitle.value = subtitles[currentSubtitleIndex.value]
        cycleSubtitle()
    }, 4000)
}

// Title animation trigger
const showTitle = ref(false)
const titleRef = ref<HTMLElement | null>(null)

onMounted(() => {
    setTimeout(() => {
        showTitle.value = true
    }, 400)

    cycleSubtitle()
})

// Section navigation
interface SectionInfo {
    id: string
    label: string
    icon: Component
}

const sections: SectionInfo[] = [
    { id: 'about', label: 'About', icon: markRaw(User) },
    { id: 'experience', label: 'Experience', icon: markRaw(Briefcase) },
    { id: 'projects', label: 'Projects', icon: markRaw(FolderGit2) },
    { id: 'skills', label: 'Skills', icon: markRaw(Code2) },
    { id: 'contact', label: 'Contact', icon: markRaw(MessageSquare) }
]

const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToContact = () => {
    scrollToSection('contact')
}

const openGithub = () => {
    window.open(`https://github.com/${personalInfo.github}`, '_blank')
}
</script>

<style scoped>
/* Enhanced Hero Title - Super Large */
.hero-title-mega {
    font-family: var(--font-display);
    font-size: clamp(5rem, 15vw, 12rem);
    font-weight: 400;
    letter-spacing: -0.04em;
    line-height: 0.85;
    background: linear-gradient(
        135deg,
        var(--color-foreground) 0%,
        var(--color-foreground) 30%,
        var(--color-accent) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0;
}

.hero-title-mega.animate-text-reveal {
    animation: text-reveal 1.2s ease-out forwards;
}

/* Typewriter Subtitle */
.hero-subtitle-typewriter {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 300;
    font-style: italic;
    letter-spacing: 0.02em;
    color: var(--color-muted-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-height: 1.5em;
}

.typewriter-text {
    color: var(--color-accent-purple);
}

.typewriter-cursor {
    color: var(--color-accent-purple);
    font-weight: 400;
    margin-left: 2px;
}

/* Enhanced Orbs */
.orb-enhanced {
    opacity: 0.25;
}

.orb-enhanced.orb-1 {
    width: 500px;
    height: 500px;
    filter: blur(100px);
}

.orb-enhanced.orb-2 {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-purple));
}

/* Enhanced Spotlight */
.spotlight-enhanced {
    background: radial-gradient(
        ellipse 60% 40% at 50% 0%,
        rgba(201, 169, 98, 0.2) 0%,
        transparent 60%
    );
}

.dark .spotlight-enhanced {
    background: radial-gradient(
        ellipse 60% 40% at 50% 0%,
        rgba(212, 183, 106, 0.12) 0%,
        transparent 60%
    );
}

/* Button Glow Effect */
.btn-glow {
    position: relative;
    overflow: hidden;
}

.btn-glow::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-purple), var(--color-accent));
    background-size: 200% 100%;
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
    animation: gradient-shift 3s ease infinite;
}

.btn-glow:hover::before {
    opacity: 1;
}

/* Icon Button Hover */
.btn-icon-hover {
    transition: all var(--duration-interaction) var(--ease-shopify);
}

.btn-icon-hover:hover {
    background: var(--color-accent-purple);
    color: var(--color-accent-purple-foreground);
    border-color: var(--color-accent-purple);
    transform: translateY(-3px);
}

/* Section Preview Tags */
.section-preview {
    position: absolute;
    bottom: 6rem;
    left: 0;
    right: 0;
    overflow: hidden;
}

.section-preview-scroll {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    padding: 0 1.5rem;
    flex-wrap: wrap;
}

.section-preview-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--color-secondary);
    border: 1px solid var(--color-border);
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-muted-foreground);
    transition: all var(--duration-interaction) var(--ease-shopify);
    cursor: pointer;
}

.section-preview-tag:hover {
    background: var(--color-accent-purple);
    color: var(--color-accent-purple-foreground);
    border-color: var(--color-accent-purple);
    transform: translateY(-2px);
}

@media (max-width: 640px) {
    .section-preview {
        bottom: 5rem;
    }

    .section-preview-scroll {
        justify-content: flex-start;
        flex-wrap: nowrap;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .section-preview-scroll::-webkit-scrollbar {
        display: none;
    }

    .section-preview-tag {
        flex-shrink: 0;
        scroll-snap-align: start;
    }
}
</style>

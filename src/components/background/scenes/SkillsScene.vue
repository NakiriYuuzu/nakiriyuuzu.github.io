<script setup lang="ts">
import { computed } from 'vue'
import { useScrollStore } from '@/stores/scrollStore'
import { storeToRefs } from 'pinia'
import { useSceneManager } from '@/composables/useSceneManager'
import CodeMatrix from '../effects/CodeMatrix.vue'

const scrollStore = useScrollStore()
const { sectionProgress } = storeToRefs(scrollStore)
const { shouldEnableCodeMatrix } = useSceneManager()

const skillsProgress = computed(() => sectionProgress.value['skills'] || 0)

// Tech keywords for the code rain
const techKeywords = [
    // Languages
    'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go',
    // Frameworks
    'Vue.js', 'React', 'Node.js', 'Express', 'FastAPI',
    // Tools
    'Docker', 'K8s', 'AWS', 'GCP', 'Git',
    // Concepts
    'REST', 'GraphQL', 'WebSocket', 'CI/CD', 'TDD',
    // Code snippets
    'async', 'await', 'const', 'let', 'fn',
    '<div>', '<span>', '{ }', ':class', '@click'
]

// Dynamic scene opacity
const sceneOpacity = computed(() => {
    const progress = skillsProgress.value
    // Fade in at the start, stay visible
    if (progress < 0.1) return progress * 10
    return 1
})
</script>

<template>
    <div class="skills-scene" :style="{ opacity: sceneOpacity }">
        <!-- Code Matrix Rain -->
        <CodeMatrix
            v-if="shouldEnableCodeMatrix"
            :keywords="techKeywords"
            :speed="0.8"
            :density="0.35"
            :colors="['#22C55E', '#3B82F6', '#8B5CF6', '#94A3B8']"
        />

        <!-- Glow Accents -->
        <div class="skills-glow">
            <div class="skills-glow__orb skills-glow__orb--1" />
            <div class="skills-glow__orb skills-glow__orb--2" />
        </div>

        <!-- Binary Pattern Overlay -->
        <div class="skills-binary" />

        <!-- Gradient Fade -->
        <div class="skills-gradient" />
    </div>
</template>

<style scoped>
.skills-scene {
    position: absolute;
    inset: 0;
    overflow: hidden;
    transition: opacity 0.5s ease;
}

/* Glow Orbs */
.skills-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.skills-glow__orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.3;
}

.skills-glow__orb--1 {
    width: 300px;
    height: 300px;
    background: #3B82F6;
    top: 10%;
    left: 20%;
    animation: glow-pulse 8s ease-in-out infinite;
}

.skills-glow__orb--2 {
    width: 250px;
    height: 250px;
    background: #8B5CF6;
    bottom: 20%;
    right: 15%;
    animation: glow-pulse 8s ease-in-out infinite 4s;
}

@keyframes glow-pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 0.3;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.5;
    }
}

/* Binary Pattern */
.skills-binary {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 50px,
        rgba(59, 130, 246, 0.02) 50px,
        rgba(59, 130, 246, 0.02) 51px
    );
    pointer-events: none;
}

/* Gradient Overlay */
.skills-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        rgba(15, 23, 42, 0.3) 0%,
        transparent 30%,
        transparent 70%,
        rgba(15, 23, 42, 0.5) 100%
    );
    pointer-events: none;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .skills-glow__orb {
        animation: none;
    }
}
</style>

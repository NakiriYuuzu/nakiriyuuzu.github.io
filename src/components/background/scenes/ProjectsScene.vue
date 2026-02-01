<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useScrollStore } from '@/stores/scrollStore'
import { storeToRefs } from 'pinia'

const scrollStore = useScrollStore()
const { sectionProgress } = storeToRefs(scrollStore)

const projectsProgress = computed(() => sectionProgress.value['projects'] || 0)

// Floating card data for 3D effect
interface FloatingCard {
    id: number
    x: number
    y: number
    z: number
    rotateX: number
    rotateY: number
    scale: number
    opacity: number
    color: string
}

const floatingCards = ref<FloatingCard[]>([])

const generateCards = () => {
    const colors = ['#22C55E', '#3B82F6', '#8B5CF6']
    const cards: FloatingCard[] = []

    for (let i = 0; i < 8; i++) {
        cards.push({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            z: -200 - Math.random() * 300,
            rotateX: -10 + Math.random() * 20,
            rotateY: -15 + Math.random() * 30,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 0.1 + Math.random() * 0.2,
            color: colors[Math.floor(Math.random() * colors.length)] ?? '#22C55E'
        })
    }

    floatingCards.value = cards
}

// Parallax effect based on scroll
const parallaxStyle = computed(() => ({
    '--progress': projectsProgress.value,
    '--translateZ': `${projectsProgress.value * 100}px`,
    '--rotateX': `${5 - projectsProgress.value * 10}deg`
}))

onMounted(() => {
    generateCards()
})
</script>

<template>
    <div class="projects-scene" :style="parallaxStyle">
        <!-- 3D Card Wall -->
        <div class="projects-cards">
            <div
                v-for="card in floatingCards"
                :key="card.id"
                class="projects-card"
                :style="{
                    '--x': `${card.x}%`,
                    '--y': `${card.y}%`,
                    '--z': `${card.z}px`,
                    '--rotateX': `${card.rotateX}deg`,
                    '--rotateY': `${card.rotateY}deg`,
                    '--scale': card.scale,
                    '--opacity': card.opacity,
                    '--color': card.color
                }"
            >
                <div class="projects-card__inner" />
            </div>
        </div>

        <!-- Depth Lines -->
        <div class="projects-depth-lines">
            <div
                v-for="i in 5"
                :key="i"
                class="projects-depth-line"
                :style="{ '--index': i }"
            />
        </div>

        <!-- Spotlight Effect -->
        <div class="projects-spotlight" />

        <!-- Gradient Overlay -->
        <div class="projects-gradient" />
    </div>
</template>

<style scoped>
.projects-scene {
    position: absolute;
    inset: 0;
    overflow: hidden;
    perspective: 1000px;
}

/* 3D Floating Cards */
.projects-cards {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    transform: rotateX(var(--rotateX, 0deg)) translateZ(var(--translateZ, 0px));
    transition: transform 0.3s ease-out;
}

.projects-card {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: 200px;
    height: 150px;
    transform:
        translate(-50%, -50%)
        translateZ(var(--z))
        rotateX(var(--rotateX))
        rotateY(var(--rotateY))
        scale(var(--scale));
    transform-style: preserve-3d;
    pointer-events: none;
}

.projects-card__inner {
    width: 100%;
    height: 100%;
    background: linear-gradient(
        135deg,
        var(--color) 0%,
        transparent 50%
    );
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    opacity: var(--opacity);
    backdrop-filter: blur(4px);
}

/* Depth Lines */
.projects-depth-lines {
    position: absolute;
    inset: 0;
    perspective: 800px;
    pointer-events: none;
}

.projects-depth-line {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 80%;
    height: 1px;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(139, 92, 246, 0.2) 20%,
        rgba(59, 130, 246, 0.3) 50%,
        rgba(139, 92, 246, 0.2) 80%,
        transparent 100%
    );
    transform:
        translate(-50%, -50%)
        translateZ(calc(var(--index) * -100px))
        rotateX(80deg);
    opacity: calc(1 - var(--index) * 0.15);
}

/* Spotlight */
.projects-spotlight {
    position: absolute;
    top: 0;
    left: 50%;
    width: 60%;
    height: 100%;
    transform: translateX(-50%);
    background: radial-gradient(
        ellipse at 50% 0%,
        rgba(139, 92, 246, 0.1) 0%,
        transparent 50%
    );
    pointer-events: none;
}

/* Gradient Overlay */
.projects-gradient {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.4) 100%),
        radial-gradient(at 30% 70%, rgba(34, 197, 94, 0.05) 0%, transparent 50%),
        radial-gradient(at 70% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
    pointer-events: none;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .projects-cards {
        transition: none;
    }
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useScrollStore } from '@/stores/scrollStore'
import { storeToRefs } from 'pinia'

const scrollStore = useScrollStore()
const { sectionProgress } = storeToRefs(scrollStore)

const aboutProgress = computed(() => sectionProgress.value['about'] || 0)

// Geometric shapes data
interface GeometricShape {
    id: number
    type: 'triangle' | 'circle' | 'square' | 'hexagon'
    x: number
    y: number
    size: number
    rotation: number
    color: string
    delay: number
}

const shapes = ref<GeometricShape[]>([])

const generateShapes = () => {
    const types: GeometricShape['type'][] = ['triangle', 'circle', 'square', 'hexagon']
    const colors = ['#22C55E', '#3B82F6', '#8B5CF6']
    const newShapes: GeometricShape[] = []

    for (let i = 0; i < 12; i++) {
        newShapes.push({
            id: i,
            type: types[Math.floor(Math.random() * types.length)] ?? 'circle',
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 20 + Math.random() * 60,
            rotation: Math.random() * 360,
            color: colors[Math.floor(Math.random() * colors.length)] ?? '#22C55E',
            delay: i * 0.15
        })
    }

    shapes.value = newShapes
}

// Dynamic transformation based on scroll
const transformStyle = computed(() => ({
    '--progress': aboutProgress.value,
    '--rotate': `${aboutProgress.value * 45}deg`,
    '--scale': 0.8 + aboutProgress.value * 0.4
}))

onMounted(() => {
    generateShapes()
})
</script>

<template>
    <div class="about-scene" :style="transformStyle">
        <!-- Geometric Shapes Background -->
        <div class="about-shapes">
            <div
                v-for="shape in shapes"
                :key="shape.id"
                class="about-shape"
                :class="`about-shape--${shape.type}`"
                :style="{
                    '--x': `${shape.x}%`,
                    '--y': `${shape.y}%`,
                    '--size': `${shape.size}px`,
                    '--rotation': `${shape.rotation}deg`,
                    '--color': shape.color,
                    '--delay': `${shape.delay}s`
                }"
            />
        </div>

        <!-- Connecting Lines -->
        <svg class="about-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#22C55E" stop-opacity="0.3" />
                    <stop offset="50%" stop-color="#3B82F6" stop-opacity="0.2" />
                    <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.3" />
                </linearGradient>
            </defs>
            <path
                class="about-connection-line"
                d="M10,20 Q30,10 50,30 T90,50"
                stroke="url(#lineGradient)"
                fill="none"
                stroke-width="0.2"
            />
            <path
                class="about-connection-line about-connection-line--delayed"
                d="M20,80 Q40,60 60,70 T100,40"
                stroke="url(#lineGradient)"
                fill="none"
                stroke-width="0.2"
            />
        </svg>

        <!-- Gradient Overlay -->
        <div class="about-gradient" />
    </div>
</template>

<style scoped>
.about-scene {
    position: absolute;
    inset: 0;
    overflow: hidden;
}

/* Geometric Shapes */
.about-shapes {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.about-shape {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--size);
    height: var(--size);
    transform: translate(-50%, -50%) rotate(var(--rotation)) scale(var(--scale, 1));
    opacity: 0.15;
    animation: shape-float 20s ease-in-out infinite;
    animation-delay: var(--delay);
}

.about-shape--triangle {
    width: 0;
    height: 0;
    border-left: calc(var(--size) / 2) solid transparent;
    border-right: calc(var(--size) / 2) solid transparent;
    border-bottom: var(--size) solid var(--color);
}

.about-shape--circle {
    border-radius: 50%;
    background: var(--color);
}

.about-shape--square {
    background: var(--color);
}

.about-shape--hexagon {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: var(--color);
}

@keyframes shape-float {
    0%, 100% {
        transform: translate(-50%, -50%) rotate(var(--rotation)) scale(var(--scale, 1));
    }
    25% {
        transform: translate(-50%, -50%) rotate(calc(var(--rotation) + 15deg)) scale(calc(var(--scale, 1) * 1.1));
    }
    50% {
        transform: translate(-50%, -50%) rotate(calc(var(--rotation) - 10deg)) scale(calc(var(--scale, 1) * 0.95));
    }
    75% {
        transform: translate(-50%, -50%) rotate(calc(var(--rotation) + 5deg)) scale(calc(var(--scale, 1) * 1.05));
    }
}

/* Connection Lines */
.about-connections {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.about-connection-line {
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
    animation: draw-line 4s ease forwards;
}

.about-connection-line--delayed {
    animation-delay: 0.5s;
}

@keyframes draw-line {
    to {
        stroke-dashoffset: 0;
    }
}

/* Gradient Overlay */
.about-gradient {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(at 20% 30%, rgba(34, 197, 94, 0.08) 0px, transparent 50%),
        radial-gradient(at 70% 60%, rgba(59, 130, 246, 0.06) 0px, transparent 50%),
        radial-gradient(at 40% 80%, rgba(139, 92, 246, 0.05) 0px, transparent 50%);
    pointer-events: none;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .about-shape {
        animation: none;
    }

    .about-connection-line {
        animation: none;
        stroke-dashoffset: 0;
    }
}
</style>

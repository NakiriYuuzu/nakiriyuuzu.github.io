<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = withDefaults(defineProps<{
    count?: number
    types?: ('triangle' | 'circle' | 'square' | 'hexagon' | 'diamond')[]
    colors?: string[]
    animated?: boolean
}>(), {
    count: 10,
    types: () => ['triangle', 'circle', 'square', 'hexagon'],
    colors: () => ['#22C55E', '#3B82F6', '#8B5CF6'],
    animated: true
})

interface Shape {
    id: number
    type: string
    x: number
    y: number
    size: number
    rotation: number
    color: string
    animationDelay: number
    animationDuration: number
}

const shapes = ref<Shape[]>([])

const generateShapes = () => {
    shapes.value = []

    for (let i = 0; i < props.count; i++) {
        shapes.value.push({
            id: i,
            type: props.types[Math.floor(Math.random() * props.types.length)] ?? 'circle',
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 20 + Math.random() * 80,
            rotation: Math.random() * 360,
            color: props.colors[Math.floor(Math.random() * props.colors.length)] ?? '#22C55E',
            animationDelay: Math.random() * 5,
            animationDuration: 15 + Math.random() * 20
        })
    }
}

// SVG paths for shapes
const getShapePath = (type: string, size: number): string => {
    const half = size / 2

    switch (type) {
        case 'triangle':
            return `M ${half} 0 L ${size} ${size} L 0 ${size} Z`
        case 'square':
            return `M 0 0 L ${size} 0 L ${size} ${size} L 0 ${size} Z`
        case 'hexagon':
            const h = size * 0.866 // sqrt(3)/2
            return `M ${half} 0 L ${size} ${size * 0.25} L ${size} ${size * 0.75} L ${half} ${size} L 0 ${size * 0.75} L 0 ${size * 0.25} Z`
        case 'diamond':
            return `M ${half} 0 L ${size} ${half} L ${half} ${size} L 0 ${half} Z`
        default:
            return ''
    }
}

onMounted(() => {
    generateShapes()
})
</script>

<template>
    <div class="geometric-shapes">
        <svg
            v-for="shape in shapes"
            :key="shape.id"
            class="geometric-shape"
            :class="{ 'is-animated': animated }"
            :style="{
                '--x': `${shape.x}%`,
                '--y': `${shape.y}%`,
                '--size': `${shape.size}px`,
                '--rotation': `${shape.rotation}deg`,
                '--color': shape.color,
                '--delay': `${shape.animationDelay}s`,
                '--duration': `${shape.animationDuration}s`
            }"
            :width="shape.size"
            :height="shape.size"
            :viewBox="`0 0 ${shape.size} ${shape.size}`"
        >
            <!-- Circle uses native SVG circle -->
            <circle
                v-if="shape.type === 'circle'"
                :cx="shape.size / 2"
                :cy="shape.size / 2"
                :r="shape.size / 2 - 1"
                :stroke="shape.color"
                fill="none"
                stroke-width="1"
            />

            <!-- Other shapes use path -->
            <path
                v-else
                :d="getShapePath(shape.type, shape.size)"
                :stroke="shape.color"
                fill="none"
                stroke-width="1"
            />
        </svg>
    </div>
</template>

<style scoped>
.geometric-shapes {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
}

.geometric-shape {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--size);
    height: var(--size);
    transform: translate(-50%, -50%) rotate(var(--rotation));
    opacity: 0.15;
}

.geometric-shape.is-animated {
    animation: shape-drift var(--duration) ease-in-out infinite;
    animation-delay: var(--delay);
}

@keyframes shape-drift {
    0%, 100% {
        transform: translate(-50%, -50%) rotate(var(--rotation)) scale(1);
        opacity: 0.15;
    }
    25% {
        transform: translate(calc(-50% + 20px), calc(-50% - 15px)) rotate(calc(var(--rotation) + 15deg)) scale(1.1);
        opacity: 0.2;
    }
    50% {
        transform: translate(calc(-50% - 15px), calc(-50% + 20px)) rotate(calc(var(--rotation) - 10deg)) scale(0.9);
        opacity: 0.1;
    }
    75% {
        transform: translate(calc(-50% + 10px), calc(-50% + 10px)) rotate(calc(var(--rotation) + 5deg)) scale(1.05);
        opacity: 0.18;
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .geometric-shape.is-animated {
        animation: none;
    }
}
</style>

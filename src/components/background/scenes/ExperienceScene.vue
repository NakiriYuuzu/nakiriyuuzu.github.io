<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useScrollStore } from '@/stores/scrollStore'
import { storeToRefs } from 'pinia'
import { useSceneManager } from '@/composables/useSceneManager'

const scrollStore = useScrollStore()
const { sectionProgress } = storeToRefs(scrollStore)
const { shouldEnableParticles } = useSceneManager()

const experienceProgress = computed(() => sectionProgress.value['experience'] || 0)

// Timeline particle flow
interface TimelineParticle {
    id: number
    x: number
    y: number
    progress: number
    speed: number
    size: number
    color: string
}

const particles = ref<TimelineParticle[]>([])
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let ctx: CanvasRenderingContext2D | null = null

const colors = ['#22C55E', '#3B82F6', '#8B5CF6']

const initParticles = () => {
    particles.value = []
    for (let i = 0; i < 30; i++) {
        particles.value.push({
            id: i,
            x: 0,
            y: 0,
            progress: Math.random(),
            speed: 0.001 + Math.random() * 0.002,
            size: 2 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)] ?? '#22C55E'
        })
    }
}

// Timeline path (vertical center line with curves)
const getTimelinePoint = (t: number, width: number, height: number) => {
    const centerX = width / 2
    const y = t * height
    // Sine wave offset from center
    const offsetX = Math.sin(t * Math.PI * 3) * 100
    return { x: centerX + offsetX, y }
}

const updateParticles = (width: number, height: number) => {
    particles.value.forEach(particle => {
        particle.progress += particle.speed
        if (particle.progress > 1) {
            particle.progress = 0
        }

        const point = getTimelinePoint(particle.progress, width, height)
        particle.x = point.x
        particle.y = point.y
    })
}

const drawTimeline = (width: number, height: number) => {
    if (!ctx) return

    // Draw the timeline path
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)'
    ctx.lineWidth = 2

    for (let t = 0; t <= 1; t += 0.01) {
        const point = getTimelinePoint(t, width, height)
        if (t === 0) {
            ctx.moveTo(point.x, point.y)
        } else {
            ctx.lineTo(point.x, point.y)
        }
    }
    ctx.stroke()

    // Draw gradient glow along the path
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)')
    gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.3)')
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0.3)')

    ctx.strokeStyle = gradient
    ctx.lineWidth = 4
    ctx.filter = 'blur(8px)'
    ctx.stroke()
    ctx.filter = 'none'
}

const drawParticles = () => {
    if (!ctx) return

    particles.value.forEach(particle => {
        ctx!.beginPath()
        ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx!.fillStyle = particle.color
        ctx!.globalAlpha = 0.8
        ctx!.fill()

        // Glow effect
        ctx!.beginPath()
        ctx!.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
        ctx!.fillStyle = particle.color
        ctx!.globalAlpha = 0.2
        ctx!.fill()

        ctx!.globalAlpha = 1
    })
}

const animate = () => {
    if (!canvasRef.value || !ctx) return

    const { width, height } = canvasRef.value

    ctx.clearRect(0, 0, width, height)

    drawTimeline(width, height)
    updateParticles(width, height)
    drawParticles()

    animationId = requestAnimationFrame(animate)
}

const resize = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`

    if (ctx) {
        ctx.scale(dpr, dpr)
    }

    initParticles()
}

onMounted(() => {
    if (!shouldEnableParticles.value) return

    const canvas = canvasRef.value
    if (!canvas) return

    ctx = canvas.getContext('2d')
    if (!ctx) return

    resize()
    animate()

    window.addEventListener('resize', resize)
})

onUnmounted(() => {
    if (animationId) {
        cancelAnimationFrame(animationId)
    }
    window.removeEventListener('resize', resize)
})

// Scene opacity
const sceneOpacity = computed(() => {
    const progress = experienceProgress.value
    if (progress < 0.1) return progress * 10
    return 1
})
</script>

<template>
    <div class="experience-scene" :style="{ opacity: sceneOpacity }">
        <!-- Timeline Particle Canvas -->
        <canvas
            v-if="shouldEnableParticles"
            ref="canvasRef"
            class="experience-canvas"
            aria-hidden="true"
        />

        <!-- Timeline Nodes -->
        <div class="experience-nodes">
            <div
                v-for="i in 5"
                :key="i"
                class="experience-node"
                :style="{
                    '--index': i,
                    '--delay': `${i * 0.2}s`
                }"
            />
        </div>

        <!-- Color Gradient Bands -->
        <div class="experience-bands">
            <div class="experience-band experience-band--past" />
            <div class="experience-band experience-band--present" />
            <div class="experience-band experience-band--future" />
        </div>

        <!-- Gradient Overlay -->
        <div class="experience-gradient" />
    </div>
</template>

<style scoped>
.experience-scene {
    position: absolute;
    inset: 0;
    overflow: hidden;
    transition: opacity 0.5s ease;
}

.experience-canvas {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

/* Timeline Nodes */
.experience-nodes {
    position: absolute;
    left: 50%;
    top: 10%;
    bottom: 10%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: none;
}

.experience-node {
    width: 12px;
    height: 12px;
    background: #22C55E;
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
    animation: node-pulse 2s ease-in-out infinite;
    animation-delay: var(--delay);
}

@keyframes node-pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 0.6;
    }
    50% {
        transform: scale(1.3);
        opacity: 1;
    }
}

/* Color Bands */
.experience-bands {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    pointer-events: none;
    opacity: 0.15;
}

.experience-band {
    flex: 1;
}

.experience-band--past {
    background: linear-gradient(180deg, rgba(139, 92, 246, 0.3) 0%, transparent 100%);
}

.experience-band--present {
    background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
}

.experience-band--future {
    background: linear-gradient(0deg, rgba(34, 197, 94, 0.3) 0%, transparent 100%);
}

/* Gradient Overlay */
.experience-gradient {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(at 50% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
        radial-gradient(at 50% 100%, rgba(34, 197, 94, 0.1) 0%, transparent 50%);
    pointer-events: none;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .experience-node {
        animation: none;
        opacity: 0.8;
    }
}
</style>

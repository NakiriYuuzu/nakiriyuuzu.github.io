<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useDeviceCapability } from '@/composables/useDeviceCapability'

interface Particle {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    color: string
    symbol?: string
}

const props = withDefaults(defineProps<{
    count?: number
    colors?: string[]
    symbols?: string[]
    speed?: number
    sizeRange?: [number, number]
    connectDistance?: number
    showConnections?: boolean
}>(), {
    count: 50,
    colors: () => ['#22C55E', '#3B82F6', '#8B5CF6'],
    symbols: () => [],
    speed: 0.5,
    sizeRange: () => [2, 6],
    connectDistance: 100,
    showConnections: false
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const particles = ref<Particle[]>([])
const { recommendedParticleCount, prefersReducedMotion } = useDeviceCapability()

let animationId: number | null = null
let ctx: CanvasRenderingContext2D | null = null

const actualCount = computed(() => {
    return Math.min(props.count, recommendedParticleCount.value)
})

const initParticles = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    particles.value = []

    for (let i = 0; i < actualCount.value; i++) {
        const color = props.colors[Math.floor(Math.random() * props.colors.length)] ?? '#22C55E'
        const symbol = props.symbols.length > 0
            ? props.symbols[Math.floor(Math.random() * props.symbols.length)]
            : undefined

        particles.value.push({
            id: i,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * props.speed,
            vy: (Math.random() - 0.5) * props.speed,
            size: props.sizeRange[0] + Math.random() * (props.sizeRange[1] - props.sizeRange[0]),
            opacity: 0.3 + Math.random() * 0.5,
            color,
            symbol
        })
    }
}

const drawParticle = (particle: Particle) => {
    if (!ctx) return

    ctx.save()
    ctx.globalAlpha = particle.opacity

    if (particle.symbol) {
        // Draw symbol
        ctx.fillStyle = particle.color
        ctx.font = `${particle.size * 3}px 'JetBrains Mono', monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(particle.symbol, particle.x, particle.y)
    } else {
        // Draw circle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
    }

    ctx.restore()
}

const drawConnections = () => {
    if (!ctx || !props.showConnections) return

    for (let i = 0; i < particles.value.length; i++) {
        for (let j = i + 1; j < particles.value.length; j++) {
            const p1 = particles.value[i]
            const p2 = particles.value[j]
            if (!p1 || !p2) continue

            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < props.connectDistance) {
                ctx.save()
                ctx.globalAlpha = (1 - distance / props.connectDistance) * 0.2
                ctx.strokeStyle = p1.color
                ctx.lineWidth = 0.5
                ctx.beginPath()
                ctx.moveTo(p1.x, p1.y)
                ctx.lineTo(p2.x, p2.y)
                ctx.stroke()
                ctx.restore()
            }
        }
    }
}

const updateParticles = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    particles.value.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < -20) particle.x = canvas.width + 20
        if (particle.x > canvas.width + 20) particle.x = -20
        if (particle.y < -20) particle.y = canvas.height + 20
        if (particle.y > canvas.height + 20) particle.y = -20
    })
}

const animate = () => {
    if (!canvasRef.value || !ctx) return

    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

    if (!prefersReducedMotion.value) {
        updateParticles()
    }

    if (props.showConnections) {
        drawConnections()
    }

    particles.value.forEach(drawParticle)

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

// Reinitialize when props change
watch([() => props.count, () => props.colors], () => {
    initParticles()
}, { deep: true })
</script>

<template>
    <canvas
        ref="canvasRef"
        class="particle-system"
        aria-hidden="true"
    />
</template>

<style scoped>
.particle-system {
    position: absolute;
    inset: 0;
    pointer-events: none;
}
</style>

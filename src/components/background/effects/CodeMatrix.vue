<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useDeviceCapability } from '@/composables/useDeviceCapability'

const props = withDefaults(defineProps<{
    keywords?: string[]
    speed?: number
    density?: number
    colors?: string[]
}>(), {
    keywords: () => [
        'Vue', 'React', 'TypeScript', 'Node.js', 'Python',
        'const', 'function', 'async', 'await', 'import',
        'export', 'class', 'interface', 'type', 'return',
        '<div>', '</>', '{...}', '=>', '===',
        'npm', 'git', 'docker', 'k8s', 'aws',
        'REST', 'GraphQL', 'SQL', 'NoSQL', 'Redis'
    ],
    speed: 1,
    density: 0.4,
    colors: () => ['#22C55E', '#3B82F6', '#8B5CF6', '#64748B']
})

interface Column {
    x: number
    y: number
    speed: number
    chars: { char: string; opacity: number; color: string }[]
    length: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { prefersReducedMotion, isMobile } = useDeviceCapability()

let animationId: number | null = null
let ctx: CanvasRenderingContext2D | null = null
let columns: Column[] = []
let lastFrameTime = 0
const targetFPS = 30
const frameInterval = 1000 / targetFPS

const charSize = 14
const columnSpacing = 25

const initColumns = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    columns = []
    const numColumns = Math.floor(canvas.width / columnSpacing * props.density)

    for (let i = 0; i < numColumns; i++) {
        const x = (i / numColumns) * canvas.width + Math.random() * columnSpacing
        columns.push({
            x,
            y: Math.random() * canvas.height,
            speed: (0.5 + Math.random() * 0.5) * props.speed,
            chars: [],
            length: 5 + Math.floor(Math.random() * 15)
        })
    }
}

const getRandomChar = (): string => {
    return props.keywords[Math.floor(Math.random() * props.keywords.length)] ?? 'const'
}

const getRandomColor = (): string => {
    return props.colors[Math.floor(Math.random() * props.colors.length)] ?? '#22C55E'
}

const updateColumn = (column: Column, height: number) => {
    column.y += column.speed

    // Reset column when it goes off screen
    if (column.y > height + column.length * charSize) {
        column.y = -column.length * charSize
        column.chars = []
        column.length = 5 + Math.floor(Math.random() * 15)
    }

    // Add new character at the head
    if (column.chars.length < column.length) {
        column.chars.unshift({
            char: getRandomChar(),
            opacity: 1,
            color: getRandomColor()
        })
    }

    // Fade out older characters
    column.chars.forEach((char, index) => {
        char.opacity = Math.max(0, 1 - (index / column.length) * 1.2)
    })

    // Remove fully faded characters
    column.chars = column.chars.slice(0, column.length)
}

const drawColumn = (column: Column) => {
    if (!ctx) return

    column.chars.forEach((char, index) => {
        const y = column.y - index * charSize

        ctx!.save()
        ctx!.globalAlpha = char.opacity * 0.6
        ctx!.fillStyle = char.color
        ctx!.font = `${charSize - 2}px 'JetBrains Mono', monospace`
        ctx!.textAlign = 'center'
        ctx!.fillText(char.char, column.x, y)
        ctx!.restore()
    })
}

const animate = (currentTime: number) => {
    if (!canvasRef.value || !ctx) return

    // FPS limiting
    const elapsed = currentTime - lastFrameTime
    if (elapsed < frameInterval) {
        animationId = requestAnimationFrame(animate)
        return
    }
    lastFrameTime = currentTime - (elapsed % frameInterval)

    const { width, height } = canvasRef.value

    // Clear with fade effect
    ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'
    ctx.fillRect(0, 0, width, height)

    // Update and draw columns
    columns.forEach(column => {
        updateColumn(column, height)
        drawColumn(column)
    })

    animationId = requestAnimationFrame(animate)
}

const resize = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`

    if (ctx) {
        ctx.scale(dpr, dpr)
    }

    initColumns()
}

onMounted(() => {
    // Skip on mobile or reduced motion
    if (isMobile.value || prefersReducedMotion.value) return

    const canvas = canvasRef.value
    if (!canvas) return

    ctx = canvas.getContext('2d')
    if (!ctx) return

    resize()
    animationId = requestAnimationFrame(animate)

    window.addEventListener('resize', resize)
})

onUnmounted(() => {
    if (animationId) {
        cancelAnimationFrame(animationId)
    }
    window.removeEventListener('resize', resize)
})
</script>

<template>
    <canvas
        ref="canvasRef"
        class="code-matrix"
        aria-hidden="true"
    />
</template>

<style scoped>
.code-matrix {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.8;
}
</style>

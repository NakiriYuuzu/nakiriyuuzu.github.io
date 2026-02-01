<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, reactive } from 'vue'
import { useScrollStore } from '@/stores/scrollStore'
import { storeToRefs } from 'pinia'
import { useMouse, useThrottleFn } from '@vueuse/core'

interface Line {
    id: number
    d: string
    color: string
    opacity: number
    delay: number
    strokeWidth: number
}

const scrollStore = useScrollStore()
const { normalizedProgress, activeSection } = storeToRefs(scrollStore)

const viewBox = ref({ width: 1920, height: 1080 })
const isMobile = ref(false)
const prefersReducedMotion = ref(false)

// Mouse tracking for interactive effect
const { x: mouseX, y: mouseY } = useMouse()
const mouseInfluence = reactive({ x: 0, y: 0 })

const updateMouseInfluence = useThrottleFn(() => {
    if (isMobile.value || prefersReducedMotion.value) return

    const normalizedX = (mouseX.value / window.innerWidth - 0.5) * 2
    const normalizedY = (mouseY.value / window.innerHeight - 0.5) * 2

    mouseInfluence.x = normalizedX * 50
    mouseInfluence.y = normalizedY * 50
}, 50)

const updateViewBox = () => {
    viewBox.value = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    isMobile.value = window.innerWidth < 768
}

const checkReducedMotion = () => {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

onMounted(() => {
    updateViewBox()
    checkReducedMotion()
    window.addEventListener('resize', updateViewBox)
    window.addEventListener('mousemove', updateMouseInfluence)
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', checkReducedMotion)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateViewBox)
    window.removeEventListener('mousemove', updateMouseInfluence)
})

// Section-based vanishing point offset (different perspectives per section)
const vanishingPointOffset = computed(() => {
    const section = activeSection.value
    switch (section) {
        case 'hero':
            return { x: 0, y: -50 }
        case 'about':
            return { x: 100, y: 0 }
        case 'skills':
            return { x: -50, y: 50 }
        case 'projects':
            return { x: 50, y: -30 }
        case 'experience':
            return { x: -100, y: 30 }
        case 'contact':
            return { x: 0, y: 80 }
        default:
            return { x: 0, y: 0 }
    }
})

// Section-based color emphasis
const sectionColors = computed(() => {
    const section = activeSection.value
    switch (section) {
        case 'hero':
        case 'about':
            return { primary: '#22C55E', secondary: '#3B82F6', tertiary: '#8B5CF6' }
        case 'skills':
            return { primary: '#3B82F6', secondary: '#8B5CF6', tertiary: '#22C55E' }
        case 'projects':
            return { primary: '#8B5CF6', secondary: '#22C55E', tertiary: '#3B82F6' }
        case 'experience':
            return { primary: '#22C55E', secondary: '#8B5CF6', tertiary: '#3B82F6' }
        case 'contact':
            return { primary: '#3B82F6', secondary: '#22C55E', tertiary: '#8B5CF6' }
        default:
            return { primary: '#22C55E', secondary: '#3B82F6', tertiary: '#8B5CF6' }
    }
})

// Dynamic opacity based on scroll
const baseOpacity = computed(() => {
    const progress = normalizedProgress.value
    // Fade slightly as user scrolls
    return 0.08 + (1 - progress) * 0.04
})

// Section-specific line patterns
const sectionPattern = computed(() => {
    const section = activeSection.value
    switch (section) {
        case 'hero':
            return { radialMultiplier: 1, gridDensity: 1, curveAmount: 0 }
        case 'about':
            return { radialMultiplier: 0.8, gridDensity: 1.2, curveAmount: 0.1 }
        case 'skills':
            return { radialMultiplier: 1.2, gridDensity: 0.8, curveAmount: 0 }
        case 'projects':
            return { radialMultiplier: 0.6, gridDensity: 1.5, curveAmount: 0.2 }
        case 'experience':
            return { radialMultiplier: 1, gridDensity: 1, curveAmount: 0.15 }
        case 'contact':
            return { radialMultiplier: 0.7, gridDensity: 0.9, curveAmount: 0.1 }
        default:
            return { radialMultiplier: 1, gridDensity: 1, curveAmount: 0 }
    }
})

// Generate perspective lines from vanishing point with mouse interaction
const lines = computed<Line[]>(() => {
    const { width, height } = viewBox.value
    const vpOffset = vanishingPointOffset.value
    const pattern = sectionPattern.value

    // Vanishing point with mouse influence
    const vp = {
        x: width / 2 + vpOffset.x + mouseInfluence.x * 0.3,
        y: height / 2 + vpOffset.y + mouseInfluence.y * 0.3
    }

    const lineCount = isMobile.value ? 20 : 40
    const result: Line[] = []
    let id = 0
    const colors = sectionColors.value

    // Radial lines from center
    const radialCount = Math.round((isMobile.value ? 8 : 16) * pattern.radialMultiplier)
    for (let i = 0; i < radialCount; i++) {
        const angle = (i / radialCount) * Math.PI * 2
        const radius = Math.max(width, height) * 1.5

        // Apply curve if pattern requires it
        const curveOffset = pattern.curveAmount * Math.sin(angle * 3) * 100

        const endX = vp.x + Math.cos(angle) * radius
        const endY = vp.y + Math.sin(angle) * radius

        const colorIndex = i % 3
        const color = colorIndex === 0 ? colors.primary : colorIndex === 1 ? colors.secondary : colors.tertiary

        // Dynamic stroke width based on distance from mouse
        const distanceFromMouse = Math.sqrt(
            Math.pow((vp.x - mouseX.value) / width, 2) +
            Math.pow((vp.y - mouseY.value) / height, 2)
        )
        const strokeWidth = isMobile.value ? 1 : 1 + (1 - Math.min(distanceFromMouse * 2, 1)) * 0.5

        // Create path with optional curve
        let path: string
        if (pattern.curveAmount > 0) {
            const ctrlX = vp.x + Math.cos(angle) * (radius * 0.5) + curveOffset
            const ctrlY = vp.y + Math.sin(angle) * (radius * 0.5) + curveOffset
            path = `M${vp.x} ${vp.y} Q${ctrlX} ${ctrlY} ${endX} ${endY}`
        } else {
            path = `M${vp.x} ${vp.y} L${endX} ${endY}`
        }

        result.push({
            id: id++,
            d: path,
            color,
            opacity: baseOpacity.value * (0.5 + Math.random() * 0.5),
            delay: i * 0.15,
            strokeWidth
        })
    }

    // Horizontal perspective lines (logarithmic spacing)
    const hLineCount = Math.round((isMobile.value ? 6 : 12) * pattern.gridDensity)
    for (let i = 0; i < hLineCount; i++) {
        const t = (i - hLineCount / 2 + 0.5) / (hLineCount / 2)
        const perspectiveT = Math.sign(t) * Math.pow(Math.abs(t), 0.6)
        const y = vp.y + perspectiveT * height * 0.8

        const colorIndex = i % 3
        const color = colorIndex === 0 ? colors.primary : colorIndex === 1 ? colors.secondary : colors.tertiary

        result.push({
            id: id++,
            d: `M0 ${y} L${width} ${y}`,
            color,
            opacity: baseOpacity.value * (0.3 + Math.abs(perspectiveT) * 0.4),
            delay: radialCount * 0.15 + i * 0.1,
            strokeWidth: 1
        })
    }

    // Vertical perspective lines (logarithmic spacing)
    const vLineCount = Math.round((isMobile.value ? 6 : 12) * pattern.gridDensity)
    for (let i = 0; i < vLineCount; i++) {
        const t = (i - vLineCount / 2 + 0.5) / (vLineCount / 2)
        const perspectiveT = Math.sign(t) * Math.pow(Math.abs(t), 0.6)
        const x = vp.x + perspectiveT * width * 0.8

        const colorIndex = i % 3
        const color = colorIndex === 0 ? colors.secondary : colorIndex === 1 ? colors.tertiary : colors.primary

        result.push({
            id: id++,
            d: `M${x} 0 L${x} ${height}`,
            color,
            opacity: baseOpacity.value * (0.3 + Math.abs(perspectiveT) * 0.4),
            delay: (radialCount + hLineCount) * 0.15 + i * 0.1,
            strokeWidth: 1
        })
    }

    return result.slice(0, lineCount)
})

// Transformation style for the entire SVG
const svgTransformStyle = computed(() => {
    if (isMobile.value || prefersReducedMotion.value) return {}

    return {
        transform: `translate(${mouseInfluence.x * 0.05}px, ${mouseInfluence.y * 0.05}px)`,
        transition: 'transform 0.3s ease-out'
    }
})
</script>

<template>
    <svg
        class="davinci-lines"
        :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
        aria-hidden="true"
        :style="svgTransformStyle"
    >
        <path
            v-for="line in lines"
            :key="line.id"
            class="davinci-lines__line"
            :d="line.d"
            :stroke="line.color"
            :stroke-width="line.strokeWidth"
            :style="{
                '--line-opacity': line.opacity,
                animationDelay: prefersReducedMotion ? '0s' : `${line.delay}s`
            }"
        />
    </svg>
</template>

<style scoped>
/* Styles are in global style.css */
</style>

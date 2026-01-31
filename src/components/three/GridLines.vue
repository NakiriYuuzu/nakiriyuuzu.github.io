<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLoop } from '@tresjs/core'
import * as THREE from 'three'

const props = defineProps<{
    scrollProgress: number
}>()

// Grid configuration
const gridSize = 20
const gridDivisions = 40
const lineCount = gridDivisions * 2 + 2

// Create grid lines geometry
const positions = ref<Float32Array>(new Float32Array(0))
const colors = ref<Float32Array>(new Float32Array(0))

const createGridGeometry = () => {
    const posArray: number[] = []
    const colorArray: number[] = []

    const halfSize = gridSize / 2
    const step = gridSize / gridDivisions

    // Horizontal lines (parallel to X-axis)
    for (let i = 0; i <= gridDivisions; i++) {
        const z = -halfSize + i * step

        posArray.push(-halfSize, 0, z)
        posArray.push(halfSize, 0, z)

        // Gradient color based on distance from center
        const intensity = 1 - Math.abs(z) / halfSize
        colorArray.push(intensity * 0.1, intensity * 0.1, intensity * 0.15)
        colorArray.push(intensity * 0.1, intensity * 0.1, intensity * 0.15)
    }

    // Vertical lines (parallel to Z-axis)
    for (let i = 0; i <= gridDivisions; i++) {
        const x = -halfSize + i * step

        posArray.push(x, 0, -halfSize)
        posArray.push(x, 0, halfSize)

        const intensity = 1 - Math.abs(x) / halfSize
        colorArray.push(intensity * 0.1, intensity * 0.1, intensity * 0.15)
        colorArray.push(intensity * 0.1, intensity * 0.1, intensity * 0.15)
    }

    positions.value = new Float32Array(posArray)
    colors.value = new Float32Array(colorArray)
}

onMounted(() => {
    createGridGeometry()
})

// Animation
const gridRef = ref<THREE.LineSegments | null>(null)
const time = ref(0)

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }: { delta: number }) => {
    if (!gridRef.value) return

    time.value += delta

    // Subtle rotation based on scroll
    gridRef.value.rotation.x = -Math.PI / 2 + props.scrollProgress * 0.2
    gridRef.value.rotation.z = time.value * 0.01 + props.scrollProgress * 0.5

    // Scale effect based on scroll
    const scale = 1 + props.scrollProgress * 0.3
    gridRef.value.scale.setScalar(scale)

    // Position adjustment for perspective effect
    gridRef.value.position.y = -5 - props.scrollProgress * 3
    gridRef.value.position.z = -10 + props.scrollProgress * 2
})

const vertexCount = computed(() => {
    return positions.value.length / 3
})

// Line material
const lineMaterial = computed(() => ({
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    linewidth: 1
}))
</script>

<template>
    <TresLineSegments
        ref="gridRef"
        :position="[0, -5, -10]"
        :rotation="[-Math.PI / 2, 0, 0]"
    >
        <TresBufferGeometry>
            <TresBufferAttribute
                v-if="positions.length > 0"
                :array="positions"
                :count="vertexCount"
                :item-size="3"
                attach="attributes-position"
            />
            <TresBufferAttribute
                v-if="colors.length > 0"
                :array="colors"
                :count="vertexCount"
                :item-size="3"
                attach="attributes-color"
            />
        </TresBufferGeometry>
        <TresLineBasicMaterial v-bind="lineMaterial" />
    </TresLineSegments>
</template>

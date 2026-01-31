<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLoop } from '@tresjs/core'
import * as THREE from 'three'
import { useDeviceCapability } from '@/composables/useDeviceCapability'

const props = defineProps<{
    scrollProgress: number
}>()

const { recommendedParticleCount } = useDeviceCapability()

const particleCount = computed(() => recommendedParticleCount.value)

// Create particle geometry
const positions = ref<Float32Array>(new Float32Array(0))
const colors = ref<Float32Array>(new Float32Array(0))

const initParticles = () => {
    const count = particleCount.value
    const posArray = new Float32Array(count * 3)
    const colorArray = new Float32Array(count * 3)

    // New color scheme: Green (#22C55E) and Blue (#3B82F6)
    const greenColor = new THREE.Color('#22C55E')
    const blueColor = new THREE.Color('#3B82F6')
    const purpleColor = new THREE.Color('#8B5CF6')

    for (let i = 0; i < count; i++) {
        // Position - spread in a large sphere
        const i3 = i * 3
        posArray[i3] = (Math.random() - 0.5) * 25
        posArray[i3 + 1] = (Math.random() - 0.5) * 25
        posArray[i3 + 2] = (Math.random() - 0.5) * 25

        // Color - mix between green, blue, and purple
        const mixFactor = Math.random()
        let color: THREE.Color
        if (mixFactor < 0.4) {
            color = greenColor.clone().lerp(blueColor, mixFactor / 0.4)
        } else {
            color = blueColor.clone().lerp(purpleColor, (mixFactor - 0.4) / 0.6)
        }
        colorArray[i3] = color.r
        colorArray[i3 + 1] = color.g
        colorArray[i3 + 2] = color.b
    }

    positions.value = posArray
    colors.value = colorArray
}

onMounted(() => {
    initParticles()
})

// Animation loop
const pointsRef = ref<THREE.Points | null>(null)
const time = ref(0)

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }: { delta: number }) => {
    if (!pointsRef.value) return

    time.value += delta

    const geometry = pointsRef.value.geometry
    const positionAttr = geometry.getAttribute('position')

    if (positionAttr && positionAttr.array) {
        const posArray = positionAttr.array as Float32Array
        const count = posArray.length / 3

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const y = posArray[i3 + 1]
            const x = posArray[i3]
            const z = posArray[i3 + 2]

            if (y !== undefined && x !== undefined && z !== undefined) {
                // Upward movement with scroll acceleration
                const scrollSpeed = 1 + props.scrollProgress * 3
                posArray[i3 + 1] = y + 0.015 * scrollSpeed

                // Gentle wave motion
                posArray[i3] = x + Math.sin(time.value + i * 0.1) * 0.002
                posArray[i3 + 2] = z + Math.cos(time.value + i * 0.1) * 0.002

                // Reset particles that go too high
                const newY = posArray[i3 + 1]
                if (newY !== undefined && newY > 12) {
                    posArray[i3 + 1] = -12
                }
            }
        }

        positionAttr.needsUpdate = true
    }

    // Rotate the entire particle system slightly
    pointsRef.value.rotation.y = time.value * 0.015
    pointsRef.value.rotation.x = Math.sin(time.value * 0.1) * 0.1
})

// Particle material
const particleMaterial = computed(() => ({
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true
}))
</script>

<template>
    <TresPoints ref="pointsRef">
        <TresBufferGeometry>
            <TresBufferAttribute
                :array="positions"
                :count="particleCount"
                :item-size="3"
                attach="attributes-position"
            />
            <TresBufferAttribute
                :array="colors"
                :count="particleCount"
                :item-size="3"
                attach="attributes-color"
            />
        </TresBufferGeometry>
        <TresPointsMaterial
            :size="0.04"
            v-bind="particleMaterial"
        />
    </TresPoints>
</template>

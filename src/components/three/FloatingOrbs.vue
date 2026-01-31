<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLoop } from '@tresjs/core'
import * as THREE from 'three'

const props = defineProps<{
    activeSection: string
    scrollProgress: number
}>()

// Orb configurations - Updated with new color scheme
const orbs = ref([
    {
        position: [3, 2, -2] as [number, number, number],
        scale: 0.8,
        color: '#22C55E',
        emissiveIntensity: 0.4
    },
    {
        position: [-2, -1, -3] as [number, number, number],
        scale: 0.5,
        color: '#3B82F6',
        emissiveIntensity: 0.5
    },
    {
        position: [0, 3, -4] as [number, number, number],
        scale: 0.6,
        color: '#8B5CF6',
        emissiveIntensity: 0.35
    },
    {
        position: [-3, 0, -2] as [number, number, number],
        scale: 0.4,
        color: '#22C55E',
        emissiveIntensity: 0.45
    }
])

// Section color mappings - Green, Blue, Purple theme
const sectionColors: Record<string, { primary: string, secondary: string }> = {
    hero: { primary: '#22C55E', secondary: '#3B82F6' },
    about: { primary: '#3B82F6', secondary: '#8B5CF6' },
    skills: { primary: '#22C55E', secondary: '#3B82F6' },
    projects: { primary: '#8B5CF6', secondary: '#22C55E' },
    experience: { primary: '#3B82F6', secondary: '#22C55E' },
    contact: { primary: '#22C55E', secondary: '#8B5CF6' }
}

// Update orb colors based on active section
watch(() => props.activeSection, (section) => {
    const sectionColor = sectionColors[section]
    const colorConfig = sectionColor ?? sectionColors.hero
    const primary = colorConfig?.primary ?? '#22C55E'
    const secondary = colorConfig?.secondary ?? '#3B82F6'
    orbs.value = orbs.value.map((orb, index) => ({
        ...orb,
        color: index % 2 === 0 ? primary : secondary
    }))
}, { immediate: true })

// Orb refs for animation
const orbRefs = ref<THREE.Mesh[]>([])
const time = ref(0)

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }: { delta: number }) => {
    time.value += delta

    orbRefs.value.forEach((orbMesh, index) => {
        if (!orbMesh) return

        const orb = orbs.value[index]
        if (!orb) return

        const basePosition = orb.position

        // Floating animation with different speeds
        const floatSpeed = 0.4 + index * 0.15
        const floatAmplitude = 0.4 + index * 0.1

        orbMesh.position.x = basePosition[0] + Math.sin(time.value * floatSpeed) * floatAmplitude
        orbMesh.position.y = basePosition[1] + Math.cos(time.value * floatSpeed * 0.8) * floatAmplitude
        orbMesh.position.z = basePosition[2] + Math.sin(time.value * floatSpeed * 0.5) * floatAmplitude * 0.5

        // Subtle scale pulsing
        const pulseScale = orb.scale * (1 + Math.sin(time.value * 0.5 + index) * 0.15)
        orbMesh.scale.setScalar(pulseScale)

        // Adjust based on scroll - more dramatic movement
        orbMesh.position.y += props.scrollProgress * 3
        orbMesh.position.x += Math.sin(props.scrollProgress * Math.PI) * (index % 2 === 0 ? 1 : -1)
    })
})

const setOrbRef = (el: any, index: number) => {
    if (el) {
        orbRefs.value[index] = el
    }
}
</script>

<template>
    <TresGroup>
        <TresMesh
            v-for="(orb, index) in orbs"
            :key="index"
            :ref="(el: any) => setOrbRef(el, index)"
            :position="orb.position"
            :scale="orb.scale"
        >
            <TresSphereGeometry :args="[1, 32, 32]" />
            <TresMeshStandardMaterial
                :color="orb.color"
                :emissive="orb.color"
                :emissive-intensity="orb.emissiveIntensity"
                :metalness="0.2"
                :roughness="0.3"
                :transparent="true"
                :opacity="0.6"
            />
        </TresMesh>
    </TresGroup>
</template>

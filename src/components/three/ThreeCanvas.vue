<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { computed, ref, watch, onMounted } from 'vue'
import { useScrollStore } from '@/stores/scrollStore'
import { storeToRefs } from 'pinia'
import ParticleField from './ParticleField.vue'
import FloatingOrbs from './FloatingOrbs.vue'
import GridLines from './GridLines.vue'

const scrollStore = useScrollStore()
const { normalizedProgress, activeSection } = storeToRefs(scrollStore)

// Dynamic scene color based on scroll - Dark theme
const sceneColor = computed(() => {
    const progress = normalizedProgress.value
    // Transition from deep navy to slightly lighter
    const r = Math.floor(15 + progress * 5)
    const g = Math.floor(23 + progress * 8)
    const b = Math.floor(42 + progress * 10)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
})

// Camera position - subtle parallax effect
const cameraPosition = ref<[number, number, number]>([0, 0, 5])

watch(normalizedProgress, (progress) => {
    cameraPosition.value = [
        Math.sin(progress * Math.PI * 0.5) * 0.5,
        progress * 0.5,
        5 - progress * 0.5
    ]
})

// Delayed rendering for smooth initial load
const isReady = ref(false)
onMounted(() => {
    setTimeout(() => {
        isReady.value = true
    }, 100)
})
</script>

<template>
    <div class="three-background">
        <Transition name="fade">
            <TresCanvas
                v-if="isReady"
                :clear-color="sceneColor"
                alpha
                window-size
                :antialias="true"
            >
                <TresPerspectiveCamera
                    :position="cameraPosition"
                    :fov="75"
                    :near="0.1"
                    :far="1000"
                />

                <GridLines :scroll-progress="normalizedProgress" />
                <ParticleField :scroll-progress="normalizedProgress" />
                <FloatingOrbs :active-section="activeSection" :scroll-progress="normalizedProgress" />

                <TresAmbientLight :intensity="0.3" />
                <TresPointLight :position="[10, 10, 10]" color="#22C55E" :intensity="0.6" />
                <TresPointLight :position="[-10, -10, 5]" color="#3B82F6" :intensity="0.4" />
            </TresCanvas>
        </Transition>
    </div>
</template>

<style scoped>
.three-background {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

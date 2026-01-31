<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { computed, ref, watch, onMounted } from 'vue'
import { useScrollStore } from '@/stores/scrollStore'
import { storeToRefs } from 'pinia'
import ParticleField from './ParticleField.vue'
import FloatingOrbs from './FloatingOrbs.vue'

const scrollStore = useScrollStore()
const { normalizedProgress, activeSection } = storeToRefs(scrollStore)

// Dynamic scene color based on scroll
const sceneColor = computed(() => {
    const progress = normalizedProgress.value
    // Transition from dark navy to slightly warmer tones
    const r = Math.floor(10 + progress * 5)
    const g = Math.floor(10 + progress * 8)
    const b = Math.floor(15 + progress * 10)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
})

// Camera position
const cameraPosition = ref<[number, number, number]>([0, 0, 5])

// Adjust camera based on scroll
watch(normalizedProgress, (progress) => {
    cameraPosition.value = [
        Math.sin(progress * Math.PI * 0.5) * 0.5,
        progress * 0.5,
        5 - progress * 0.5
    ]
})

const isReady = ref(false)
onMounted(() => {
    // Delay rendering to ensure smooth initial load
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

                <ParticleField :scroll-progress="normalizedProgress" />
                <FloatingOrbs :active-section="activeSection" :scroll-progress="normalizedProgress" />

                <TresAmbientLight :intensity="0.3" />
                <TresPointLight :position="[10, 10, 10]" color="#c9a962" :intensity="0.8" />
                <TresPointLight :position="[-10, -10, 5]" color="#8051ff" :intensity="0.5" />
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

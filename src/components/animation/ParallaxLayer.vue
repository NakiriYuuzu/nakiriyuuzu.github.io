<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useDeviceCapability } from '@/composables/useDeviceCapability'

export interface ParallaxLayerProps {
    speed?: number
    direction?: 'vertical' | 'horizontal'
    start?: string
    end?: string
}

const props = withDefaults(defineProps<ParallaxLayerProps>(), {
    speed: 0.5,
    direction: 'vertical',
    start: 'top bottom',
    end: 'bottom top'
})

const layerRef = ref<HTMLElement | null>(null)
const { shouldEnableParallax, prefersReducedMotion } = useDeviceCapability()

let trigger: ScrollTrigger | null = null

const createParallax = () => {
    if (!layerRef.value || !shouldEnableParallax.value) return

    const distance = 100 * props.speed
    const axis = props.direction === 'vertical' ? 'y' : 'x'

    gsap.set(layerRef.value, { [axis]: distance })

    trigger = ScrollTrigger.create({
        trigger: layerRef.value,
        start: props.start,
        end: props.end,
        scrub: true,
        onUpdate: (self) => {
            if (layerRef.value) {
                const value = distance * (1 - self.progress * 2)
                gsap.set(layerRef.value, { [axis]: value })
            }
        }
    })
}

const destroyParallax = () => {
    if (trigger) {
        trigger.kill()
        trigger = null
    }
    if (layerRef.value) {
        gsap.set(layerRef.value, { y: 0, x: 0 })
    }
}

onMounted(() => {
    requestAnimationFrame(() => {
        createParallax()
    })
})

onUnmounted(() => {
    destroyParallax()
})

watch(prefersReducedMotion, (reduced) => {
    if (reduced) {
        destroyParallax()
    } else {
        createParallax()
    }
})
</script>

<template>
    <div ref="layerRef" class="parallax-layer">
        <slot />
    </div>
</template>

<style scoped>
.parallax-layer {
    will-change: transform;
}
</style>

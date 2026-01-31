<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useDeviceCapability } from '@/composables/useDeviceCapability'

export interface ScrollRevealProps {
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
    distance?: number
    duration?: number
    delay?: number
    start?: string
    once?: boolean
    stagger?: number
    scale?: number
    rotate?: number
}

const props = withDefaults(defineProps<ScrollRevealProps>(), {
    direction: 'up',
    distance: 50,
    duration: 0.8,
    delay: 0,
    start: 'top 85%',
    once: true,
    stagger: 0,
    scale: 1,
    rotate: 0
})

const containerRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion } = useDeviceCapability()

let trigger: ScrollTrigger | null = null

const getInitialState = computed(() => {
    if (prefersReducedMotion.value) {
        return { opacity: 1 }
    }

    const state: gsap.TweenVars = {
        opacity: 0
    }

    if (props.scale !== 1) {
        state.scale = props.scale
    }

    if (props.rotate !== 0) {
        state.rotation = props.rotate
    }

    switch (props.direction) {
        case 'up':
            state.y = props.distance
            break
        case 'down':
            state.y = -props.distance
            break
        case 'left':
            state.x = props.distance
            break
        case 'right':
            state.x = -props.distance
            break
    }

    return state
})

const getFinalState = computed(() => {
    const state: gsap.TweenVars = {
        opacity: 1,
        duration: props.duration,
        delay: props.delay,
        ease: 'power3.out'
    }

    if (props.scale !== 1) {
        state.scale = 1
    }

    if (props.rotate !== 0) {
        state.rotation = 0
    }

    switch (props.direction) {
        case 'up':
        case 'down':
            state.y = 0
            break
        case 'left':
        case 'right':
            state.x = 0
            break
    }

    if (props.stagger > 0) {
        state.stagger = props.stagger
    }

    return state
})

onMounted(() => {
    if (!containerRef.value || prefersReducedMotion.value) return

    const targets = props.stagger > 0
        ? containerRef.value.children
        : containerRef.value

    gsap.set(targets, getInitialState.value)

    trigger = ScrollTrigger.create({
        trigger: containerRef.value,
        start: props.start,
        onEnter: () => {
            gsap.to(targets, getFinalState.value)
        },
        onLeaveBack: props.once
            ? undefined
            : () => {
                gsap.to(targets, {
                    ...getInitialState.value,
                    duration: props.duration * 0.5
                })
            },
        once: props.once
    })
})

onUnmounted(() => {
    trigger?.kill()
})
</script>

<template>
    <div ref="containerRef" class="scroll-reveal">
        <slot />
    </div>
</template>

<style scoped>
.scroll-reveal {
    will-change: transform, opacity;
}
</style>

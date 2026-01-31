<script setup lang="ts">
import { useLenisProvider } from '@/composables/useLenisScroll'
import { ScrollTrigger } from '@/lib/gsap'
import { onMounted, onUnmounted } from 'vue'

useLenisProvider()

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
    // Refresh ScrollTrigger on resize
    resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh()
    })
    resizeObserver.observe(document.body)
})

onUnmounted(() => {
    resizeObserver?.disconnect()
})
</script>

<template>
    <div class="lenis-wrapper">
        <slot />
    </div>
</template>

<style>
html.lenis,
html.lenis body {
    height: auto;
}

.lenis.lenis-smooth {
    scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
    overscroll-behavior: contain;
}

.lenis.lenis-stopped {
    overflow: hidden;
}

.lenis.lenis-smooth iframe {
    pointer-events: none;
}
</style>

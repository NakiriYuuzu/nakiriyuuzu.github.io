<script setup lang="ts">
import { useLenisProvider } from '@/composables/useLenisScroll'
import { ScrollTrigger } from '@/lib/gsap'
import { useScrollStore } from '@/stores/scrollStore'
import { onMounted, onUnmounted } from 'vue'

useLenisProvider()

const scrollStore = useScrollStore()
const sectionIds = ['hero', 'about', 'skills', 'projects', 'experience', 'contact']

let resizeObserver: ResizeObserver | null = null
let sectionObserver: IntersectionObserver | null = null

const setupSectionObserver = () => {
    // Track visible sections and their visibility
    const visibleSections = new Map<string, number>()

    const updateActiveSection = () => {
        // Find section with most visibility
        let maxVisibility = 0
        let activeId = ''
        visibleSections.forEach((visibility, id) => {
            if (visibility > maxVisibility) {
                maxVisibility = visibility
                activeId = id
            }
        })

        // Update active section if we have a clear winner
        if (activeId && maxVisibility > 0.1) {
            scrollStore.setActiveSection(activeId)
        }
    }

    // Create IntersectionObserver to detect active section
    sectionObserver = new IntersectionObserver(
        (entries) => {
            // Process all entries first
            entries.forEach((entry) => {
                const sectionId = entry.target.id
                if (!sectionId || !sectionIds.includes(sectionId)) return

                if (entry.isIntersecting) {
                    // Calculate how much of the section is visible relative to viewport
                    const viewportHeight = window.innerHeight
                    const rect = entry.boundingClientRect
                    const visibleTop = Math.max(0, rect.top)
                    const visibleBottom = Math.min(viewportHeight, rect.bottom)
                    const visibleHeight = Math.max(0, visibleBottom - visibleTop)
                    const visibilityRatio = visibleHeight / viewportHeight

                    visibleSections.set(sectionId, visibilityRatio)
                    scrollStore.setSectionProgress(sectionId, entry.intersectionRatio)
                } else {
                    visibleSections.delete(sectionId)
                }
            })

            // Then determine active section after all entries processed
            updateActiveSection()
        },
        {
            threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 1],
            rootMargin: '0px'
        }
    )

    // Observe all sections
    sectionIds.forEach((id) => {
        const section = document.getElementById(id)
        if (section) {
            sectionObserver?.observe(section)
        }
    })
}

onMounted(() => {
    // Setup section observer
    setupSectionObserver()

    // Refresh ScrollTrigger on resize
    resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh()
    })
    resizeObserver.observe(document.body)
})

onUnmounted(() => {
    resizeObserver?.disconnect()
    sectionObserver?.disconnect()
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

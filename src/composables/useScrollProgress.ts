import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface ScrollProgressOptions {
    /**
     * Element to track scroll progress for
     * If not provided, tracks the entire document
     */
    element?: HTMLElement | null
    /**
     * Throttle scroll events (ms)
     */
    throttle?: number
}

export function useScrollProgress(options: ScrollProgressOptions = {}) {
    const { throttle = 10 } = options

    const scrollY = ref(0)
    const scrollHeight = ref(0)
    const clientHeight = ref(0)

    const progress = computed(() => {
        if (scrollHeight.value <= clientHeight.value) return 0
        const maxScroll = scrollHeight.value - clientHeight.value
        return Math.min(Math.max(scrollY.value / maxScroll, 0), 1)
    })

    const progressPercent = computed(() => Math.round(progress.value * 100))

    let lastUpdate = 0
    let rafId: number | null = null

    const updateScroll = () => {
        const now = Date.now()
        if (now - lastUpdate < throttle) {
            if (rafId === null) {
                rafId = requestAnimationFrame(() => {
                    rafId = null
                    updateScroll()
                })
            }
            return
        }
        lastUpdate = now

        if (options.element) {
            scrollY.value = options.element.scrollTop
            scrollHeight.value = options.element.scrollHeight
            clientHeight.value = options.element.clientHeight
        } else {
            scrollY.value = window.scrollY || document.documentElement.scrollTop
            scrollHeight.value = document.documentElement.scrollHeight
            clientHeight.value = window.innerHeight
        }
    }

    const handleScroll = () => {
        updateScroll()
    }

    const handleResize = () => {
        updateScroll()
    }

    onMounted(() => {
        updateScroll()

        const target = options.element || window
        target.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('resize', handleResize, { passive: true })
    })

    onUnmounted(() => {
        const target = options.element || window
        target.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)

        if (rafId !== null) {
            cancelAnimationFrame(rafId)
        }
    })

    return {
        scrollY,
        scrollHeight,
        clientHeight,
        progress,
        progressPercent
    }
}

/**
 * Track which section is currently in view
 */
export function useActiveSection(sectionIds: string[]) {
    const activeSection = ref<string | null>(null)
    const activeSectionIndex = ref(-1)

    let observer: IntersectionObserver | null = null

    onMounted(() => {
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            // Find the most visible section
            let maxRatio = 0
            let mostVisibleSection: string | null = null
            let mostVisibleIndex = -1

            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                    maxRatio = entry.intersectionRatio
                    mostVisibleSection = entry.target.id
                    mostVisibleIndex = sectionIds.indexOf(entry.target.id)
                }
            })

            if (mostVisibleSection) {
                activeSection.value = mostVisibleSection
                activeSectionIndex.value = mostVisibleIndex
            }
        }

        observer = new IntersectionObserver(handleIntersection, {
            threshold: [0, 0.25, 0.5, 0.75, 1],
            rootMargin: '-20% 0px -20% 0px'
        })

        sectionIds.forEach((id) => {
            const element = document.getElementById(id)
            if (element) {
                observer?.observe(element)
            }
        })
    })

    onUnmounted(() => {
        observer?.disconnect()
    })

    return {
        activeSection,
        activeSectionIndex
    }
}

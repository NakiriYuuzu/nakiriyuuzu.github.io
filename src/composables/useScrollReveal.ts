import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface ScrollRevealOptions {
    threshold?: number
    rootMargin?: string
    once?: boolean
    delay?: number
}

export function useScrollReveal(
    target: Ref<HTMLElement | null>,
    options: ScrollRevealOptions = {}
) {
    const {
        threshold = 0.1,
        rootMargin = '0px 0px -50px 0px',
        once = true,
        delay = 0
    } = options

    const isVisible = ref(false)
    const hasAnimated = ref(false)

    let observer: IntersectionObserver | null = null

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (delay > 0) {
                    setTimeout(() => {
                        isVisible.value = true
                        hasAnimated.value = true
                    }, delay)
                } else {
                    isVisible.value = true
                    hasAnimated.value = true
                }

                if (once && observer && target.value) {
                    observer.unobserve(target.value)
                }
            } else if (!once) {
                isVisible.value = false
            }
        })
    }

    onMounted(() => {
        if (!target.value) return

        observer = new IntersectionObserver(handleIntersection, {
            threshold,
            rootMargin
        })

        observer.observe(target.value)
    })

    onUnmounted(() => {
        if (observer && target.value) {
            observer.unobserve(target.value)
            observer.disconnect()
        }
    })

    return {
        isVisible,
        hasAnimated
    }
}

/**
 * Hook for multiple elements with staggered animation
 */
export function useScrollRevealGroup(
    targets: Ref<HTMLElement[]>,
    options: ScrollRevealOptions & { staggerDelay?: number } = {}
) {
    const { staggerDelay = 100, ...revealOptions } = options

    const visibleItems = ref<Set<number>>(new Set())

    let observer: IntersectionObserver | null = null

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            const index = targets.value.indexOf(entry.target as HTMLElement)
            if (index === -1) return

            if (entry.isIntersecting) {
                setTimeout(() => {
                    visibleItems.value.add(index)
                    visibleItems.value = new Set(visibleItems.value)
                }, index * staggerDelay + (revealOptions.delay || 0))

                if (revealOptions.once !== false && observer) {
                    observer.unobserve(entry.target)
                }
            } else if (revealOptions.once === false) {
                visibleItems.value.delete(index)
                visibleItems.value = new Set(visibleItems.value)
            }
        })
    }

    onMounted(() => {
        if (!targets.value.length) return

        observer = new IntersectionObserver(handleIntersection, {
            threshold: revealOptions.threshold || 0.1,
            rootMargin: revealOptions.rootMargin || '0px 0px -50px 0px'
        })

        targets.value.forEach((target) => {
            if (target) observer?.observe(target)
        })
    })

    onUnmounted(() => {
        if (observer) {
            observer.disconnect()
        }
    })

    const isItemVisible = (index: number) => visibleItems.value.has(index)

    return {
        visibleItems,
        isItemVisible
    }
}

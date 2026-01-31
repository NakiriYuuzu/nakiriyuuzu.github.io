import { ref, onMounted, onUnmounted, watch, type Ref, computed } from 'vue'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useDeviceCapability } from './useDeviceCapability'

export interface ParallaxOptions {
    speed?: number
    direction?: 'vertical' | 'horizontal'
    start?: string
    end?: string
    scrub?: boolean | number
}

export function useParallax(
    elementRef: Ref<HTMLElement | null>,
    options: ParallaxOptions = {}
) {
    const {
        speed = 0.5,
        direction = 'vertical',
        start = 'top bottom',
        end = 'bottom top',
        scrub = true
    } = options

    const { shouldEnableParallax, prefersReducedMotion } = useDeviceCapability()
    let trigger: ScrollTrigger | null = null

    const createParallax = () => {
        if (!elementRef.value || !shouldEnableParallax.value) return

        const distance = 100 * speed
        const axis = direction === 'vertical' ? 'y' : 'x'

        gsap.set(elementRef.value, { [axis]: distance })

        trigger = ScrollTrigger.create({
            trigger: elementRef.value,
            start,
            end,
            scrub,
            onUpdate: (self) => {
                if (elementRef.value) {
                    const value = distance * (1 - self.progress * 2)
                    gsap.set(elementRef.value, { [axis]: value })
                }
            }
        })
    }

    onMounted(() => {
        requestAnimationFrame(() => {
            createParallax()
        })
    })

    onUnmounted(() => {
        trigger?.kill()
    })

    watch(prefersReducedMotion, (reduced) => {
        if (reduced && trigger) {
            trigger.kill()
            if (elementRef.value) {
                gsap.set(elementRef.value, { y: 0, x: 0 })
            }
        } else if (!reduced && !trigger) {
            createParallax()
        }
    })

    return {
        refresh: () => trigger?.refresh()
    }
}

export function useMultiParallax(
    elements: Array<{
        ref: Ref<HTMLElement | null>
        speed: number
        direction?: 'vertical' | 'horizontal'
    }>
) {
    const triggers: ScrollTrigger[] = []
    const { shouldEnableParallax } = useDeviceCapability()

    const createParallaxEffects = () => {
        if (!shouldEnableParallax.value) return

        elements.forEach(({ ref: elementRef, speed, direction = 'vertical' }) => {
            if (!elementRef.value) return

            const distance = 100 * speed
            const axis = direction === 'vertical' ? 'y' : 'x'

            gsap.set(elementRef.value, { [axis]: distance })

            const trigger = ScrollTrigger.create({
                trigger: elementRef.value,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                onUpdate: (self) => {
                    if (elementRef.value) {
                        const value = distance * (1 - self.progress * 2)
                        gsap.set(elementRef.value, { [axis]: value })
                    }
                }
            })

            triggers.push(trigger)
        })
    }

    onMounted(() => {
        requestAnimationFrame(() => {
            createParallaxEffects()
        })
    })

    onUnmounted(() => {
        triggers.forEach((trigger) => trigger.kill())
    })

    return {
        refresh: () => triggers.forEach((trigger) => trigger.refresh())
    }
}

export function useScrollProgress(elementRef: Ref<HTMLElement | null>) {
    const progress = ref(0)
    let trigger: ScrollTrigger | null = null

    const createProgress = () => {
        if (!elementRef.value) return

        trigger = ScrollTrigger.create({
            trigger: elementRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
                progress.value = self.progress
            }
        })
    }

    onMounted(() => {
        requestAnimationFrame(() => {
            createProgress()
        })
    })

    onUnmounted(() => {
        trigger?.kill()
    })

    const transformedProgress = computed(() => ({
        opacity: Math.min(1, progress.value * 2),
        fadeOut: Math.max(0, 1 - (progress.value - 0.5) * 2),
        translateY: (0.5 - progress.value) * -100,
        scale: 0.8 + progress.value * 0.2
    }))

    return {
        progress,
        transformedProgress
    }
}

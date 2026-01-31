import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useScrollStore } from '@/stores/scrollStore'

export interface ScrollAnimationOptions {
    trigger: string | HTMLElement
    start?: string
    end?: string
    scrub?: boolean | number
    pin?: boolean
    markers?: boolean
    onEnter?: () => void
    onLeave?: () => void
    onEnterBack?: () => void
    onLeaveBack?: () => void
    onUpdate?: (self: ScrollTrigger) => void
}

export function useScrollAnimation(options: ScrollAnimationOptions) {
    const progress = ref(0)
    const isInView = ref(false)
    let trigger: ScrollTrigger | null = null

    const createTrigger = () => {
        const {
            trigger: triggerElement,
            start = 'top bottom',
            end = 'bottom top',
            scrub = 1,
            pin = false,
            markers = false,
            onEnter,
            onLeave,
            onEnterBack,
            onLeaveBack,
            onUpdate
        } = options

        trigger = ScrollTrigger.create({
            trigger: triggerElement,
            start,
            end,
            scrub,
            pin,
            markers,
            onEnter: () => {
                isInView.value = true
                onEnter?.()
            },
            onLeave: () => {
                isInView.value = false
                onLeave?.()
            },
            onEnterBack: () => {
                isInView.value = true
                onEnterBack?.()
            },
            onLeaveBack: () => {
                isInView.value = false
                onLeaveBack?.()
            },
            onUpdate: (self) => {
                progress.value = self.progress
                onUpdate?.(self)
            }
        })
    }

    onMounted(() => {
        // Delay initialization to ensure DOM is ready
        requestAnimationFrame(() => {
            createTrigger()
        })
    })

    onUnmounted(() => {
        trigger?.kill()
    })

    return {
        progress,
        isInView,
        refresh: () => trigger?.refresh()
    }
}

export function useScrollTimeline(
    elementRef: Ref<HTMLElement | null>,
    animations: gsap.TweenVars[],
    options: Partial<ScrollAnimationOptions> = {}
) {
    let timeline: gsap.core.Timeline | null = null

    const createTimeline = () => {
        if (!elementRef.value) return

        timeline = gsap.timeline({
            scrollTrigger: {
                trigger: elementRef.value,
                start: options.start || 'top bottom',
                end: options.end || 'bottom top',
                scrub: options.scrub ?? 1,
                markers: options.markers || false
            }
        })

        animations.forEach((animation) => {
            if (elementRef.value) {
                timeline?.to(elementRef.value, animation)
            }
        })
    }

    onMounted(() => {
        requestAnimationFrame(() => {
            createTimeline()
        })
    })

    onUnmounted(() => {
        timeline?.kill()
    })

    return {
        timeline,
        refresh: () => ScrollTrigger.refresh()
    }
}

export function useSectionAnimation(sectionId: string) {
    const scrollStore = useScrollStore()
    const progress = ref(0)

    const { isInView } = useScrollAnimation({
        trigger: `#${sectionId}`,
        start: 'top 80%',
        end: 'bottom 20%',
        onUpdate: (self) => {
            progress.value = self.progress
            scrollStore.setSectionProgress(sectionId, self.progress)
        },
        onEnter: () => {
            scrollStore.setActiveSection(sectionId)
        }
    })

    return {
        progress,
        isInView
    }
}

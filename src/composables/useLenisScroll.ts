import { shallowRef, onMounted, onUnmounted, provide, inject, type InjectionKey, type ShallowRef } from 'vue'
import Lenis from 'lenis'
import { gsap } from '@/lib/gsap'
import { useScrollStore } from '@/stores/scrollStore'

export interface LenisContext {
    lenis: ShallowRef<Lenis | null>
    scrollTo: (target: string | number | HTMLElement, options?: ScrollToOptions) => void
    stop: () => void
    start: () => void
}

interface ScrollToOptions {
    offset?: number
    duration?: number
    easing?: (t: number) => number
    immediate?: boolean
    lock?: boolean
    onComplete?: () => void
}

export const LenisInjectionKey: InjectionKey<LenisContext> = Symbol('lenis')

export function useLenisProvider() {
    const lenis = shallowRef<Lenis | null>(null)
    const scrollStore = useScrollStore()

    const initLenis = () => {
        lenis.value = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
            infinite: false
        })

        // Integrate with GSAP ScrollTrigger
        lenis.value.on('scroll', (e: any) => {
            scrollStore.setScrollY(e.scroll)
            scrollStore.setViewportHeight(window.innerHeight)
            scrollStore.setDocumentHeight(document.documentElement.scrollHeight)
        })

        // Use GSAP ticker for smooth animation frame synchronization
        gsap.ticker.add((time) => {
            lenis.value?.raf(time * 1000)
        })

        gsap.ticker.lagSmoothing(0)
    }

    const scrollTo = (target: string | number | HTMLElement, options?: ScrollToOptions) => {
        lenis.value?.scrollTo(target, options)
    }

    const stop = () => {
        lenis.value?.stop()
    }

    const start = () => {
        lenis.value?.start()
    }

    onMounted(() => {
        initLenis()
    })

    onUnmounted(() => {
        lenis.value?.destroy()
    })

    const context: LenisContext = {
        lenis,
        scrollTo,
        stop,
        start
    }

    provide(LenisInjectionKey, context)

    return context
}

export function useLenisScroll() {
    const context = inject(LenisInjectionKey)

    if (!context) {
        console.warn('useLenisScroll must be used within a LenisProvider')
        return {
            lenis: shallowRef(null),
            scrollTo: () => {},
            stop: () => {},
            start: () => {}
        }
    }

    return context
}

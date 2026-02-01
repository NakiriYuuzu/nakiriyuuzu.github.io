import { ref, computed, watch, onMounted, onUnmounted, shallowRef } from 'vue'
import { useScrollStore } from '@/stores/scrollStore'
import { storeToRefs } from 'pinia'

export type SceneType = 'hero' | 'about' | 'skills' | 'projects' | 'experience' | 'contact'

interface PerformanceMetrics {
    fps: number
    frameTime: number
    memoryUsage: number
    isLowPerformance: boolean
}

// Shared state (singleton pattern)
const currentScene = ref<SceneType>('hero')
const previousScene = ref<SceneType | null>(null)
const isTransitioning = ref(false)
const loadedScenes = shallowRef<Set<SceneType>>(new Set(['hero']))
const performanceMetrics = ref<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    isLowPerformance: false
})

// Use globalThis to persist refs across HMR
declare global {
    var __sceneManagerState: {
        isMobileRef: ReturnType<typeof ref<boolean>>
        prefersReducedMotionRef: ReturnType<typeof ref<boolean>>
        supportsWebGLRef: ReturnType<typeof ref<boolean>>
        isLowPowerModeRef: ReturnType<typeof ref<boolean>>
        mediaQueryListenersSetup: boolean
    } | undefined
}

const getInitialMobile = () => typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 768px)').matches
    : false

const getInitialReducedMotion = () => typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

const getInitialWebGL = () => {
    if (typeof window === 'undefined') return true
    try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        return !!gl
    } catch {
        return false
    }
}

// Initialize or reuse existing state
if (!globalThis.__sceneManagerState) {
    globalThis.__sceneManagerState = {
        isMobileRef: ref(getInitialMobile()),
        prefersReducedMotionRef: ref(getInitialReducedMotion()),
        supportsWebGLRef: ref(getInitialWebGL()),
        isLowPowerModeRef: ref(false),
        mediaQueryListenersSetup: false
    }
}

const { isMobileRef, prefersReducedMotionRef, supportsWebGLRef, isLowPowerModeRef } = globalThis.__sceneManagerState

const setupMediaQueryListeners = () => {
    if (globalThis.__sceneManagerState!.mediaQueryListenersSetup || typeof window === 'undefined') return

    window.matchMedia('(max-width: 768px)').addEventListener('change', (e) => {
        isMobileRef.value = e.matches
    })
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        prefersReducedMotionRef.value = e.matches
    })

    globalThis.__sceneManagerState!.mediaQueryListenersSetup = true
}

let frameCount = 0
let lastFrameTime = performance.now()
let rafId: number | null = null
let isInitialized = false

export function useSceneManager() {
    // Setup media query listeners on first call
    setupMediaQueryListeners()

    const scrollStore = useScrollStore()
    const { activeSection } = storeToRefs(scrollStore)

    // Use shared refs
    const isMobile = isMobileRef
    const prefersReducedMotion = prefersReducedMotionRef
    const supportsWebGL = supportsWebGLRef
    const isLowPowerMode = isLowPowerModeRef

    // Capability checks - scenes are enabled by default on desktop
    const shouldEnableScenes = computed(() => {
        // Always enable on desktop
        if (isMobile.value) return false
        if (performanceMetrics.value.fps > 0 && performanceMetrics.value.fps < 20) return false
        return true
    })

    const shouldEnableRive = computed(() => {
        return !isLowPowerMode.value &&
               !prefersReducedMotion.value &&
               !performanceMetrics.value.isLowPerformance
    })

    const shouldEnableParticles = computed(() => {
        return !isMobile.value &&
               supportsWebGL.value &&
               !prefersReducedMotion.value
    })

    const shouldEnableCodeMatrix = computed(() => {
        return !isMobile.value &&
               !prefersReducedMotion.value &&
               !performanceMetrics.value.isLowPerformance
    })

    // Performance monitoring loop
    const measurePerformance = () => {
        const now = performance.now()
        const delta = now - lastFrameTime
        frameCount++

        if (delta >= 1000) {
            const fps = Math.round((frameCount * 1000) / delta)
            const frameTime = delta / frameCount

            performanceMetrics.value = {
                fps,
                frameTime,
                memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
                isLowPerformance: fps < 30
            }

            frameCount = 0
            lastFrameTime = now
        }

        rafId = requestAnimationFrame(measurePerformance)
    }

    // Scene transition
    const transitionToScene = async (scene: SceneType) => {
        if (currentScene.value === scene || isTransitioning.value) return

        isTransitioning.value = true
        previousScene.value = currentScene.value

        await new Promise(resolve => setTimeout(resolve, 150))

        currentScene.value = scene
        loadedScenes.value = new Set([...loadedScenes.value, scene])

        await new Promise(resolve => setTimeout(resolve, 300))
        isTransitioning.value = false
    }

    // Preload adjacent scenes
    const preloadAdjacentScenes = (scene: SceneType) => {
        const sceneOrder: SceneType[] = ['hero', 'about', 'skills', 'projects', 'experience', 'contact']
        const currentIndex = sceneOrder.indexOf(scene)

        const adjacentScenes = [
            sceneOrder[currentIndex - 1],
            sceneOrder[currentIndex + 1]
        ].filter(Boolean) as SceneType[]

        adjacentScenes.forEach(s => {
            if (!loadedScenes.value.has(s)) {
                loadedScenes.value = new Set([...loadedScenes.value, s])
            }
        })
    }

    // Initialize only once
    if (!isInitialized) {
        isInitialized = true

        // Watch active section changes
        watch(activeSection, (newSection) => {
            const section = newSection as SceneType
            if (section && section !== currentScene.value) {
                transitionToScene(section)
                preloadAdjacentScenes(section)
            }
        })
    }

    // Lifecycle - start performance monitoring
    onMounted(() => {
        console.log('[SceneManager] Mounted')
        console.log('[SceneManager] isMobile:', isMobile.value)
        console.log('[SceneManager] shouldEnableScenes:', shouldEnableScenes.value)

        if (!isMobile.value && !rafId) {
            rafId = requestAnimationFrame(measurePerformance)
        }
    })

    onUnmounted(() => {
        // Don't stop performance monitoring as other components may need it
    })

    // Cleanup method
    const unloadScene = (scene: SceneType) => {
        if (scene !== currentScene.value) {
            const newLoaded = new Set(loadedScenes.value)
            newLoaded.delete(scene)
            loadedScenes.value = newLoaded
        }
    }

    return {
        currentScene,
        previousScene,
        isTransitioning,
        loadedScenes,
        performanceMetrics,
        shouldEnableScenes,
        shouldEnableRive,
        shouldEnableParticles,
        shouldEnableCodeMatrix,
        transitionToScene,
        preloadAdjacentScenes,
        unloadScene
    }
}

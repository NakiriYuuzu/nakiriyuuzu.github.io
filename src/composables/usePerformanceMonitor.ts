import { ref, onMounted, onUnmounted, computed } from 'vue'

interface PerformanceData {
    fps: number
    frameTime: number
    avgFrameTime: number
    memoryUsage: number | null
    isLowPerformance: boolean
    performanceScore: number // 0-100
}

export function usePerformanceMonitor(options: {
    targetFPS?: number
    sampleSize?: number
    autoDegrade?: boolean
} = {}) {
    const {
        targetFPS = 60,
        sampleSize = 60,
        autoDegrade = true
    } = options

    const performanceData = ref<PerformanceData>({
        fps: targetFPS,
        frameTime: 1000 / targetFPS,
        avgFrameTime: 1000 / targetFPS,
        memoryUsage: null,
        isLowPerformance: false,
        performanceScore: 100
    })

    const frameTimes: number[] = []
    let lastFrameTime = 0
    let frameCount = 0
    let lastSecondTime = 0
    let rafId: number | null = null
    let isMonitoring = false

    // Performance thresholds
    const LOW_FPS_THRESHOLD = 30
    const CRITICAL_FPS_THRESHOLD = 20

    const calculatePerformanceScore = (fps: number): number => {
        if (fps >= targetFPS) return 100
        if (fps <= CRITICAL_FPS_THRESHOLD) return 0
        return Math.round((fps / targetFPS) * 100)
    }

    const measureFrame = (currentTime: number) => {
        if (!isMonitoring) return

        if (lastFrameTime > 0) {
            const frameTime = currentTime - lastFrameTime
            frameTimes.push(frameTime)

            if (frameTimes.length > sampleSize) {
                frameTimes.shift()
            }
        }

        lastFrameTime = currentTime
        frameCount++

        // Calculate FPS every second
        if (currentTime - lastSecondTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastSecondTime))
            const avgFrameTime = frameTimes.length > 0
                ? frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
                : 1000 / targetFPS

            // Get memory usage if available
            const memory = (performance as any).memory
            const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : null

            const isLowPerformance = fps < LOW_FPS_THRESHOLD
            const performanceScore = calculatePerformanceScore(fps)

            performanceData.value = {
                fps,
                frameTime: frameTimes[frameTimes.length - 1] || 1000 / targetFPS,
                avgFrameTime,
                memoryUsage,
                isLowPerformance,
                performanceScore
            }

            // Log warning if performance is degraded
            if (autoDegrade && fps < CRITICAL_FPS_THRESHOLD) {
                console.warn(`[PerformanceMonitor] Critical FPS: ${fps}. Consider reducing visual complexity.`)
            }

            frameCount = 0
            lastSecondTime = currentTime
        }

        rafId = requestAnimationFrame(measureFrame)
    }

    const startMonitoring = () => {
        if (isMonitoring) return

        isMonitoring = true
        lastFrameTime = 0
        frameCount = 0
        lastSecondTime = performance.now()
        frameTimes.length = 0

        rafId = requestAnimationFrame(measureFrame)
    }

    const stopMonitoring = () => {
        isMonitoring = false
        if (rafId) {
            cancelAnimationFrame(rafId)
            rafId = null
        }
    }

    // Computed helpers
    const shouldReduceEffects = computed(() => {
        return performanceData.value.performanceScore < 60
    })

    const shouldDisableAnimations = computed(() => {
        return performanceData.value.performanceScore < 30
    })

    const recommendedParticleMultiplier = computed(() => {
        const score = performanceData.value.performanceScore
        if (score >= 80) return 1
        if (score >= 60) return 0.7
        if (score >= 40) return 0.5
        return 0.3
    })

    onMounted(() => {
        startMonitoring()
    })

    onUnmounted(() => {
        stopMonitoring()
    })

    return {
        performanceData,
        shouldReduceEffects,
        shouldDisableAnimations,
        recommendedParticleMultiplier,
        startMonitoring,
        stopMonitoring
    }
}

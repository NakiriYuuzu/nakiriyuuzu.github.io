import { ref, computed, onMounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'

export function useDeviceCapability() {
    const isMobile = useMediaQuery('(max-width: 768px)')
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
    const supportsWebGL = ref(false)
    const devicePixelRatio = ref(1)
    const isLowPowerMode = ref(false)

    const checkWebGLSupport = () => {
        try {
            const canvas = document.createElement('canvas')
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            supportsWebGL.value = !!gl
        } catch {
            supportsWebGL.value = false
        }
    }

    const checkDeviceCapabilities = () => {
        devicePixelRatio.value = window.devicePixelRatio || 1

        // Detect low-power mode through battery API or performance hints
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                isLowPowerMode.value = battery.level < 0.2 && !battery.charging
            }).catch(() => {
                // Battery API not available
            })
        }
    }

    onMounted(() => {
        checkWebGLSupport()
        checkDeviceCapabilities()
    })

    const shouldEnable3D = computed(() => {
        return (
            !isMobile.value &&
            !prefersReducedMotion.value &&
            supportsWebGL.value &&
            !isLowPowerMode.value
        )
    })

    const shouldEnableParallax = computed(() => {
        return !prefersReducedMotion.value
    })

    const recommendedParticleCount = computed(() => {
        if (isMobile.value || isLowPowerMode.value) return 100
        if (devicePixelRatio.value > 2) return 300
        return 500
    })

    return {
        isMobile,
        prefersReducedMotion,
        supportsWebGL,
        devicePixelRatio,
        isLowPowerMode,
        shouldEnable3D,
        shouldEnableParallax,
        recommendedParticleCount
    }
}

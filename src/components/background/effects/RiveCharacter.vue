<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useSceneManager } from '@/composables/useSceneManager'

const props = withDefaults(defineProps<{
    src: string
    stateMachine?: string
    artboard?: string
    autoplay?: boolean
    fit?: 'contain' | 'cover' | 'fill' | 'none'
    alignment?: 'center' | 'topLeft' | 'topCenter' | 'topRight' | 'centerLeft' | 'centerRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight'
}>(), {
    stateMachine: 'State Machine 1',
    autoplay: true,
    fit: 'contain',
    alignment: 'center'
})

const emit = defineEmits<{
    load: []
    error: [error: Error]
    stateChange: [stateName: string]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')
const { shouldEnableRive } = useSceneManager()

let rive: any = null
let riveInstance: any = null

const loadRive = async () => {
    if (!shouldEnableRive.value || !canvasRef.value) return

    try {
        isLoading.value = true
        hasError.value = false

        // Dynamic import Rive
        const { Rive, Fit, Alignment, Layout } = await import('@rive-app/canvas')

        // Map fit and alignment props
        const fitMap: Record<string, any> = {
            contain: Fit.Contain,
            cover: Fit.Cover,
            fill: Fit.Fill,
            none: Fit.None
        }

        const alignmentMap: Record<string, any> = {
            center: Alignment.Center,
            topLeft: Alignment.TopLeft,
            topCenter: Alignment.TopCenter,
            topRight: Alignment.TopRight,
            centerLeft: Alignment.CenterLeft,
            centerRight: Alignment.CenterRight,
            bottomLeft: Alignment.BottomLeft,
            bottomCenter: Alignment.BottomCenter,
            bottomRight: Alignment.BottomRight
        }

        riveInstance = new Rive({
            src: props.src,
            canvas: canvasRef.value,
            autoplay: props.autoplay,
            stateMachines: props.stateMachine,
            artboard: props.artboard,
            layout: new Layout({
                fit: fitMap[props.fit],
                alignment: alignmentMap[props.alignment]
            }),
            onLoad: () => {
                isLoading.value = false
                emit('load')
                resize()
            },
            onStateChange: (event: any) => {
                emit('stateChange', event.data[0])
            }
        })

        rive = riveInstance

    } catch (error) {
        console.error('[RiveCharacter] Failed to load:', error)
        hasError.value = true
        errorMessage.value = error instanceof Error ? error.message : 'Failed to load Rive animation'
        isLoading.value = false
        emit('error', error instanceof Error ? error : new Error('Unknown error'))
    }
}

const resize = () => {
    if (!canvasRef.value || !riveInstance) return

    const canvas = canvasRef.value
    const parent = canvas.parentElement
    if (!parent) return

    const dpr = window.devicePixelRatio || 1
    const width = parent.clientWidth
    const height = parent.clientHeight

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    riveInstance.resizeDrawingSurfaceToCanvas()
}

// Public methods for controlling animation
const play = (animationName?: string) => {
    if (riveInstance) {
        riveInstance.play(animationName)
    }
}

const pause = () => {
    if (riveInstance) {
        riveInstance.pause()
    }
}

const setInput = (inputName: string, value: boolean | number) => {
    if (riveInstance) {
        const inputs = riveInstance.stateMachineInputs(props.stateMachine)
        const input = inputs?.find((i: any) => i.name === inputName)
        if (input) {
            input.value = value
        }
    }
}

const fireInput = (inputName: string) => {
    if (riveInstance) {
        const inputs = riveInstance.stateMachineInputs(props.stateMachine)
        const input = inputs?.find((i: any) => i.name === inputName)
        if (input && input.fire) {
            input.fire()
        }
    }
}

// Expose methods
defineExpose({
    play,
    pause,
    setInput,
    fireInput
})

onMounted(() => {
    loadRive()
    window.addEventListener('resize', resize)
})

onUnmounted(() => {
    if (riveInstance) {
        riveInstance.cleanup()
    }
    window.removeEventListener('resize', resize)
})

// Reload when src changes
watch(() => props.src, () => {
    if (riveInstance) {
        riveInstance.cleanup()
    }
    loadRive()
})
</script>

<template>
    <div class="rive-character">
        <!-- Loading State -->
        <div v-if="isLoading" class="rive-loading">
            <div class="rive-loading__spinner" />
        </div>

        <!-- Error State -->
        <div v-if="hasError" class="rive-error">
            <div class="rive-error__icon">⚠️</div>
            <p class="rive-error__message">{{ errorMessage }}</p>
        </div>

        <!-- Rive Canvas -->
        <canvas
            v-show="!isLoading && !hasError && shouldEnableRive"
            ref="canvasRef"
            class="rive-canvas"
        />

        <!-- Fallback for disabled Rive -->
        <div v-if="!shouldEnableRive && !hasError" class="rive-fallback">
            <slot name="fallback" />
        </div>
    </div>
</template>

<style scoped>
.rive-character {
    position: relative;
    width: 100%;
    height: 100%;
}

.rive-canvas {
    display: block;
    width: 100%;
    height: 100%;
}

.rive-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.rive-loading__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(34, 197, 94, 0.2);
    border-top-color: #22C55E;
    border-radius: 50%;
    animation: rive-spin 1s linear infinite;
}

@keyframes rive-spin {
    to {
        transform: rotate(360deg);
    }
}

.rive-error {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: var(--color-text-muted, #64748B);
}

.rive-error__icon {
    font-size: 2rem;
}

.rive-error__message {
    font-size: 0.875rem;
    text-align: center;
    max-width: 200px;
}

.rive-fallback {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (prefers-reduced-motion: reduce) {
    .rive-loading__spinner {
        animation: none;
        border-color: #22C55E;
    }
}
</style>

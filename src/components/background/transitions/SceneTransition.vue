<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
    isActive: boolean
    direction?: 'in' | 'out'
}>()

const emit = defineEmits<{
    complete: []
}>()

const transitionRef = ref<HTMLDivElement | null>(null)
const isAnimating = ref(false)

watch(() => props.isActive, (active) => {
    if (active) {
        startTransition()
    }
})

const startTransition = () => {
    isAnimating.value = true

    // Emit complete after animation
    setTimeout(() => {
        isAnimating.value = false
        emit('complete')
    }, 600)
}
</script>

<template>
    <div
        ref="transitionRef"
        class="scene-transition"
        :class="{
            'is-animating': isAnimating,
            'direction-in': direction === 'in',
            'direction-out': direction === 'out'
        }"
    >
        <!-- Wipe effect bars -->
        <div class="transition-bars">
            <div
                v-for="i in 5"
                :key="i"
                class="transition-bar"
                :style="{ '--bar-delay': `${(i - 1) * 0.08}s` }"
            />
        </div>

        <!-- Center glow -->
        <div class="transition-glow" />
    </div>
</template>

<style scoped>
.scene-transition {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
}

.scene-transition.is-animating {
    opacity: 1;
    visibility: visible;
}

/* Transition Bars */
.transition-bars {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.transition-bar {
    flex: 1;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(34, 197, 94, 0.1) 20%,
        rgba(59, 130, 246, 0.15) 50%,
        rgba(139, 92, 246, 0.1) 80%,
        transparent 100%
    );
    transform: scaleX(0);
    transform-origin: left;
    animation-delay: var(--bar-delay);
}

.is-animating .transition-bar {
    animation: bar-sweep 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes bar-sweep {
    0% {
        transform: scaleX(0);
        transform-origin: left;
    }
    50% {
        transform: scaleX(1);
    }
    100% {
        transform: scaleX(0);
        transform-origin: right;
    }
}

/* Center Glow */
.transition-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    transform: translate(-50%, -50%) scale(0);
    background: radial-gradient(
        circle,
        rgba(34, 197, 94, 0.3) 0%,
        rgba(59, 130, 246, 0.2) 40%,
        transparent 70%
    );
    border-radius: 50%;
    filter: blur(40px);
}

.is-animating .transition-glow {
    animation: glow-pulse 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes glow-pulse {
    0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    }
    50% {
        transform: translate(-50%, -50%) scale(3);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) scale(4);
        opacity: 0;
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .is-animating .transition-bar,
    .is-animating .transition-glow {
        animation: none;
    }

    .scene-transition.is-animating {
        opacity: 0.5;
    }
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useScrollStore } from '@/stores/scrollStore'
import { storeToRefs } from 'pinia'

const scrollStore = useScrollStore()
const { sectionProgress } = storeToRefs(scrollStore)

const contactProgress = computed(() => sectionProgress.value['contact'] || 0)

// Ripple effect data
interface Ripple {
    id: number
    x: number
    y: number
    scale: number
    opacity: number
}

const ripples = ref<Ripple[]>([])
let rippleId = 0

const createRipple = (x: number, y: number) => {
    const newRipple: Ripple = {
        id: rippleId++,
        x,
        y,
        scale: 0,
        opacity: 0.5
    }
    ripples.value.push(newRipple)

    // Remove ripple after animation
    setTimeout(() => {
        ripples.value = ripples.value.filter(r => r.id !== newRipple.id)
    }, 2000)
}

// Auto-create ripples
let rippleInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
    rippleInterval = setInterval(() => {
        const x = 20 + Math.random() * 60
        const y = 20 + Math.random() * 60
        createRipple(x, y)
    }, 3000)
})

onUnmounted(() => {
    if (rippleInterval) {
        clearInterval(rippleInterval)
    }
})

// Scene opacity
const sceneOpacity = computed(() => {
    const progress = contactProgress.value
    if (progress < 0.1) return progress * 10
    return 1
})
</script>

<template>
    <div class="contact-scene" :style="{ opacity: sceneOpacity }">
        <!-- Ripple Effects -->
        <div class="contact-ripples">
            <div
                v-for="ripple in ripples"
                :key="ripple.id"
                class="contact-ripple"
                :style="{
                    '--x': `${ripple.x}%`,
                    '--y': `${ripple.y}%`
                }"
            />
        </div>

        <!-- Connection Lines (email/message visual) -->
        <svg class="contact-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="contactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.3" />
                    <stop offset="50%" stop-color="#22C55E" stop-opacity="0.4" />
                    <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.3" />
                </linearGradient>
            </defs>

            <!-- Envelope shape outline -->
            <path
                class="contact-envelope"
                d="M20,30 L50,50 L80,30 M20,30 L20,70 L80,70 L80,30 Z"
                stroke="url(#contactGradient)"
                fill="none"
                stroke-width="0.3"
            />

            <!-- Flying message lines -->
            <path
                class="contact-message contact-message--1"
                d="M10,80 Q30,50 50,50"
                stroke="#22C55E"
                fill="none"
                stroke-width="0.2"
            />
            <path
                class="contact-message contact-message--2"
                d="M50,50 Q70,50 90,20"
                stroke="#3B82F6"
                fill="none"
                stroke-width="0.2"
            />
        </svg>

        <!-- Ambient Orbs -->
        <div class="contact-orbs">
            <div class="contact-orb contact-orb--1" />
            <div class="contact-orb contact-orb--2" />
        </div>

        <!-- Success Particles (for form submission feedback) -->
        <div class="contact-success-particles" />

        <!-- Gradient Overlay -->
        <div class="contact-gradient" />
    </div>
</template>

<style scoped>
.contact-scene {
    position: absolute;
    inset: 0;
    overflow: hidden;
    transition: opacity 0.5s ease;
}

/* Ripple Effects */
.contact-ripples {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.contact-ripple {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: 200px;
    height: 200px;
    transform: translate(-50%, -50%);
    border: 2px solid rgba(34, 197, 94, 0.3);
    border-radius: 50%;
    animation: ripple-expand 2s ease-out forwards;
}

@keyframes ripple-expand {
    0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0.5;
    }
    100% {
        transform: translate(-50%, -50%) scale(3);
        opacity: 0;
    }
}

/* Connection SVG */
.contact-connections {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.contact-envelope {
    stroke-dasharray: 300;
    stroke-dashoffset: 300;
    animation: draw-envelope 3s ease forwards;
}

@keyframes draw-envelope {
    to {
        stroke-dashoffset: 0;
    }
}

.contact-message {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    opacity: 0.5;
}

.contact-message--1 {
    animation: fly-message 4s ease-in-out infinite;
    animation-delay: 1s;
}

.contact-message--2 {
    animation: fly-message 4s ease-in-out infinite;
    animation-delay: 2.5s;
}

@keyframes fly-message {
    0%, 100% {
        stroke-dashoffset: 100;
        opacity: 0;
    }
    20% {
        opacity: 0.5;
    }
    50% {
        stroke-dashoffset: 0;
        opacity: 0.5;
    }
    80% {
        opacity: 0;
    }
}

/* Ambient Orbs */
.contact-orbs {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.contact-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.3;
}

.contact-orb--1 {
    width: 300px;
    height: 300px;
    background: #3B82F6;
    top: 20%;
    right: 10%;
    animation: orb-float 15s ease-in-out infinite;
}

.contact-orb--2 {
    width: 250px;
    height: 250px;
    background: #22C55E;
    bottom: 20%;
    left: 15%;
    animation: orb-float 15s ease-in-out infinite 7s;
}

@keyframes orb-float {
    0%, 100% {
        transform: translate(0, 0);
    }
    33% {
        transform: translate(30px, -20px);
    }
    66% {
        transform: translate(-20px, 30px);
    }
}

/* Success Particles Container */
.contact-success-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

/* Gradient Overlay */
.contact-gradient {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(at 70% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(at 30% 70%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
        linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.3) 100%);
    pointer-events: none;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .contact-ripple {
        animation: none;
        opacity: 0;
    }

    .contact-envelope {
        animation: none;
        stroke-dashoffset: 0;
    }

    .contact-message {
        animation: none;
        stroke-dashoffset: 0;
        opacity: 0.3;
    }

    .contact-orb {
        animation: none;
    }
}
</style>

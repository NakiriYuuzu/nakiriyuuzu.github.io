<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useScrollStore } from '@/stores/scrollStore'
import { storeToRefs } from 'pinia'
import { useSceneManager } from '@/composables/useSceneManager'
import ParticleSystem from '../effects/ParticleSystem.vue'

const scrollStore = useScrollStore()
const { sectionProgress } = storeToRefs(scrollStore)
const { shouldEnableParticles } = useSceneManager()

// Debug
onMounted(() => {
    console.log('[HeroScene] Mounted - shouldEnableParticles:', shouldEnableParticles.value)
})

const heroProgress = computed(() => sectionProgress.value['hero'] || 0)

// Code symbols for particles
const codeSymbols = ['</', '/>', '{', '}', '()', '=>', '[]', '::']

// Dynamic opacity based on scroll
const sceneOpacity = computed(() => {
    const progress = heroProgress.value
    return 1 - progress * 0.5
})

// Rive animation state
const riveRef = ref<any>(null)
const isRiveLoaded = ref(false)

const handleRiveLoad = () => {
    isRiveLoaded.value = true
}

// Scroll-triggered animation
const handleScroll = () => {
    if (riveRef.value && heroProgress.value > 0.2) {
        // Trigger wave animation when user scrolls
        riveRef.value?.fireInput?.('wave')
    }
}

onMounted(() => {
    // Set up scroll trigger
    const checkScroll = () => {
        if (heroProgress.value > 0.2 && heroProgress.value < 0.5) {
            handleScroll()
        }
    }

    // Watch for scroll changes
    const unwatch = scrollStore.$subscribe(() => {
        checkScroll()
    })

    return () => {
        unwatch()
    }
})
</script>

<template>
    <div class="hero-scene" :style="{ opacity: sceneOpacity }">
        <!-- Floating Code Particles -->
        <ParticleSystem
            v-if="shouldEnableParticles"
            :count="60"
            :colors="['#22C55E', '#3B82F6', '#8B5CF6']"
            :symbols="codeSymbols"
            :speed="0.5"
            :size-range="[12, 24]"
        />

        <!-- Ambient Glow Orbs -->
        <div class="hero-orbs">
            <div class="hero-orb hero-orb--green" />
            <div class="hero-orb hero-orb--blue" />
            <div class="hero-orb hero-orb--purple" />
        </div>

        <!-- Gradient Mesh -->
        <div class="hero-mesh" />

        <!-- Grid Pattern Overlay -->
        <div class="hero-grid" />
    </div>
</template>

<style scoped>
.hero-scene {
    position: absolute;
    inset: 0;
    overflow: hidden;
    transition: opacity 0.5s ease;
}

/* Ambient Orbs */
.hero-orbs {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.7;
    animation: orb-drift 20s ease-in-out infinite;
}

.hero-orb--green {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, #22C55E 0%, transparent 60%);
    top: -5%;
    left: 5%;
    animation-delay: 0s;
}

.hero-orb--blue {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #3B82F6 0%, transparent 60%);
    top: 30%;
    right: 5%;
    animation-delay: -8s;
}

.hero-orb--purple {
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, #8B5CF6 0%, transparent 60%);
    bottom: 5%;
    left: 40%;
    animation-delay: -16s;
}

@keyframes orb-drift {
    0%, 100% {
        transform: translate(0, 0) scale(1);
    }
    25% {
        transform: translate(50px, -30px) scale(1.1);
    }
    50% {
        transform: translate(-30px, 50px) scale(0.9);
    }
    75% {
        transform: translate(30px, 30px) scale(1.05);
    }
}

/* Gradient Mesh Background */
.hero-mesh {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(at 40% 20%, rgba(34, 197, 94, 0.1) 0px, transparent 50%),
        radial-gradient(at 80% 0%, rgba(59, 130, 246, 0.08) 0px, transparent 50%),
        radial-gradient(at 0% 50%, rgba(139, 92, 246, 0.08) 0px, transparent 50%),
        radial-gradient(at 80% 50%, rgba(34, 197, 94, 0.05) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.06) 0px, transparent 50%);
    pointer-events: none;
}

/* Grid Pattern */
.hero-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    pointer-events: none;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .hero-orb {
        animation: none;
    }
}
</style>

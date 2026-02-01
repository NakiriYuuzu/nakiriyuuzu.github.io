<script setup lang="ts">
import { computed, defineAsyncComponent, Suspense, onMounted, ref } from 'vue'
import { useSceneManager, type SceneType } from '@/composables/useSceneManager'

const {
    currentScene,
    isTransitioning,
    shouldEnableScenes,
    loadedScenes
} = useSceneManager()

// Use a local ref that syncs with shouldEnableScenes
// Initialize with direct check to avoid HMR reactivity issues
const isEnabled = ref(typeof window !== 'undefined' && !window.matchMedia('(max-width: 768px)').matches)

// Sync with the computed from useSceneManager once mounted
onMounted(() => {
    isEnabled.value = shouldEnableScenes.value
})

// Lazy load scene components
const sceneComponents: Record<SceneType, ReturnType<typeof defineAsyncComponent>> = {
    hero: defineAsyncComponent(() => import('./scenes/HeroScene.vue')),
    about: defineAsyncComponent(() => import('./scenes/AboutScene.vue')),
    skills: defineAsyncComponent(() => import('./scenes/SkillsScene.vue')),
    projects: defineAsyncComponent(() => import('./scenes/ProjectsScene.vue')),
    experience: defineAsyncComponent(() => import('./scenes/ExperienceScene.vue')),
    contact: defineAsyncComponent(() => import('./scenes/ContactScene.vue'))
}

const currentSceneComponent = computed(() => {
    if (!isEnabled.value) return null
    return sceneComponents[currentScene.value]
})

// Determine which scenes should be rendered (for preloading)
const visibleScenes = computed(() => {
    if (!isEnabled.value) return []
    return Array.from(loadedScenes.value)
})
</script>

<template>
    <div
        v-if="isEnabled"
        class="scene-background"
        :class="{ 'is-transitioning': isTransitioning }"
    >
        <!-- Scene Container with Transition -->
        <Suspense>
            <template #default>
                <Transition name="scene-fade" mode="out-in">
                    <component
                        :is="currentSceneComponent"
                        v-if="currentSceneComponent"
                        :key="currentScene"
                        class="scene-layer"
                    />
                </Transition>
            </template>

            <template #fallback>
                <div class="scene-loading">
                    <div class="scene-loading__spinner" />
                </div>
            </template>
        </Suspense>

        <!-- Gradient Overlay for smooth blending -->
        <div class="scene-overlay" />
    </div>

    <!-- Fallback for mobile/low-performance -->
    <div v-if="!isEnabled" class="scene-fallback">
        <div class="scene-fallback__gradient" />
    </div>
</template>

<style scoped>
.scene-background {
    position: fixed;
    inset: 0;
    z-index: -3;
    pointer-events: none;
    overflow: hidden;
    will-change: opacity;
}

.scene-background.is-transitioning {
    /* Transition state handled by child animations */
}

.scene-layer {
    position: absolute;
    inset: 0;
}

/* Scene Transition Animation */
.scene-fade-enter-active,
.scene-fade-leave-active {
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.scene-fade-enter-from,
.scene-fade-leave-to {
    opacity: 0;
}

/* Loading Spinner */
.scene-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
}

.scene-loading__spinner {
    width: 32px;
    height: 32px;
    border: 2px solid rgba(34, 197, 94, 0.2);
    border-top-color: #22C55E;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Overlay for blending with content */
.scene-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        transparent 0%,
        rgba(15, 23, 42, 0.1) 50%,
        rgba(15, 23, 42, 0.3) 100%
    );
    pointer-events: none;
}

/* Mobile/Low-performance Fallback */
.scene-fallback {
    position: fixed;
    inset: 0;
    z-index: -3;
    pointer-events: none;
}

.scene-fallback__gradient {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse at 20% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 30%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 80%, rgba(139, 92, 246, 0.10) 0%, transparent 50%);
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .scene-fade-enter-active,
    .scene-fade-leave-active {
        transition: none;
    }

    .scene-loading__spinner {
        animation: none;
        border-color: #22C55E;
    }
}
</style>

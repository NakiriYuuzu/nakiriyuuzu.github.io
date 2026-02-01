<script setup lang="ts">
import Navigation from '@/components/layout/Navigation.vue'
import Footer from '@/components/layout/Footer.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import LenisProvider from '@/components/animation/LenisProvider.vue'
import ThreeCanvas from '@/components/three/ThreeCanvas.vue'
import DavinciLines from '@/components/background/DavinciLines.vue'
import SceneBackground from '@/components/background/SceneBackground.vue'
import { useDeviceCapability } from '@/composables/useDeviceCapability'

const { shouldEnable3D } = useDeviceCapability()
</script>

<template>
    <LenisProvider>
        <div class="min-h-screen relative bg-bg-primary">
            <!-- Scene Background (Section-specific scenes, z-index: -3) -->
            <SceneBackground />

            <!-- DaVinci Lines Background (SVG perspective lines, z-index: -2) -->
            <DavinciLines />

            <!-- 3D Background - FloatingOrbs only (z-index: -1, conditional rendering) -->
            <ThreeCanvas v-if="shouldEnable3D" />

            <Navigation />

            <main>
                <HeroSection />
                <AboutSection />
                <SkillsSection />
                <ProjectsSection />
                <ExperienceSection />
                <ContactSection />
            </main>

            <Footer />
        </div>
    </LenisProvider>
</template>

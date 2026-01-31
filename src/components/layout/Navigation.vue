<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Menu, X, ArrowRight } from 'lucide-vue-next'
import { useScrollStore } from '@/stores/scrollStore'
import { useLenisScroll } from '@/composables/useLenisScroll'
import { storeToRefs } from 'pinia'

const scrollStore = useScrollStore()
const { normalizedProgress, activeSection } = storeToRefs(scrollStore)
const { scrollTo } = useLenisScroll()

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)

const scrollProgress = computed(() => normalizedProgress.value)

const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' }
]

const scrollToTop = (event: Event) => {
    event.preventDefault()
    scrollTo(0, { duration: 1.2 })
}

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleNavClick = (event: Event, href: string) => {
    event.preventDefault()
    scrollTo(href, { duration: 1.2, offset: -80 })
}

const handleMobileNavClick = (event: Event, href: string) => {
    handleNavClick(event, href)
    isMobileMenuOpen.value = false
}

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <div>
        <!-- Scroll Progress Bar -->
        <div class="scroll-progress-container">
            <div
                class="scroll-progress-bar"
                :style="{ transform: `scaleX(${scrollProgress})` }"
            ></div>
        </div>

        <header class="nav-floating" :class="{ scrolled: isScrolled }">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-[72px]">
                    <!-- Logo -->
                    <a href="#" class="flex items-center gap-3 group" @click="scrollToTop">
                        <div class="logo-icon">
                            <span class="text-bg-primary font-heading font-bold text-lg">Y</span>
                        </div>
                        <span class="font-heading font-semibold text-lg hidden sm:block text-text-primary group-hover:text-accent transition-colors">
                            Yuuzu
                        </span>
                    </a>

                    <!-- Desktop Navigation -->
                    <div class="hidden md:flex items-center gap-8">
                        <a
                            v-for="item in navItems"
                            :key="item.href"
                            :href="item.href"
                            class="nav-link"
                            :class="{ active: activeSection === item.href.slice(1) }"
                            @click="(e) => handleNavClick(e, item.href)"
                        >
                            {{ item.label }}
                        </a>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-3">
                        <!-- Contact CTA Button (Desktop) -->
                        <a
                            href="#contact"
                            class="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg-primary rounded-full font-medium hover:bg-accent/90 transition-all hover:gap-3 hover:shadow-lg hover:shadow-accent/20"
                            @click="(e) => handleNavClick(e, '#contact')"
                        >
                            <span>Contact Me</span>
                            <ArrowRight class="w-4 h-4" />
                        </a>

                        <!-- Mobile Menu Button -->
                        <button
                            class="btn-icon md:hidden"
                            aria-label="Toggle menu"
                            @click="toggleMobileMenu"
                        >
                            <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" />
                            <X v-else class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <!-- Mobile Navigation -->
                <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <div
                        v-if="isMobileMenuOpen"
                        class="md:hidden py-4 border-t border-border"
                    >
                        <div class="flex flex-col gap-1">
                            <a
                                v-for="item in navItems"
                                :key="item.href"
                                :href="item.href"
                                class="mobile-nav-link"
                                :class="{ active: activeSection === item.href.slice(1) }"
                                @click="(e) => handleMobileNavClick(e, item.href)"
                            >
                                <span class="mobile-nav-indicator"></span>
                                <span>{{ item.label }}</span>
                            </a>
                            <a
                                href="#contact"
                                class="mt-4 w-full text-center px-6 py-3 bg-accent text-bg-primary rounded-full font-medium"
                                @click="(e) => handleMobileNavClick(e, '#contact')"
                            >
                                Get in Touch
                            </a>
                        </div>
                    </div>
                </Transition>
            </nav>
        </header>
    </div>
</template>

<style scoped>
/* Scroll Progress Container */
.scroll-progress-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: transparent;
    z-index: 200;
}

.scroll-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary));
    transform-origin: left;
    transition: transform 50ms linear;
}

/* Logo Icon */
.logo-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--duration-normal) var(--ease-out);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.group:hover .logo-icon {
    transform: scale(1.05);
}

/* Nav Link */
.nav-link {
    position: relative;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    transition: color var(--duration-fast) ease;
    cursor: pointer;
    text-decoration: none;
}

.nav-link:hover {
    color: var(--color-text-primary);
}

.nav-link.active {
    color: var(--color-accent);
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary));
    transition: width var(--duration-normal) var(--ease-out);
}

.nav-link:hover::after,
.nav-link.active::after {
    width: 100%;
}

/* Mobile Nav Link */
.mobile-nav-link {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    border-radius: var(--radius);
    transition: all var(--duration-fast) ease;
    text-decoration: none;
}

.mobile-nav-link:hover {
    color: var(--color-text-primary);
    background: var(--color-bg-secondary);
}

.mobile-nav-link.active {
    color: var(--color-text-primary);
    background: var(--color-bg-secondary);
}

.mobile-nav-indicator {
    width: 4px;
    height: 4px;
    background: var(--color-border);
    border-radius: 50%;
    transition: all var(--duration-normal) var(--ease-out);
}

.mobile-nav-link:hover .mobile-nav-indicator,
.mobile-nav-link.active .mobile-nav-indicator {
    width: 8px;
    background: var(--color-accent);
}

.mobile-nav-link.active .mobile-nav-indicator {
    width: 20px;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary));
}
</style>

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
            <nav class="px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <!-- Logo -->
                    <a
                        href="#"
                        class="logo-text headline-4 text-foreground hover:text-accent transition-colors"
                    >
                        Yuuzu
                    </a>

                    <!-- Desktop Navigation -->
                    <div class="hidden md:flex items-center gap-1">
                        <a
                            v-for="item in navItems"
                            :key="item.href"
                            :href="item.href"
                            class="nav-link-enhanced"
                            :class="{ active: activeSection === item.href.slice(1) }"
                            @click="smoothScroll"
                        >
                            <span class="nav-link-text">{{ item.label }}</span>
                            <span class="nav-link-indicator"></span>
                        </a>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-3">
                        <!-- Theme Toggle with Animation -->
                        <button
                            class="theme-toggle"
                            aria-label="Toggle theme"
                            @click="toggleTheme"
                        >
                            <div class="theme-toggle-inner" :class="{ 'is-dark': isDark }">
                                <Sun class="theme-icon sun-icon" />
                                <Moon class="theme-icon moon-icon" />
                            </div>
                        </button>

                        <!-- Mobile Menu Button -->
                        <button
                            class="btn-icon md:hidden"
                            aria-label="Toggle menu"
                            @click="toggleMobileMenu"
                        >
                            <Menu v-if="!isMobileMenuOpen" class="w-4 h-4" />
                            <X v-else class="w-4 h-4" />
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
                                @click="handleMobileNavClick"
                            >
                                <span class="mobile-nav-indicator"></span>
                                <span>{{ item.label }}</span>
                            </a>
                        </div>
                    </div>
                </Transition>
            </nav>
        </header>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Sun, Moon, Menu, X } from 'lucide-vue-next'
import { useScrollProgress } from '@/composables/useScrollProgress'

const isDark = ref(false)
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const activeSection = ref('')

// Scroll progress
const { progress } = useScrollProgress()
const scrollProgress = computed(() => progress.value)

const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' }
]

const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const smoothScroll = (event: Event) => {
    event.preventDefault()
    const target = event.target as HTMLAnchorElement
    const href = target.getAttribute('href') || target.closest('a')?.getAttribute('href')
    if (href) {
        const element = document.querySelector(href)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }
}

const handleMobileNavClick = (event: Event) => {
    smoothScroll(event)
    isMobileMenuOpen.value = false
}

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50

    // Update active section
    const sections = navItems.map((item) => item.href.slice(1))
    for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
            const rect = element.getBoundingClientRect()
            if (rect.top <= 150) {
                activeSection.value = section
                break
            }
        }
    }
}

onMounted(() => {
    // Theme initialization - System Preference by default
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme) {
        isDark.value = savedTheme === 'dark'
    } else {
        isDark.value = prefersDark
    }

    document.documentElement.classList.toggle('dark', isDark.value)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) {
            isDark.value = e.matches
            document.documentElement.classList.toggle('dark', isDark.value)
        }
    }
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // Scroll listener
    window.addEventListener('scroll', handleScroll)
    handleScroll()
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

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
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-purple));
    transform-origin: left;
    transition: transform 50ms linear;
}

/* Logo */
.logo-text {
    position: relative;
}

.logo-text::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-purple));
    transition: width 0.3s var(--ease-shopify);
}

.logo-text:hover::after {
    width: 100%;
}

/* Enhanced Nav Link */
.nav-link-enhanced {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-muted-foreground);
    transition: color var(--duration-fast) ease;
    cursor: pointer;
    text-decoration: none;
}

.nav-link-enhanced:hover {
    color: var(--color-foreground);
}

.nav-link-enhanced.active {
    color: var(--color-foreground);
}

.nav-link-text {
    position: relative;
    z-index: 1;
}

/* Nav Link Indicator */
.nav-link-indicator {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background: var(--color-accent-purple);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.3s var(--ease-shopify);
}

.nav-link-enhanced:hover .nav-link-indicator,
.nav-link-enhanced.active .nav-link-indicator {
    opacity: 1;
}

.nav-link-enhanced.active .nav-link-indicator {
    width: 20px;
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-purple));
}

/* Theme Toggle */
.theme-toggle {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid var(--color-border);
    background: transparent;
    cursor: pointer;
    overflow: hidden;
    transition: all var(--duration-interaction) ease;
}

.theme-toggle:hover {
    background: var(--color-secondary);
    border-color: var(--color-foreground);
}

.theme-toggle-inner {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.5s var(--ease-shopify);
}

.theme-toggle-inner.is-dark {
    transform: rotate(180deg);
}

.theme-icon {
    position: absolute;
    width: 16px;
    height: 16px;
    color: var(--color-muted-foreground);
    transition: all 0.3s ease;
}

.sun-icon {
    opacity: 1;
    transform: rotate(0deg) scale(1);
}

.moon-icon {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
}

.theme-toggle-inner.is-dark .sun-icon {
    opacity: 0;
    transform: rotate(90deg) scale(0.5);
}

.theme-toggle-inner.is-dark .moon-icon {
    opacity: 1;
    transform: rotate(0deg) scale(1);
}

.theme-toggle:hover .theme-icon {
    color: var(--color-foreground);
}

/* Mobile Nav Link */
.mobile-nav-link {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    font-size: 0.9375rem;
    color: var(--color-muted-foreground);
    border-radius: var(--radius);
    transition: all var(--duration-fast) ease;
    text-decoration: none;
}

.mobile-nav-link:hover {
    color: var(--color-foreground);
    background: var(--color-secondary);
}

.mobile-nav-link.active {
    color: var(--color-foreground);
    background: var(--color-secondary);
}

.mobile-nav-indicator {
    width: 4px;
    height: 4px;
    background: var(--color-border);
    border-radius: 50%;
    transition: all 0.3s var(--ease-shopify);
}

.mobile-nav-link:hover .mobile-nav-indicator,
.mobile-nav-link.active .mobile-nav-indicator {
    width: 8px;
    background: var(--color-accent-purple);
}

.mobile-nav-link.active .mobile-nav-indicator {
    width: 20px;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-purple));
}
</style>

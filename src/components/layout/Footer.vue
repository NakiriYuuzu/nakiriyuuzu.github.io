<script setup lang="ts">
import { computed } from 'vue'
import { Github, Mail, Phone, Heart, ArrowUp } from 'lucide-vue-next'
import { personalInfo } from '@/data/portfolio'
import { useLenisScroll } from '@/composables/useLenisScroll'

const { scrollTo } = useLenisScroll()

const currentYear = computed(() => new Date().getFullYear())

const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' }
]

const socialLinks = [
    {
        icon: Github,
        href: `https://github.com/${personalInfo.github}`,
        label: 'GitHub',
        external: true
    },
    {
        icon: Mail,
        href: `mailto:${personalInfo.email}`,
        label: 'Email'
    },
    {
        icon: Phone,
        href: `tel:${personalInfo.phone}`,
        label: 'Phone'
    }
]

const builtWith = ['Vue 3', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Lenis', 'TresJS']

const handleNavClick = (event: Event, href: string) => {
    event.preventDefault()
    scrollTo(href, { duration: 1.2, offset: -80 })
}

const scrollToTop = (event: Event) => {
    event.preventDefault()
    scrollTo(0, { duration: 1.2 })
}
</script>

<template>
    <footer class="footer">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-12 mb-12">
                <!-- Logo & Description -->
                <div class="md:col-span-2">
                    <a href="#" class="flex items-center gap-3 mb-4" @click="scrollToTop">
                        <div class="logo-icon">
                            <span class="text-bg-primary font-heading font-bold text-lg">Y</span>
                        </div>
                        <span class="font-heading font-semibold text-xl text-text-primary">Yuuzu</span>
                    </a>
                    <p class="text-text-secondary mb-6 max-w-md">
                        Full-Stack Engineer passionate about creating elegant solutions for complex problems. Let's build something amazing together.
                    </p>
                    <!-- Social Links -->
                    <div class="flex gap-3">
                        <a
                            v-for="link in socialLinks"
                            :key="link.label"
                            :href="link.href"
                            :target="link.external ? '_blank' : undefined"
                            :rel="link.external ? 'noopener noreferrer' : undefined"
                            class="social-link"
                            :aria-label="link.label"
                        >
                            <component :is="link.icon" class="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h4 class="font-heading font-semibold text-lg mb-4 text-text-primary">Quick Links</h4>
                    <nav class="space-y-3">
                        <a
                            v-for="item in navItems"
                            :key="item.href"
                            :href="item.href"
                            class="block text-text-secondary hover:text-accent transition-colors"
                            @click="(e) => handleNavClick(e, item.href)"
                        >
                            {{ item.label }}
                        </a>
                    </nav>
                </div>

                <!-- Built With -->
                <div>
                    <h4 class="font-heading font-semibold text-lg mb-4 text-text-primary">Built With</h4>
                    <div class="flex flex-wrap gap-2">
                        <span
                            v-for="tech in builtWith"
                            :key="tech"
                            class="tech-tag"
                        >
                            {{ tech }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                <p class="text-text-secondary text-sm">
                    &copy; {{ currentYear }} {{ personalInfo.name }}. All rights reserved.
                </p>
                <div class="flex items-center gap-4">
                    <p class="text-text-secondary text-sm flex items-center gap-1">
                        Designed with <Heart class="w-4 h-4 text-red-500 fill-red-500" /> in Taiwan
                    </p>
                    <button
                        class="back-to-top"
                        aria-label="Back to top"
                        @click="scrollToTop"
                    >
                        <ArrowUp class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
/* Logo Icon */
.logo-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Social Link */
.social-link {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    transition: all var(--duration-fast) ease;
}

.social-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-accent);
    border-color: var(--color-accent);
    transform: translateY(-2px);
}

/* Tech Tag */
.tech-tag {
    padding: 0.375rem 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    transition: all var(--duration-fast) ease;
}

.tech-tag:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
}

/* Back to Top Button */
.back-to-top {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-accent);
    color: var(--color-bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    transition: all var(--duration-fast) ease;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.back-to-top:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}
</style>

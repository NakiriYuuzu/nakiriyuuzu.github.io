<template>
    <footer class="footer">
        <div class="container mx-auto px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-12 lg:gap-16">
                <!-- Brand Section -->
                <div class="md:col-span-2">
                    <h3 class="footer-logo mb-4">Yuuzu</h3>
                    <p
                        class="body-md opacity-70 mb-6 max-w-md"
                    >
                        Full-Stack Engineer passionate about creating innovative
                        solutions and exceptional user experiences.
                    </p>
                    <div class="flex gap-3">
                        <a
                            :href="`mailto:${personalInfo.email}`"
                            class="btn-icon border-current/20 hover:bg-white/10"
                            aria-label="Email"
                        >
                            <Mail class="w-4 h-4" />
                        </a>
                        <a
                            :href="`https://github.com/${personalInfo.github}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="btn-icon border-current/20 hover:bg-white/10"
                            aria-label="GitHub"
                        >
                            <Github class="w-4 h-4" />
                        </a>
                        <a
                            :href="`tel:${personalInfo.phone}`"
                            class="btn-icon border-current/20 hover:bg-white/10"
                            aria-label="Phone"
                        >
                            <Phone class="w-4 h-4" />
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h4 class="label-caps opacity-50 mb-6">Navigation</h4>
                    <ul class="space-y-3">
                        <li v-for="item in navItems" :key="item.href">
                            <a
                                :href="item.href"
                                class="body-sm opacity-70 hover:opacity-100 transition-opacity"
                                @click="smoothScroll"
                            >
                                {{ item.label }}
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Technologies -->
                <div>
                    <h4 class="label-caps opacity-50 mb-6">Technologies</h4>
                    <ul class="space-y-3">
                        <li v-for="tech in topTechnologies" :key="tech">
                            <span class="body-sm opacity-70">{{ tech }}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="footer-divider"></div>

            <!-- Bottom Section -->
            <div
                class="flex flex-col md:flex-row justify-between items-center gap-4"
            >
                <div class="body-sm opacity-50">
                    &copy; {{ currentYear }} Yuuzu. All rights reserved.
                </div>
                <div class="flex items-center gap-4 body-sm opacity-50">
                    <span>Built with Vue 3 + Tailwind CSS</span>
                    <span class="hidden md:inline">&middot;</span>
                    <span class="hidden md:inline">Powered by Vite</span>
                </div>
            </div>

            <!-- Back to Top -->
            <div class="flex justify-center mt-10">
                <button
                    class="btn-secondary border-current/20 hover:bg-white/10 text-sm py-2"
                    @click="scrollToTop"
                >
                    <ChevronUp class="w-4 h-4" />
                    Back to Top
                </button>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Mail, Github, Phone, ChevronUp } from 'lucide-vue-next'
import { personalInfo } from '@/data/portfolio'

const currentYear = computed(() => new Date().getFullYear())

const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' }
]

const topTechnologies = ['Vue.js', 'TypeScript', 'Kotlin', 'Python', 'React.js']

const smoothScroll = (event: Event) => {
    event.preventDefault()
    const target = event.target as HTMLAnchorElement
    const href = target.getAttribute('href')
    if (href) {
        const element = document.querySelector(href)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

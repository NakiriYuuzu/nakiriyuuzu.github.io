<template>
  <footer class="bg-muted/30 border-t border-border/40">
    <div class="container mx-auto px-4 py-12">
      <div class="grid md:grid-cols-4 gap-8">
        <!-- Brand Section -->
        <div class="md:col-span-2">
          <h3 class="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            蔡淇鴻
          </h3>
          <p class="text-muted-foreground mb-6 max-w-md">
            Full-Stack Engineer passionate about creating innovative solutions and exceptional user experiences.
          </p>
          <div class="flex space-x-4">
            <a 
              :href="`mailto:${personalInfo.email}`"
              class="w-10 h-10 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail class="w-5 h-5" />
            </a>
            <a 
              :href="`https://github.com/${personalInfo.github}`"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <Github class="w-5 h-5" />
            </a>
            <a 
              :href="`tel:${personalInfo.phone}`"
              class="w-10 h-10 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li v-for="item in navItems" :key="item.href">
              <a 
                :href="item.href"
                class="text-muted-foreground hover:text-primary transition-colors"
                @click="smoothScroll"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Skills -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Technologies</h4>
          <ul class="space-y-2">
            <li v-for="tech in topTechnologies" :key="tech">
              <span class="text-muted-foreground">{{ tech }}</span>
            </li>
          </ul>
        </div>
      </div>

      <Separator class="my-8" />

      <!-- Bottom Section -->
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="text-sm text-muted-foreground mb-4 md:mb-0">
          © {{ currentYear }} 蔡淇鴻. All rights reserved.
        </div>
        <div class="flex items-center space-x-6 text-sm text-muted-foreground">
          <span>Built with Vue 3 + Tailwind CSS 4</span>
          <span>•</span>
          <span>Powered by Vite</span>
        </div>
      </div>

      <!-- Back to Top -->
      <div class="flex justify-center mt-8">
        <Button 
          variant="outline" 
          size="sm"
          @click="scrollToTop"
          class="text-muted-foreground hover:text-primary"
        >
          <ChevronUp class="w-4 h-4 mr-2" />
          Back to Top
        </Button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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

const topTechnologies = [
  'Vue.js',
  'TypeScript',
  'Kotlin',
  'Python',
  'React.js'
]

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
<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <a href="#" class="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            蔡淇鴻
          </a>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <a 
            v-for="item in navItems" 
            :key="item.href"
            :href="item.href"
            class="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            @click="smoothScroll"
          >
            {{ item.label }}
          </a>
        </div>

        <!-- Theme Toggle & Mobile Menu -->
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <Button 
            variant="ghost" 
            size="icon"
            @click="toggleTheme"
            class="w-9 h-9"
          >
            <Sun v-if="isDark" class="h-4 w-4 transition-all" />
            <Moon v-else class="h-4 w-4 transition-all" />
          </Button>

          <!-- Mobile Menu Button -->
          <Button 
            variant="ghost" 
            size="icon"
            class="w-9 h-9 md:hidden"
            @click="toggleMobileMenu"
          >
            <Menu v-if="!isMobileMenuOpen" class="h-4 w-4" />
            <X v-else class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div 
        v-if="isMobileMenuOpen"
        class="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-sm"
      >
        <div class="py-4 space-y-2">
          <a 
            v-for="item in navItems" 
            :key="item.href"
            :href="item.href"
            class="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 font-medium rounded-md mx-2"
            @click="handleMobileNavClick"
          >
            {{ item.label }}
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Menu, X } from 'lucide-vue-next'

const isDark = ref(false)
const isMobileMenuOpen = ref(false)

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
  const href = target.getAttribute('href')
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

onMounted(() => {
  // Check for saved theme preference or default to dark mode
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>
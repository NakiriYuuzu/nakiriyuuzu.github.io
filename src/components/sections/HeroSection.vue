<template>
  <section class="relative min-h-screen flex items-center justify-center bg-background">
    <!-- Simplified background decoration -->
    <div class="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/30"></div>

    <div class="relative z-10 container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Avatar -->
        <div class="mb-8">
          <Avatar class="w-32 h-32 mx-auto mb-6 ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
            <AvatarImage src="/api/placeholder/150/150" alt="蔡淇鴻" />
            <AvatarFallback class="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground">
              蔡
            </AvatarFallback>
          </Avatar>
        </div>

        <!-- Name and Title -->
        <div class="mb-8">
          <h1 class="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            {{ personalInfo.name }}
          </h1>
          <div class="text-xl md:text-2xl text-muted-foreground mb-2">
            {{ personalInfo.title }}
          </div>
          <div class="text-lg text-muted-foreground/80">
            NakiriYuuzu
          </div>
        </div>

        <!-- Description -->
        <p class="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          {{ personalInfo.description }}
        </p>

        <!-- Contact Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            class="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
            @click="scrollToContact"
          >
            <Mail class="w-5 h-5 mr-2" />
            Get In Touch
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            class="px-8 py-3 text-lg"
            @click="openGithub"
          >
            <Github class="w-5 h-5 mr-2" />
            View GitHub
          </Button>
        </div>

        <!-- Social Links -->
        <div class="flex justify-center space-x-6">
          <a 
            :href="`mailto:${personalInfo.email}`"
            class="text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail class="w-6 h-6" />
          </a>
          <a 
            :href="`https://github.com/${personalInfo.github}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github class="w-6 h-6" />
          </a>
          <a 
            :href="`tel:${personalInfo.phone}`"
            class="text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone class="w-6 h-6" />
          </a>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div class="animate-bounce">
          <ChevronDown class="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Mail, Github, Phone, ChevronDown } from 'lucide-vue-next'
import { personalInfo } from '@/data/portfolio'

const scrollToContact = () => {
  const contactSection = document.getElementById('contact')
  contactSection?.scrollIntoView({ behavior: 'smooth' })
}

const openGithub = () => {
  window.open(`https://github.com/${personalInfo.github}`, '_blank')
}
</script>


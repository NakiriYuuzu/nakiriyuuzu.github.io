<template>
  <section id="skills" class="py-20 bg-background">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Section Title -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit for building modern applications
          </p>
        </div>

        <!-- Skills Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          <Card 
            v-for="(skill, index) in skills" 
            :key="skill.category"
            class="group p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm hover:bg-card/80"
            :class="getCardDelay(index)"
          >
            <CardHeader class="pb-6">
              <CardTitle class="flex items-center text-2xl group-hover:text-primary transition-colors">
                <component :is="getCategoryIcon(skill.category)" class="w-6 h-6 mr-3 text-primary" />
                {{ skill.category }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex flex-wrap gap-3">
                <Badge 
                  v-for="tech in skill.technologies" 
                  :key="tech"
                  variant="secondary"
                  class="px-3 py-2 text-sm font-medium bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-default"
                >
                  {{ tech }}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Additional Skills Highlights -->
        <div class="mt-16">
          <h3 class="text-3xl font-bold text-center mb-12">Development Focus</h3>
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              v-for="focus in developmentFocus" 
              :key="focus.title"
              class="text-center p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
            >
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <component :is="focus.icon" class="w-8 h-8 text-primary" />
              </div>
              <h4 class="text-lg font-semibold mb-2">{{ focus.title }}</h4>
              <p class="text-muted-foreground text-sm">{{ focus.description }}</p>
            </div>
          </div>
        </div>

        <!-- Skill Proficiency -->
        <div class="mt-16 bg-muted/20 rounded-lg p-8">
          <h3 class="text-2xl font-bold text-center mb-8">Proficiency Overview</h3>
          <div class="space-y-6">
            <div v-for="proficiency in skillProficiency" :key="proficiency.skill" class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="font-medium">{{ proficiency.skill }}</span>
                <span class="text-sm text-muted-foreground">{{ proficiency.level }}%</span>
              </div>
              <div class="w-full bg-muted rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: `${proficiency.level}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Code2, 
  Database, 
  Smartphone, 
  Settings,
  Monitor,
  Layers,
  Zap
} from 'lucide-vue-next'
import { skills } from '@/data/portfolio'

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    'Programming Languages': Code2,
    'Backend Development': Database,
    'Frontend/Cross-Platform': Smartphone,
    'Tools & DevOps': Settings
  }
  return iconMap[category] || Code2
}

const getCardDelay = (_index: number) => {
  return `hover:scale-105 transform transition-transform duration-300`
}

const developmentFocus = [
  {
    title: 'Mobile First',
    description: 'Cross-platform apps with native performance',
    icon: Smartphone
  },
  {
    title: 'Web Apps',
    description: 'Modern responsive web applications',
    icon: Monitor
  },
  {
    title: 'Full Stack',
    description: 'End-to-end application development',
    icon: Layers
  },
  {
    title: 'Performance',
    description: 'Optimized and scalable solutions',
    icon: Zap
  }
]

const skillProficiency = [
  { skill: 'JavaScript/TypeScript', level: 90 },
  { skill: 'Vue.js/React.js', level: 85 },
  { skill: 'Kotlin/Java', level: 80 },
  { skill: 'Python', level: 75 },
  { skill: 'Mobile Development', level: 85 },
  { skill: 'Backend Development', level: 80 }
]
</script>
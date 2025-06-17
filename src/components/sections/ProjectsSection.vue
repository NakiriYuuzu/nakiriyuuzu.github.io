<template>
  <section id="projects" class="py-20 bg-muted/30">
    <div class="container mx-auto px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Section Title -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of applications and solutions I've built
          </p>
        </div>

        <!-- Projects Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card 
            v-for="(project, index) in projects" 
            :key="project.name"
            class="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm hover:bg-card/80"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <!-- Project Header -->
            <CardHeader class="pb-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <CardTitle class="text-xl group-hover:text-primary transition-colors mb-2">
                    {{ project.name }}
                  </CardTitle>
                  <CardDescription class="text-muted-foreground leading-relaxed">
                    {{ project.description }}
                  </CardDescription>
                </div>
                <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors ml-4">
                  <component :is="getProjectIcon(project.name)" class="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardHeader>

            <!-- Technologies -->
            <CardContent class="pb-6">
              <div class="space-y-4">
                <div>
                  <h4 class="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Technologies Used
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <Badge 
                      v-for="tech in project.technologies" 
                      :key="tech"
                      variant="outline"
                      class="text-xs bg-background/50 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {{ tech }}
                    </Badge>
                  </div>
                </div>

                <!-- Project Actions -->
                <div class="flex gap-2 pt-4">
                  <Button 
                    v-if="project.link" 
                    variant="outline" 
                    size="sm"
                    class="flex-1"
                    @click="openLink(project.link)"
                  >
                    <ExternalLink class="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                  <Button 
                    v-if="project.github" 
                    variant="outline" 
                    size="sm"
                    class="flex-1"
                    @click="openLink(project.github)"
                  >
                    <Github class="w-4 h-4 mr-2" />
                    Code
                  </Button>
                  <Button 
                    v-if="!project.link && !project.github" 
                    variant="outline" 
                    size="sm"
                    class="flex-1"
                    disabled
                  >
                    <Lock class="w-4 h-4 mr-2" />
                    Private
                  </Button>
                </div>
              </div>
            </CardContent>

            <!-- Hover Effect Overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </Card>
        </div>

        <!-- Project Categories -->
        <div class="mt-16">
          <h3 class="text-3xl font-bold text-center mb-12">Project Categories</h3>
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              v-for="category in projectCategories" 
              :key="category.name"
              class="text-center p-6 rounded-lg bg-background/50 hover:bg-background/80 transition-all group cursor-default"
            >
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <component :is="category.icon" class="w-8 h-8 text-primary" />
              </div>
              <h4 class="text-lg font-semibold mb-2">{{ category.name }}</h4>
              <p class="text-muted-foreground text-sm">{{ category.description }}</p>
              <div class="mt-3">
                <Badge variant="secondary" class="text-xs">
                  {{ category.count }} projects
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="mt-16 text-center">
          <Card class="max-w-2xl mx-auto p-8 border-0 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent class="space-y-4">
              <h3 class="text-2xl font-bold">Interested in Collaboration?</h3>
              <p class="text-muted-foreground">
                I'm always open to discussing new opportunities and interesting projects.
              </p>
              <Button size="lg" @click="scrollToContact">
                <Mail class="w-5 h-5 mr-2" />
                Let's Talk
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Cloud, 
  Smartphone, 
  FileText, 
  MapPin, 
  GraduationCap, 
  Gamepad2,
  ExternalLink,
  Github,
  Lock,
  Monitor,
  Database,
  Zap,
  Mail
} from 'lucide-vue-next'
import { projects } from '@/data/portfolio'

const getProjectIcon = (projectName: string) => {
  const iconMap: Record<string, any> = {
    'Weather App': Cloud,
    'Expense Tracking App': FileText,
    'Diary Note App': FileText,
    'Campus Micro-Positioning Project': MapPin,
    'Course Interaction App': GraduationCap,
    'AR/IoT UI Technology App': Gamepad2
  }
  return iconMap[projectName] || Smartphone
}

const projectCategories = [
  {
    name: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications',
    icon: Smartphone,
    count: 3
  },
  {
    name: 'Web Applications',
    description: 'Full-stack web solutions and platforms',
    icon: Monitor,
    count: 2
  },
  {
    name: 'IoT & AR',
    description: 'Internet of Things and Augmented Reality',
    icon: Zap,
    count: 1
  },
  {
    name: 'Enterprise Systems',
    description: 'Business solutions and management systems',
    icon: Database,
    count: 1
  }
]

const openLink = (url?: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const scrollToContact = () => {
  const contactSection = document.getElementById('contact')
  contactSection?.scrollIntoView({ behavior: 'smooth' })
}
</script>
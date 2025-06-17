<template>
  <section id="about" class="py-20 bg-muted/30">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Section Title -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            About Me
          </h2>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate about creating innovative solutions and exceptional user experiences
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left side - Education & Bio -->
          <div class="space-y-8">
            <Card class="p-8 border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader class="pb-6">
                <CardTitle class="flex items-center text-2xl">
                  <GraduationCap class="w-6 h-6 mr-3 text-primary" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div>
                  <h3 class="text-xl font-semibold text-foreground">{{ education.university }}</h3>
                  <p class="text-lg text-muted-foreground">{{ education.major }}</p>
                  <div class="flex items-center mt-2">
                    <Calendar class="w-4 h-4 mr-2 text-primary" />
                    <span class="text-muted-foreground">Graduated {{ education.graduation }}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card class="p-8 border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader class="pb-6">
                <CardTitle class="flex items-center text-2xl">
                  <Languages class="w-6 h-6 mr-3 text-primary" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="language in languages" :key="language.name" class="flex justify-between items-center">
                    <span class="font-medium">{{ language.name }}</span>
                    <Badge variant="secondary" class="text-xs">{{ language.level }}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Right side - Personal Description -->
          <div class="space-y-8">
            <div class="prose prose-lg max-w-none">
              <p class="text-lg leading-relaxed text-muted-foreground">
                {{ personalInfo.description }}
              </p>
              
              <div class="mt-8 space-y-4">
                <h3 class="text-2xl font-semibold text-foreground">What drives me</h3>
                <ul class="space-y-3">
                  <li class="flex items-start">
                    <Code class="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" />
                    <span class="text-muted-foreground">Creating efficient and scalable applications</span>
                  </li>
                  <li class="flex items-start">
                    <Users class="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" />
                    <span class="text-muted-foreground">Collaborating with teams to solve complex problems</span>
                  </li>
                  <li class="flex items-start">
                    <Lightbulb class="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" />
                    <span class="text-muted-foreground">Exploring new technologies and development approaches</span>
                  </li>
                  <li class="flex items-start">
                    <Target class="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" />
                    <span class="text-muted-foreground">Delivering exceptional user experiences</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Contact Info -->
            <Card class="p-6 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent class="space-y-4">
                <div class="flex items-center">
                  <Mail class="w-5 h-5 mr-3 text-primary" />
                  <a :href="`mailto:${personalInfo.email}`" class="text-foreground hover:text-primary transition-colors">
                    {{ personalInfo.email }}
                  </a>
                </div>
                <div class="flex items-center">
                  <Phone class="w-5 h-5 mr-3 text-primary" />
                  <a :href="`tel:${personalInfo.phone}`" class="text-foreground hover:text-primary transition-colors">
                    {{ personalInfo.phone }}
                  </a>
                </div>
                <div class="flex items-center">
                  <Github class="w-5 h-5 mr-3 text-primary" />
                  <a 
                    :href="`https://github.com/${personalInfo.github}`" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-foreground hover:text-primary transition-colors"
                  >
                    {{ personalInfo.github }}
                  </a>
                </div>
              </CardContent>
            </Card>
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
  GraduationCap, 
  Calendar, 
  Languages, 
  Code, 
  Users, 
  Lightbulb, 
  Target,
  Mail,
  Phone,
  Github
} from 'lucide-vue-next'
import { personalInfo, education, languages } from '@/data/portfolio'
</script>
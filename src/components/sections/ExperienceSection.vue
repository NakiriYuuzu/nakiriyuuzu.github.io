<template>
  <section id="experience" class="py-20 bg-background">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Section Title -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Professional Experience
          </h2>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            My journey through different roles and companies
          </p>
        </div>

        <!-- Timeline -->
        <div class="relative">
          <!-- Timeline Line -->
          <div class="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary via-accent to-muted"></div>

          <!-- Experience Items -->
          <div class="space-y-12">
            <div 
              v-for="(experience, index) in experiences" 
              :key="experience.company"
              class="relative flex items-center"
              :class="index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'"
            >
              <!-- Timeline Dot -->
              <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg z-10"></div>

              <!-- Content Card -->
              <div class="w-5/12" :class="index % 2 === 0 ? 'pr-8' : 'pl-8'">
                <Card class="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm hover:bg-card/80">
                  <CardHeader class="pb-4">
                    <div class="flex items-start justify-between">
                      <div>
                        <CardTitle class="text-xl group-hover:text-primary transition-colors">
                          {{ experience.position }}
                        </CardTitle>
                        <CardDescription class="text-lg font-medium text-foreground/80 mt-1">
                          {{ experience.company }}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" class="text-xs bg-primary/10 border-primary/20">
                        {{ experience.period }}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul class="space-y-3">
                      <li 
                        v-for="desc in experience.description" 
                        :key="desc"
                        class="flex items-start text-muted-foreground"
                      >
                        <ChevronRight class="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                        <span class="text-sm leading-relaxed">{{ desc }}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <!-- Period Badge for Mobile -->
              <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 lg:hidden">
                <Badge variant="secondary" class="text-xs whitespace-nowrap">
                  {{ experience.period }}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills Gained -->
        <div class="mt-20">
          <h3 class="text-3xl font-bold text-center mb-12">Key Skills Gained</h3>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              v-for="skill in keySkills" 
              :key="skill.title"
              class="p-6 border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-muted/20 hover:bg-muted/30 group"
            >
              <CardContent class="p-0 text-center">
                <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <component :is="skill.icon" class="w-6 h-6 text-primary" />
                </div>
                <h4 class="text-lg font-semibold mb-2">{{ skill.title }}</h4>
                <p class="text-muted-foreground text-sm">{{ skill.description }}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Career Progression -->
        <div class="mt-20 bg-muted/20 rounded-lg p-8">
          <h3 class="text-2xl font-bold text-center mb-8">Career Growth</h3>
          <div class="grid md:grid-cols-3 gap-8">
            <div 
              v-for="stage in careerStages" 
              :key="stage.stage"
              class="text-center"
            >
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span class="text-white font-bold text-lg">{{ stage.stage }}</span>
              </div>
              <h4 class="text-lg font-semibold mb-2">{{ stage.title }}</h4>
              <p class="text-muted-foreground text-sm">{{ stage.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronRight,
  Code,
  Users,
  Lightbulb,
  Target,
  Rocket,
  Trophy
} from 'lucide-vue-next'
import { experiences } from '@/data/portfolio'

const keySkills = [
  {
    title: 'System Architecture',
    description: 'Designing scalable and maintainable software architectures',
    icon: Code
  },
  {
    title: 'Team Collaboration',
    description: 'Working effectively in cross-functional development teams',
    icon: Users
  },
  {
    title: 'Problem Solving',
    description: 'Analyzing complex issues and implementing effective solutions',
    icon: Lightbulb
  },
  {
    title: 'Project Management',
    description: 'Managing timelines, resources, and deliverables effectively',
    icon: Target
  },
  {
    title: 'Innovation',
    description: 'Exploring new technologies and implementing creative solutions',
    icon: Rocket
  },
  {
    title: 'Quality Assurance',
    description: 'Ensuring high-quality code and robust testing practices',
    icon: Trophy
  }
]

const careerStages = [
  {
    stage: '1',
    title: 'Learning Foundation',
    description: 'Started as an intern, learning core development practices and enterprise workflows'
  },
  {
    stage: '2',
    title: 'Skill Development',
    description: 'Worked as a contract engineer, expanding technical skills and project experience'
  },
  {
    stage: '3',
    title: 'Professional Growth',
    description: 'Currently working as a full-time engineer, leading projects and mentoring others'
  }
]
</script>

<style scoped>
/* Mobile Timeline Adjustments */
@media (max-width: 1024px) {
  .relative.flex.items-center {
    flex-direction: column !important;
  }
  
  .w-5\/12 {
    width: 100%;
    padding: 0 !important;
  }
  
  .absolute.left-1\/2 {
    display: none;
  }
}
</style>
<template>
  <section id="contact" class="py-20 bg-muted/30">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Section Title -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's discuss opportunities, collaborations, or just have a chat about technology
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12">
          <!-- Contact Information -->
          <div class="space-y-8">
            <Card class="p-8 border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader class="pb-6">
                <CardTitle class="text-2xl">Contact Information</CardTitle>
                <CardDescription>
                  Feel free to reach out through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-6">
                <!-- Email -->
                <div class="flex items-center group">
                  <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                    <Mail class="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 class="font-semibold">Email</h4>
                    <a 
                      :href="`mailto:${personalInfo.email}`"
                      class="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {{ personalInfo.email }}
                    </a>
                  </div>
                </div>

                <!-- Phone -->
                <div class="flex items-center group">
                  <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                    <Phone class="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 class="font-semibold">Phone</h4>
                    <a 
                      :href="`tel:${personalInfo.phone}`"
                      class="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {{ personalInfo.phone }}
                    </a>
                  </div>
                </div>

                <!-- GitHub -->
                <div class="flex items-center group">
                  <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                    <Github class="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 class="font-semibold">GitHub</h4>
                    <a 
                      :href="`https://github.com/${personalInfo.github}`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {{ personalInfo.github }}
                    </a>
                  </div>
                </div>

                <!-- Location -->
                <div class="flex items-center group">
                  <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                    <MapPin class="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 class="font-semibold">Location</h4>
                    <span class="text-muted-foreground">Taiwan</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Quick Links -->
            <Card class="p-8 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader class="pb-6">
                <CardTitle class="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <Button 
                  class="w-full justify-start"
                  variant="ghost"
                  @click="openEmail"
                >
                  <Mail class="w-5 h-5 mr-3" />
                  Send me an email
                </Button>
                <Button 
                  class="w-full justify-start"
                  variant="ghost"
                  @click="openGithub"
                >
                  <Github class="w-5 h-5 mr-3" />
                  View my GitHub
                </Button>
                <Button 
                  class="w-full justify-start"
                  variant="ghost"
                  @click="callPhone"
                >
                  <Phone class="w-5 h-5 mr-3" />
                  Give me a call
                </Button>
                <Button 
                  class="w-full justify-start"
                  variant="ghost"
                  @click="downloadResume"
                >
                  <Download class="w-5 h-5 mr-3" />
                  Download Resume
                </Button>
              </CardContent>
            </Card>
          </div>

          <!-- Contact Form -->
          <div>
            <Card class="p-8 border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader class="pb-6">
                <CardTitle class="text-2xl">Send a Message</CardTitle>
                <CardDescription>
                  I'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form @submit.prevent="submitForm" class="space-y-6">
                  <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="text-sm font-medium">Name</label>
                      <input 
                        v-model="form.name"
                        type="text" 
                        required
                        class="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div class="space-y-2">
                      <label class="text-sm font-medium">Email</label>
                      <input 
                        v-model="form.email"
                        type="email" 
                        required
                        class="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div class="space-y-2">
                    <label class="text-sm font-medium">Subject</label>
                    <input 
                      v-model="form.subject"
                      type="text" 
                      required
                      class="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div class="space-y-2">
                    <label class="text-sm font-medium">Message</label>
                    <textarea 
                      v-model="form.message"
                      required
                      rows="6"
                      class="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none"
                      placeholder="Tell me about your project or opportunity..."
                    ></textarea>
                  </div>
                  
                  <Button type="submit" class="w-full" :disabled="isSubmitting">
                    <Send class="w-5 h-5 mr-2" />
                    {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Availability Status -->
        <div class="mt-16 text-center">
          <Card class="max-w-2xl mx-auto p-6 border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardContent class="p-0">
              <div class="flex items-center justify-center mb-4">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span class="text-green-700 dark:text-green-400 font-semibold">Currently Available</span>
              </div>
              <p class="text-green-600 dark:text-green-300 text-sm">
                Open to new opportunities and exciting projects
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Mail, 
  Phone, 
  Github, 
  MapPin, 
  Send, 
  Download
} from 'lucide-vue-next'
import { personalInfo } from '@/data/portfolio'
import { usePdfGenerator } from '@/composables/usePdfGenerator'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const { generatePDF } = usePdfGenerator()

const openEmail = () => {
  window.open(`mailto:${personalInfo.email}`)
}

const openGithub = () => {
  window.open(`https://github.com/${personalInfo.github}`, '_blank')
}

const callPhone = () => {
  window.open(`tel:${personalInfo.phone}`)
}

const downloadResume = async () => {
  try {
    // 先檢查是否已有 Resume 組件在頁面上
    let resumeElement = document.getElementById('resume')
    
    if (!resumeElement) {
      // 動態載入 Resume 組件到隱藏的容器中
      const { default: Resume } = await import('@/components/Resume.vue')
      const { createApp } = await import('vue')
      
      // 創建臨時容器
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'fixed'
      tempContainer.style.top = '-9999px'
      tempContainer.style.left = '-9999px'
      tempContainer.style.width = '210mm'
      tempContainer.style.background = 'white'
      tempContainer.style.zIndex = '-1'
      document.body.appendChild(tempContainer)
      
      // 掛載 Resume 組件
      const app = createApp(Resume)
      app.mount(tempContainer)
      
      // 等待組件渲染完成
      await nextTick()
      resumeElement = document.getElementById('resume')
      
      if (!resumeElement) {
        throw new Error('無法載入履歷組件')
      }
    }
    
    // 生成並下載 PDF
    await generatePDF('resume', `${personalInfo.name}_Resume`)
    
    // 如果是臨時創建的元素，清理它
    const tempContainer = resumeElement.closest('div')
    if (tempContainer && tempContainer.style.position === 'fixed') {
      document.body.removeChild(tempContainer)
    }
    
  } catch (error) {
    console.error('Resume download failed:', error)
    alert('履歷下載失敗，請稍後再試')
  }
}

const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create mailto link with form data
    const subject = encodeURIComponent(form.value.subject)
    const body = encodeURIComponent(
      `Name: ${form.value.name}\nEmail: ${form.value.email}\n\nMessage:\n${form.value.message}`
    )
    
    window.open(`mailto:${personalInfo.email}?subject=${subject}&body=${body}`)
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
    
    alert('Thank you for your message! Your email client should open with the message pre-filled.')
  } catch (error) {
    alert('Something went wrong. Please try sending an email directly.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Mail, Phone, Github, Send, MapPin, Clock } from 'lucide-vue-next'
import { personalInfo } from '@/data/portfolio'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import ScrollReveal from '@/components/animation/ScrollReveal.vue'

const form = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
})

const isSubmitting = ref(false)
const cardsRef = ref<HTMLElement | null>(null)
const formRef = ref<HTMLElement | null>(null)

const contactMethods = [
    {
        icon: Mail,
        title: 'Email',
        value: personalInfo.email,
        href: `mailto:${personalInfo.email}`,
        color: 'from-blue-500 to-cyan-600',
        shadowColor: 'shadow-blue-500/20'
    },
    {
        icon: Phone,
        title: 'Phone',
        value: formatPhone(personalInfo.phone),
        href: `tel:${personalInfo.phone}`,
        color: 'from-green-500 to-emerald-600',
        shadowColor: 'shadow-green-500/20'
    },
    {
        icon: Github,
        title: 'GitHub',
        value: `@${personalInfo.github}`,
        href: `https://github.com/${personalInfo.github}`,
        external: true,
        color: 'from-purple-500 to-violet-600',
        shadowColor: 'shadow-purple-500/20'
    }
]

function formatPhone(phone: string) {
    if (phone.length === 10) {
        return `${phone.slice(0, 4)}-${phone.slice(4, 7)}-${phone.slice(7)}`
    }
    return phone
}

const submitForm = async () => {
    isSubmitting.value = true

    try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const subject = encodeURIComponent(form.value.subject)
        const body = encodeURIComponent(
            `Name: ${form.value.name}\nEmail: ${form.value.email}\n\nMessage:\n${form.value.message}`
        )

        window.open(`mailto:${personalInfo.email}?subject=${subject}&body=${body}`)

        form.value = {
            name: '',
            email: '',
            subject: '',
            message: ''
        }
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    // Stagger animation for contact cards
    if (cardsRef.value) {
        const cards = cardsRef.value.querySelectorAll('.contact-card')
        gsap.set(cards, { y: 40, opacity: 0 })

        ScrollTrigger.create({
            trigger: cardsRef.value,
            start: 'top 75%',
            onEnter: () => {
                gsap.to(cards, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power3.out'
                })
            }
        })
    }

    // Form animation
    if (formRef.value) {
        gsap.set(formRef.value, { y: 50, opacity: 0 })

        ScrollTrigger.create({
            trigger: formRef.value,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(formRef.value, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out'
                })
            }
        })
    }
})
</script>

<template>
    <section id="contact" class="section py-24 section-dark">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section Header -->
            <ScrollReveal direction="up" class="text-center mb-16">
                <span class="section-badge">Contact</span>
                <h2 class="headline-2 mb-4 text-text-primary">
                    Let's Work <span class="gradient-text">Together</span>
                </h2>
                <p class="text-text-secondary max-w-2xl mx-auto">
                    Have a project in mind or want to discuss opportunities? I'd love to hear from you.
                </p>
            </ScrollReveal>

            <!-- Contact Cards -->
            <div ref="cardsRef" class="grid md:grid-cols-3 gap-6 mb-16">
                <a
                    v-for="method in contactMethods"
                    :key="method.title"
                    :href="method.href"
                    :target="method.external ? '_blank' : undefined"
                    :rel="method.external ? 'noopener noreferrer' : undefined"
                    class="contact-card group"
                >
                    <div
                        class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110"
                        :class="`bg-gradient-to-br ${method.color} shadow-lg ${method.shadowColor}`"
                    >
                        <component :is="method.icon" class="w-8 h-8 text-white" />
                    </div>
                    <h3 class="font-heading font-semibold text-xl mb-2 text-text-primary">
                        {{ method.title }}
                    </h3>
                    <p class="text-accent font-medium group-hover:underline">
                        {{ method.value }}
                    </p>
                </a>
            </div>

            <!-- Additional Info -->
            <div class="flex flex-wrap justify-center gap-8 mb-16">
                <div class="flex items-center gap-3 text-text-secondary">
                    <div class="w-10 h-10 rounded-full glass flex items-center justify-center">
                        <MapPin class="w-5 h-5 text-accent" />
                    </div>
                    <span>Taiwan</span>
                </div>
                <div class="flex items-center gap-3 text-text-secondary">
                    <div class="w-10 h-10 rounded-full glass flex items-center justify-center">
                        <Clock class="w-5 h-5 text-accent" />
                    </div>
                    <span>UTC+8 (Taiwan Time)</span>
                </div>
            </div>

            <!-- Contact Form -->
            <div ref="formRef" class="max-w-2xl mx-auto">
                <form class="card p-8" @submit.prevent="submitForm">
                    <h3 class="font-heading font-semibold text-xl mb-6 text-text-primary text-center">
                        Send a Message
                    </h3>

                    <div class="grid sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label for="name" class="block text-sm font-medium mb-2 text-text-primary">
                                Name
                            </label>
                            <input
                                id="name"
                                v-model="form.name"
                                type="text"
                                name="name"
                                class="form-input"
                                placeholder="Your name"
                                required
                            >
                        </div>
                        <div>
                            <label for="email" class="block text-sm font-medium mb-2 text-text-primary">
                                Email
                            </label>
                            <input
                                id="email"
                                v-model="form.email"
                                type="email"
                                name="email"
                                class="form-input"
                                placeholder="your@email.com"
                                required
                            >
                        </div>
                    </div>
                    <div class="mb-6">
                        <label for="subject" class="block text-sm font-medium mb-2 text-text-primary">
                            Subject
                        </label>
                        <input
                            id="subject"
                            v-model="form.subject"
                            type="text"
                            name="subject"
                            class="form-input"
                            placeholder="What's this about?"
                            required
                        >
                    </div>
                    <div class="mb-6">
                        <label for="message" class="block text-sm font-medium mb-2 text-text-primary">
                            Message
                        </label>
                        <textarea
                            id="message"
                            v-model="form.message"
                            name="message"
                            rows="5"
                            class="form-input resize-none"
                            placeholder="Tell me about your project..."
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        class="btn-primary w-full justify-center"
                        :disabled="isSubmitting"
                    >
                        <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
                        <Send class="w-5 h-5" :class="{ 'animate-pulse': isSubmitting }" />
                    </button>
                </form>
            </div>
        </div>
    </section>
</template>

<style scoped>
.contact-card {
    padding: 2rem;
}

.contact-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.form-input:focus {
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>

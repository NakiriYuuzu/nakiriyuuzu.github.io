<template>
    <section id="contact" class="section">
        <!-- Background Decorations -->
        <div class="contact-bg" aria-hidden="true"></div>
        <div class="contact-particles" aria-hidden="true">
            <div v-for="n in 20" :key="n" class="contact-particle"></div>
        </div>
        <div class="geo-shape diamond geo-shape-2" aria-hidden="true"></div>

        <div class="container mx-auto px-6 lg:px-8">
            <div class="max-w-6xl mx-auto">
                <!-- Large CTA Header -->
                <div class="cta-header glass-card">
                    <div class="cta-glow-orb"></div>
                    <div class="cta-content">
                        <div class="section-label">Connect</div>
                        <h2 class="cta-title">Let's Create Something Amazing</h2>
                        <p class="cta-description">
                            I'm always excited to discuss new opportunities, collaborations,
                            or just chat about technology and innovation.
                        </p>

                        <!-- Availability Status - Enhanced -->
                        <div class="availability-status">
                            <div class="availability-pulse">
                                <div class="pulse-dot"></div>
                                <div class="pulse-ring"></div>
                                <div class="pulse-ring pulse-ring-2"></div>
                            </div>
                            <div class="availability-text">
                                <span class="availability-label">Currently Available</span>
                                <span class="availability-desc">Open for freelance & full-time</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact Cards Grid -->
                <div class="contact-grid">
                    <!-- Email Card -->
                    <a
                        :href="`mailto:${personalInfo.email}`"
                        class="contact-card glass-card"
                    >
                        <div class="contact-card-icon email-icon">
                            <Mail class="w-6 h-6" />
                        </div>
                        <div class="contact-card-content">
                            <span class="contact-card-label">Email</span>
                            <span class="contact-card-value">{{ personalInfo.email }}</span>
                        </div>
                        <ArrowUpRight class="contact-card-arrow" />
                    </a>

                    <!-- Phone Card -->
                    <a
                        :href="`tel:${personalInfo.phone}`"
                        class="contact-card glass-card"
                    >
                        <div class="contact-card-icon phone-icon">
                            <Phone class="w-6 h-6" />
                        </div>
                        <div class="contact-card-content">
                            <span class="contact-card-label">Phone</span>
                            <span class="contact-card-value">{{ personalInfo.phone }}</span>
                        </div>
                        <ArrowUpRight class="contact-card-arrow" />
                    </a>

                    <!-- GitHub Card -->
                    <a
                        :href="`https://github.com/${personalInfo.github}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="contact-card glass-card"
                    >
                        <div class="contact-card-icon github-icon">
                            <Github class="w-6 h-6" />
                        </div>
                        <div class="contact-card-content">
                            <span class="contact-card-label">GitHub</span>
                            <span class="contact-card-value">{{ personalInfo.github }}</span>
                        </div>
                        <ArrowUpRight class="contact-card-arrow" />
                    </a>

                    <!-- Location Card -->
                    <div class="contact-card glass-card location-card">
                        <div class="contact-card-icon location-icon">
                            <MapPin class="w-6 h-6" />
                        </div>
                        <div class="contact-card-content">
                            <span class="contact-card-label">Location</span>
                            <span class="contact-card-value">Taiwan</span>
                        </div>
                        <Globe class="contact-card-globe" />
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="form-section">
                    <div class="form-header">
                        <h3 class="form-title">Send a Message</h3>
                        <p class="form-description">
                            I'll get back to you as soon as possible
                        </p>
                    </div>

                    <form class="contact-form glass-card" @submit.prevent="submitForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Name</label>
                                <input
                                    v-model="form.name"
                                    type="text"
                                    required
                                    class="form-input"
                                    placeholder="Your name"
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input
                                    v-model="form.email"
                                    type="email"
                                    required
                                    class="form-input"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Subject</label>
                            <input
                                v-model="form.subject"
                                type="text"
                                required
                                class="form-input"
                                placeholder="What's this about?"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Message</label>
                            <textarea
                                v-model="form.message"
                                required
                                rows="5"
                                class="form-input form-textarea"
                                placeholder="Tell me about your project or opportunity..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            class="submit-button"
                            :disabled="isSubmitting"
                        >
                            <span class="submit-button-bg"></span>
                            <span class="submit-button-content">
                                <Send class="w-4 h-4" />
                                <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
                            </span>
                        </button>
                    </form>
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions">
                    <button class="quick-action-btn" @click="downloadResume">
                        <Download class="w-5 h-5" />
                        <span>Download Resume</span>
                    </button>
                    <button class="quick-action-btn" @click="openGithub">
                        <Github class="w-5 h-5" />
                        <span>View Projects</span>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Mail, Phone, Github, MapPin, Send, Download, ArrowUpRight, Globe } from 'lucide-vue-next'
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

const openGithub = () => {
    window.open(`https://github.com/${personalInfo.github}`, '_blank')
}

const downloadResume = async () => {
    try {
        let resumeElement = document.getElementById('resume')

        if (!resumeElement) {
            const { default: Resume } = await import('@/components/Resume.vue')
            const { createApp } = await import('vue')

            const tempContainer = document.createElement('div')
            tempContainer.style.position = 'fixed'
            tempContainer.style.top = '-9999px'
            tempContainer.style.left = '-9999px'
            tempContainer.style.width = '210mm'
            tempContainer.style.background = 'white'
            tempContainer.style.zIndex = '-1'
            document.body.appendChild(tempContainer)

            const app = createApp(Resume)
            app.mount(tempContainer)

            await nextTick()
            resumeElement = document.getElementById('resume')

            if (!resumeElement) {
                throw new Error('Unable to load resume component')
            }
        }

        await generatePDF('resume', `${personalInfo.name}_Resume`)

        const tempContainer = resumeElement.closest('div')
        if (tempContainer && tempContainer.style.position === 'fixed') {
            document.body.removeChild(tempContainer)
        }
    } catch (error) {
        console.error('Resume download failed:', error)
    }
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
</script>

<style scoped>
/* Contact Background */
.contact-bg {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 80% 60% at 50% 0%, rgba(128, 81, 255, 0.08) 0%, transparent 50%),
        radial-gradient(ellipse 60% 40% at 30% 80%, rgba(201, 169, 98, 0.05) 0%, transparent 50%),
        radial-gradient(ellipse 50% 50% at 70% 60%, rgba(128, 81, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
}

/* Contact Particles */
.contact-particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
}

.contact-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: var(--color-accent-purple);
    border-radius: 50%;
    opacity: 0;
    animation: contact-particle-float 10s ease-in-out infinite;
}

.contact-particle:nth-child(1) { left: 5%; animation-delay: 0s; }
.contact-particle:nth-child(2) { left: 10%; animation-delay: 0.5s; }
.contact-particle:nth-child(3) { left: 15%; animation-delay: 1s; }
.contact-particle:nth-child(4) { left: 20%; animation-delay: 1.5s; }
.contact-particle:nth-child(5) { left: 25%; animation-delay: 2s; }
.contact-particle:nth-child(6) { left: 35%; animation-delay: 2.5s; }
.contact-particle:nth-child(7) { left: 45%; animation-delay: 3s; }
.contact-particle:nth-child(8) { left: 55%; animation-delay: 3.5s; }
.contact-particle:nth-child(9) { left: 65%; animation-delay: 4s; }
.contact-particle:nth-child(10) { left: 75%; animation-delay: 4.5s; }
.contact-particle:nth-child(11) { left: 80%; animation-delay: 0.25s; }
.contact-particle:nth-child(12) { left: 85%; animation-delay: 0.75s; }
.contact-particle:nth-child(13) { left: 90%; animation-delay: 1.25s; }
.contact-particle:nth-child(14) { left: 95%; animation-delay: 1.75s; }
.contact-particle:nth-child(15) { left: 30%; animation-delay: 2.25s; }
.contact-particle:nth-child(16) { left: 40%; animation-delay: 2.75s; }
.contact-particle:nth-child(17) { left: 50%; animation-delay: 3.25s; }
.contact-particle:nth-child(18) { left: 60%; animation-delay: 3.75s; }
.contact-particle:nth-child(19) { left: 70%; animation-delay: 4.25s; }
.contact-particle:nth-child(20) { left: 88%; animation-delay: 4.75s; }

@keyframes contact-particle-float {
    0% {
        bottom: -5%;
        opacity: 0;
        transform: scale(0.5);
    }
    10% {
        opacity: 0.6;
        transform: scale(1);
    }
    90% {
        opacity: 0.6;
        transform: scale(1);
    }
    100% {
        bottom: 105%;
        opacity: 0;
        transform: scale(0.5);
    }
}

/* CTA Header */
.cta-header {
    position: relative;
    padding: 4rem;
    text-align: center;
    margin-bottom: 3rem;
    overflow: hidden;
}

.cta-glow-orb {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, var(--color-accent-purple) 0%, transparent 70%);
    opacity: 0.15;
    filter: blur(60px);
    pointer-events: none;
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 400;
    letter-spacing: -0.02em;
    color: var(--color-foreground);
    margin: 1rem 0 1.5rem;
}

.cta-description {
    font-size: 1.125rem;
    color: var(--color-muted-foreground);
    max-width: 600px;
    margin: 0 auto 2rem;
    line-height: 1.7;
}

/* Availability Status - Enhanced */
.availability-status {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1.5rem;
    background: var(--color-secondary);
    border: 1px solid var(--color-border);
    border-radius: 9999px;
}

.availability-pulse {
    position: relative;
    width: 12px;
    height: 12px;
}

.pulse-dot {
    position: absolute;
    inset: 0;
    background: #22c55e;
    border-radius: 50%;
    z-index: 2;
}

.pulse-ring {
    position: absolute;
    inset: -4px;
    border: 2px solid #22c55e;
    border-radius: 50%;
    animation: availability-pulse 2s ease-out infinite;
}

.pulse-ring-2 {
    animation-delay: 0.5s;
}

@keyframes availability-pulse {
    0% {
        transform: scale(1);
        opacity: 0.8;
    }
    100% {
        transform: scale(2.5);
        opacity: 0;
    }
}

.availability-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.availability-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #22c55e;
}

.availability-desc {
    font-size: 0.75rem;
    color: var(--color-muted-foreground);
}

/* Contact Cards Grid */
.contact-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 3rem;
}

.contact-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    text-decoration: none;
    transition: all var(--duration-interaction) var(--ease-shopify);
    overflow: hidden;
}

.contact-card:hover {
    transform: translateY(-4px);
    border-color: var(--color-accent-purple);
}

.contact-card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.3s ease;
}

.email-icon {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
}

.phone-icon {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
}

.github-icon {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
}

.location-icon {
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-purple) 100%);
    color: white;
}

.contact-card:hover .contact-card-icon {
    transform: scale(1.1) rotate(-5deg);
}

.contact-card-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
}

.contact-card-label {
    font-size: 0.75rem;
    color: var(--color-muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.contact-card-value {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.contact-card-arrow {
    width: 20px;
    height: 20px;
    color: var(--color-muted-foreground);
    opacity: 0;
    transform: translate(-10px, 10px);
    transition: all 0.3s var(--ease-shopify);
}

.contact-card:hover .contact-card-arrow {
    opacity: 1;
    transform: translate(0, 0);
    color: var(--color-accent-purple);
}

.contact-card-globe {
    width: 24px;
    height: 24px;
    color: var(--color-muted-foreground);
    animation: globe-spin 20s linear infinite;
}

@keyframes globe-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.location-card {
    cursor: default;
}

/* Form Section */
.form-section {
    margin-bottom: 3rem;
}

.form-header {
    text-align: center;
    margin-bottom: 2rem;
}

.form-title {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 500;
    color: var(--color-foreground);
    margin-bottom: 0.5rem;
}

.form-description {
    font-size: 0.9375rem;
    color: var(--color-muted-foreground);
}

.contact-form {
    max-width: 700px;
    margin: 0 auto;
    padding: 2.5rem;
}

.form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-foreground);
}

.form-input {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-background);
    color: var(--color-foreground);
    font-size: 0.9375rem;
    transition: all var(--duration-interaction) ease;
}

.form-input:focus {
    outline: none;
    border-color: var(--color-accent-purple);
    box-shadow: 0 0 0 3px rgba(128, 81, 255, 0.15);
}

.form-input::placeholder {
    color: var(--color-muted-foreground);
}

.form-textarea {
    resize: none;
    min-height: 140px;
}

/* Submit Button */
.submit-button {
    position: relative;
    width: 100%;
    padding: 1rem 2rem;
    border: none;
    border-radius: var(--radius);
    background: var(--color-foreground);
    cursor: pointer;
    overflow: hidden;
}

.submit-button-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-purple), var(--color-accent));
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
    animation: gradient-shift 3s ease infinite;
}

.submit-button:hover .submit-button-bg {
    opacity: 1;
}

.submit-button-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-background);
}

.submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Quick Actions */
.quick-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.quick-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-foreground);
    cursor: pointer;
    transition: all var(--duration-interaction) var(--ease-shopify);
}

.quick-action-btn:hover {
    background: var(--color-accent-purple);
    color: var(--color-accent-purple-foreground);
    border-color: var(--color-accent-purple);
    transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 1024px) {
    .contact-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .cta-header {
        padding: 2.5rem 1.5rem;
    }

    .contact-grid {
        grid-template-columns: 1fr;
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .contact-form {
        padding: 1.5rem;
    }

    .quick-actions {
        flex-direction: column;
    }

    .quick-action-btn {
        width: 100%;
        justify-content: center;
    }
}
</style>

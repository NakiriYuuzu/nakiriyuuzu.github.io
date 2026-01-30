<template>
    <section id="about" class="section section-alternate">
        <!-- Background Decorations -->
        <div class="about-bg" aria-hidden="true"></div>
        <div class="geo-shape circle geo-shape-1" aria-hidden="true"></div>
        <div class="geo-shape diamond geo-shape-2" aria-hidden="true"></div>

        <div class="container mx-auto px-6 lg:px-8">
            <div class="max-w-6xl mx-auto">
                <!-- Section Header -->
                <header class="section-header">
                    <div class="section-label">About</div>
                    <h2 class="section-title">The Story</h2>
                    <p class="section-description">
                        Passionate about creating innovative solutions and
                        exceptional user experiences
                    </p>
                </header>

                <!-- Bento Grid Layout -->
                <div class="about-bento-grid">
                    <!-- Bio Card - Large -->
                    <div class="about-bento-item bio-card glass-card">
                        <p class="bio-text drop-cap-enhanced">
                            {{ personalInfo.description }}
                        </p>

                        <!-- Motivations as expandable tags -->
                        <div class="motivations-section">
                            <h3 class="motivations-title">What Drives Me</h3>
                            <div class="motivations-grid">
                                <div
                                    v-for="item in motivations"
                                    :key="item.title"
                                    class="motivation-tag"
                                    :class="{ expanded: expandedMotivation === item.title }"
                                    @click="toggleMotivation(item.title)"
                                >
                                    <div class="motivation-tag-header">
                                        <component :is="item.icon" class="w-4 h-4" />
                                        <span>{{ item.title }}</span>
                                        <ChevronDown
                                            class="motivation-chevron w-4 h-4"
                                            :class="{ rotated: expandedMotivation === item.title }"
                                        />
                                    </div>
                                    <Transition name="expand">
                                        <p
                                            v-if="expandedMotivation === item.title"
                                            class="motivation-description"
                                        >
                                            {{ item.description }}
                                        </p>
                                    </Transition>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Education Card - Featured -->
                    <div class="about-bento-item education-card glass-card">
                        <div class="education-badge">
                            <GraduationCap class="w-4 h-4" />
                            <span>Education</span>
                        </div>
                        <div class="education-content">
                            <h3 class="education-university">
                                {{ education.university }}
                            </h3>
                            <p class="education-major">
                                {{ education.major }}
                            </p>
                            <div class="education-date">
                                <Calendar class="w-4 h-4" />
                                <span>Graduated {{ education.graduation }}</span>
                            </div>
                        </div>
                        <div class="education-decoration"></div>
                    </div>

                    <!-- Languages Card -->
                    <div class="about-bento-item languages-card glass-card">
                        <div class="languages-header">
                            <Languages class="w-5 h-5 text-accent" />
                            <h3>Languages</h3>
                        </div>
                        <div class="languages-list">
                            <div
                                v-for="language in languages"
                                :key="language.name"
                                class="language-item"
                            >
                                <div class="language-info">
                                    <span class="language-name">{{ language.name }}</span>
                                    <span class="language-level">{{ language.level }}</span>
                                </div>
                                <div class="language-bar">
                                    <div
                                        class="language-bar-fill"
                                        :style="{ width: getLanguageLevel(language.level) }"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Contact Card -->
                    <div class="about-bento-item contact-card glass-card">
                        <h3 class="contact-title">Quick Contact</h3>
                        <div class="contact-links">
                            <a
                                :href="`mailto:${personalInfo.email}`"
                                class="contact-link"
                            >
                                <div class="contact-icon">
                                    <Mail class="w-5 h-5" />
                                </div>
                                <div class="contact-info">
                                    <span class="contact-label">Email</span>
                                    <span class="contact-value">{{ personalInfo.email }}</span>
                                </div>
                            </a>
                            <a
                                :href="`tel:${personalInfo.phone}`"
                                class="contact-link"
                            >
                                <div class="contact-icon">
                                    <Phone class="w-5 h-5" />
                                </div>
                                <div class="contact-info">
                                    <span class="contact-label">Phone</span>
                                    <span class="contact-value">{{ personalInfo.phone }}</span>
                                </div>
                            </a>
                            <a
                                :href="`https://github.com/${personalInfo.github}`"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="contact-link"
                            >
                                <div class="contact-icon">
                                    <Github class="w-5 h-5" />
                                </div>
                                <div class="contact-info">
                                    <span class="contact-label">GitHub</span>
                                    <span class="contact-value">{{ personalInfo.github }}</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    <!-- Stats Card -->
                    <div class="about-bento-item stats-card glass-card">
                        <div class="stats-grid">
                            <div
                                v-for="stat in aboutStats"
                                :key="stat.label"
                                class="stat-item"
                            >
                                <span class="stat-value">{{ stat.value }}</span>
                                <span class="stat-label">{{ stat.label }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
    Github,
    ChevronDown
} from 'lucide-vue-next'
import { personalInfo, education, languages } from '@/data/portfolio'

// Expanded motivation state
const expandedMotivation = ref<string | null>(null)

const toggleMotivation = (title: string) => {
    expandedMotivation.value = expandedMotivation.value === title ? null : title
}

const motivations = [
    {
        icon: Code,
        title: 'Clean Architecture',
        description: 'Building scalable, maintainable applications with SOLID principles and modern design patterns.'
    },
    {
        icon: Users,
        title: 'Collaboration',
        description: 'Working with diverse teams to tackle complex challenges and deliver exceptional results.'
    },
    {
        icon: Lightbulb,
        title: 'Innovation',
        description: 'Constantly exploring cutting-edge technologies and pushing the boundaries of what\'s possible.'
    },
    {
        icon: Target,
        title: 'User Experience',
        description: 'Crafting intuitive, delightful interfaces that users love to interact with.'
    }
]

const aboutStats = [
    { value: '3+', label: 'Years Experience' },
    { value: '6+', label: 'Projects Completed' },
    { value: '15+', label: 'Technologies' },
    { value: '100%', label: 'Passion' }
]

const getLanguageLevel = (level: string): string => {
    const levelMap: Record<string, string> = {
        'Native': '100%',
        'Fluent': '90%',
        'Conversational': '70%',
        'Basic': '40%'
    }
    return levelMap[level] || '50%'
}
</script>

<style scoped>
/* About Background */
.about-bg {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 60% 40% at 30% 20%, rgba(201, 169, 98, 0.05) 0%, transparent 50%),
        radial-gradient(ellipse 50% 50% at 70% 80%, rgba(128, 81, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
}

/* About Bento Grid */
.about-bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto auto auto;
    gap: 1.5rem;
}

.about-bento-item {
    padding: 2rem;
    border-radius: var(--radius-lg);
}

/* Bio Card - Spans 2 columns, 2 rows */
.bio-card {
    grid-column: span 2;
    grid-row: span 2;
}

.bio-text {
    font-size: 1.125rem;
    line-height: 1.8;
    color: var(--color-muted-foreground);
    margin-bottom: 2rem;
}

/* Enhanced Drop Cap */
.drop-cap-enhanced::first-letter {
    float: left;
    font-family: var(--font-display);
    font-size: 5em;
    font-weight: 400;
    line-height: 0.75;
    padding-right: 0.15em;
    padding-top: 0.05em;
    background: linear-gradient(135deg, var(--color-foreground) 0%, var(--color-accent) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* Motivations Section */
.motivations-section {
    margin-top: 2rem;
}

.motivations-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--color-foreground);
    margin-bottom: 1rem;
}

.motivations-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.motivation-tag {
    background: var(--color-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: all var(--duration-interaction) var(--ease-shopify);
    max-width: 100%;
}

.motivation-tag:hover {
    border-color: var(--color-accent-purple);
}

.motivation-tag.expanded {
    background: var(--color-accent-purple);
    border-color: var(--color-accent-purple);
    flex-basis: 100%;
}

.motivation-tag.expanded .motivation-tag-header {
    color: var(--color-accent-purple-foreground);
}

.motivation-tag-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-foreground);
}

.motivation-chevron {
    margin-left: auto;
    transition: transform 0.3s ease;
}

.motivation-chevron.rotated {
    transform: rotate(180deg);
}

.motivation-description {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: var(--color-accent-purple-foreground);
    line-height: 1.6;
}

/* Expand Transition */
.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    max-height: 0;
    margin-top: 0;
}

.expand-enter-to,
.expand-leave-from {
    opacity: 1;
    max-height: 100px;
}

/* Education Card */
.education-card {
    grid-column: span 2;
    position: relative;
    overflow: hidden;
}

.education-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-purple) 100%);
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: white;
    margin-bottom: 1.5rem;
}

.education-content {
    position: relative;
    z-index: 1;
}

.education-university {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--color-foreground);
    margin-bottom: 0.5rem;
}

.education-major {
    font-size: 1rem;
    color: var(--color-muted-foreground);
    margin-bottom: 1rem;
}

.education-date {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-accent);
}

.education-decoration {
    position: absolute;
    bottom: -20px;
    right: -20px;
    width: 150px;
    height: 150px;
    background: linear-gradient(135deg, var(--color-accent) 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0.1;
}

/* Languages Card */
.languages-card {
    grid-column: span 1;
}

.languages-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.languages-header h3 {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--color-foreground);
}

.languages-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.language-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.language-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.language-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-foreground);
}

.language-level {
    font-size: 0.75rem;
    color: var(--color-accent-purple);
    font-weight: 500;
}

.language-bar {
    height: 4px;
    background: var(--color-border);
    border-radius: 2px;
    overflow: hidden;
}

.language-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-purple));
    border-radius: 2px;
    transition: width 1s ease-out;
}

/* Contact Card */
.contact-card {
    grid-column: span 1;
}

.contact-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--color-foreground);
    margin-bottom: 1.5rem;
}

.contact-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border-radius: var(--radius);
    transition: all var(--duration-interaction) var(--ease-shopify);
    text-decoration: none;
}

.contact-link:hover {
    background: var(--color-secondary);
}

.contact-link:hover .contact-icon {
    background: var(--color-accent-purple);
    color: var(--color-accent-purple-foreground);
}

.contact-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--color-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent);
    transition: all var(--duration-interaction) var(--ease-shopify);
}

.contact-info {
    display: flex;
    flex-direction: column;
}

.contact-label {
    font-size: 0.75rem;
    color: var(--color-muted-foreground);
}

.contact-value {
    font-size: 0.875rem;
    color: var(--color-foreground);
    font-weight: 500;
}

/* Stats Card */
.stats-card {
    grid-column: span 2;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    text-align: center;
}

.stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.stat-value {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 500;
    color: var(--color-accent);
}

.stat-label {
    font-size: 0.75rem;
    color: var(--color-muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Responsive */
@media (max-width: 1024px) {
    .about-bento-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .bio-card {
        grid-column: span 2;
        grid-row: span 1;
    }

    .education-card {
        grid-column: span 2;
    }

    .stats-card {
        grid-column: span 2;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .about-bento-grid {
        grid-template-columns: 1fr;
    }

    .bio-card,
    .education-card,
    .languages-card,
    .contact-card,
    .stats-card {
        grid-column: span 1;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .drop-cap-enhanced::first-letter {
        font-size: 4em;
    }
}
</style>

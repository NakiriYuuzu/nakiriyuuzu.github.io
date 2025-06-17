<template>
  <div id="resume" class="max-w-4xl mx-auto bg-white text-black p-8 shadow-lg" style="font-family: 'Arial', sans-serif;">
    <!-- Header -->
    <header class="text-center border-b-2 border-gray-900 pb-6 mb-6">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ personalInfo.name }}</h1>
      <h2 class="text-xl text-gray-700 mb-4">{{ personalInfo.title }}</h2>
      <div class="flex justify-center space-x-6 text-sm text-gray-600">
        <span>📧 {{ personalInfo.email }}</span>
        <span>📱 {{ personalInfo.phone }}</span>
        <span>💻 GitHub: {{ personalInfo.github }}</span>
      </div>
    </header>

    <!-- Summary -->
    <section class="mb-6">
      <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">PROFESSIONAL SUMMARY</h3>
      <p class="text-gray-700 leading-relaxed">{{ personalInfo.description }}</p>
    </section>

    <!-- Education -->
    <section class="mb-6">
      <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">EDUCATION</h3>
      <div class="mb-3">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-semibold text-gray-900">{{ education.major }}</h4>
            <p class="text-gray-700">{{ education.university }}</p>
          </div>
          <span class="text-gray-600 text-sm">{{ education.graduation }}</span>
        </div>
      </div>
    </section>

    <!-- Professional Experience -->
    <section class="mb-6">
      <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">PROFESSIONAL EXPERIENCE</h3>
      <div v-for="experience in experiences" :key="experience.company" class="mb-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h4 class="font-semibold text-gray-900">{{ experience.position }}</h4>
            <p class="text-gray-700 font-medium">{{ experience.company }}</p>
          </div>
          <span class="text-gray-600 text-sm">{{ experience.period }}</span>
        </div>
        <ul class="list-disc list-inside text-gray-700 text-sm ml-4">
          <li v-for="desc in experience.description" :key="desc">{{ desc }}</li>
        </ul>
      </div>
    </section>

    <!-- Technical Skills -->
    <section class="mb-6">
      <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">TECHNICAL SKILLS</h3>
      <div v-for="skill in skills" :key="skill.category" class="mb-3">
        <h4 class="font-semibold text-gray-900 mb-1">{{ skill.category }}:</h4>
        <p class="text-gray-700 text-sm">{{ skill.technologies.join(', ') }}</p>
      </div>
    </section>

    <!-- Projects -->
    <section class="mb-6">
      <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">KEY PROJECTS</h3>
      <div v-for="project in projects.slice(0, 4)" :key="project.name" class="mb-3">
        <h4 class="font-semibold text-gray-900">{{ project.name }}</h4>
        <p class="text-gray-700 text-sm mb-1">{{ project.description }}</p>
        <p class="text-gray-600 text-xs">Technologies: {{ project.technologies.join(', ') }}</p>
      </div>
    </section>

    <!-- Languages -->
    <section>
      <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">LANGUAGES</h3>
      <div class="grid grid-cols-2 gap-2">
        <div v-for="language in languages" :key="language.name" class="flex justify-between">
          <span class="text-gray-700">{{ language.name }}</span>
          <span class="text-gray-600 text-sm">{{ language.level }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { personalInfo, education, experiences, skills, projects, languages } from '@/data/portfolio'
</script>

<style scoped>
/* Print styles */
@media print {
  #resume {
    box-shadow: none;
    margin: 0;
    padding: 20px;
  }
}
</style>
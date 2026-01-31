import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useScrollStore = defineStore('scroll', () => {
    const scrollY = ref(0)
    const activeSection = ref<string>('hero')
    const sectionProgress = ref<Record<string, number>>({})
    const viewportHeight = ref(0)
    const documentHeight = ref(0)

    const normalizedProgress = computed(() => {
        if (documentHeight.value <= viewportHeight.value) return 0
        return scrollY.value / (documentHeight.value - viewportHeight.value)
    })

    function setScrollY(value: number) {
        scrollY.value = value
    }

    function setActiveSection(section: string) {
        activeSection.value = section
    }

    function setSectionProgress(section: string, progress: number) {
        sectionProgress.value[section] = Math.max(0, Math.min(1, progress))
    }

    function setViewportHeight(height: number) {
        viewportHeight.value = height
    }

    function setDocumentHeight(height: number) {
        documentHeight.value = height
    }

    return {
        scrollY,
        activeSection,
        sectionProgress,
        viewportHeight,
        documentHeight,
        normalizedProgress,
        setScrollY,
        setActiveSection,
        setSectionProgress,
        setViewportHeight,
        setDocumentHeight
    }
})

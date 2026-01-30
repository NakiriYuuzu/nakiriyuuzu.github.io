import { ref, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'

export interface TypewriterOptions {
    /**
     * Typing speed in milliseconds per character
     */
    speed?: number
    /**
     * Delay before starting to type (ms)
     */
    startDelay?: number
    /**
     * Whether to show a blinking cursor
     */
    showCursor?: boolean
    /**
     * Cursor character
     */
    cursor?: string
    /**
     * Whether to loop the animation
     */
    loop?: boolean
    /**
     * Delay before restarting the loop (ms)
     */
    loopDelay?: number
    /**
     * Delete speed for loop mode (ms)
     */
    deleteSpeed?: number
    /**
     * Start typing automatically
     */
    autoStart?: boolean
}

export function useTypewriter(
    text: string | Ref<string>,
    options: TypewriterOptions = {}
) {
    const {
        speed = 80,
        startDelay = 0,
        showCursor = true,
        cursor = '|',
        loop = false,
        loopDelay = 2000,
        deleteSpeed = 40,
        autoStart = true
    } = options

    const displayText = ref('')
    const isTyping = ref(false)
    const isDeleting = ref(false)
    const isComplete = ref(false)
    const isPaused = ref(false)

    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let charIndex = 0

    const sourceText = computed(() =>
        typeof text === 'string' ? text : text.value
    )

    const textWithCursor = computed(() => {
        if (!showCursor) return displayText.value
        const cursorVisible = isTyping.value || isDeleting.value || !isComplete.value
        return displayText.value + (cursorVisible ? cursor : '')
    })

    const clearTimeout = () => {
        if (timeoutId !== null) {
            window.clearTimeout(timeoutId)
            timeoutId = null
        }
    }

    const typeChar = () => {
        if (isPaused.value) return

        if (charIndex < sourceText.value.length) {
            displayText.value = sourceText.value.substring(0, charIndex + 1)
            charIndex++
            timeoutId = setTimeout(typeChar, speed + Math.random() * 50)
        } else {
            isTyping.value = false
            isComplete.value = true

            if (loop) {
                timeoutId = setTimeout(() => {
                    isDeleting.value = true
                    deleteChar()
                }, loopDelay)
            }
        }
    }

    const deleteChar = () => {
        if (isPaused.value) return

        if (charIndex > 0) {
            charIndex--
            displayText.value = sourceText.value.substring(0, charIndex)
            timeoutId = setTimeout(deleteChar, deleteSpeed)
        } else {
            isDeleting.value = false
            isComplete.value = false
            timeoutId = setTimeout(start, startDelay)
        }
    }

    const start = () => {
        clearTimeout()
        charIndex = 0
        displayText.value = ''
        isTyping.value = true
        isComplete.value = false
        isDeleting.value = false
        isPaused.value = false
        timeoutId = setTimeout(typeChar, startDelay)
    }

    const pause = () => {
        isPaused.value = true
    }

    const resume = () => {
        if (!isPaused.value) return
        isPaused.value = false

        if (isTyping.value) {
            typeChar()
        } else if (isDeleting.value) {
            deleteChar()
        }
    }

    const reset = () => {
        clearTimeout()
        charIndex = 0
        displayText.value = ''
        isTyping.value = false
        isComplete.value = false
        isDeleting.value = false
        isPaused.value = false
    }

    onMounted(() => {
        if (autoStart) {
            start()
        }
    })

    onUnmounted(() => {
        clearTimeout()
    })

    // Watch for text changes
    if (typeof text !== 'string') {
        watch(text, () => {
            reset()
            if (autoStart) {
                start()
            }
        })
    }

    return {
        displayText,
        textWithCursor,
        isTyping,
        isDeleting,
        isComplete,
        isPaused,
        start,
        pause,
        resume,
        reset
    }
}

/**
 * Typewriter effect for multiple strings
 */
export function useTypewriterSequence(
    texts: string[] | Ref<string[]>,
    options: TypewriterOptions & { sequenceDelay?: number } = {}
) {
    const { sequenceDelay = 1500, ...typewriterOptions } = options

    const currentIndex = ref(0)
    const displayText = ref('')
    const isTyping = ref(false)
    const isComplete = ref(false)

    const sourceTexts = computed(() =>
        Array.isArray(texts) ? texts : texts.value
    )

    const currentText = computed(() =>
        sourceTexts.value[currentIndex.value] || ''
    )

    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let charIndex = 0

    const clearTimeout = () => {
        if (timeoutId !== null) {
            window.clearTimeout(timeoutId)
            timeoutId = null
        }
    }

    const typeChar = () => {
        const text = currentText.value

        if (charIndex < text.length) {
            displayText.value = text.substring(0, charIndex + 1)
            charIndex++
            timeoutId = setTimeout(typeChar, typewriterOptions.speed || 80)
        } else {
            isTyping.value = false

            // Move to next text or loop
            timeoutId = setTimeout(() => {
                deleteChar()
            }, sequenceDelay)
        }
    }

    const deleteChar = () => {
        if (charIndex > 0) {
            charIndex--
            displayText.value = currentText.value.substring(0, charIndex)
            timeoutId = setTimeout(deleteChar, typewriterOptions.deleteSpeed || 40)
        } else {
            // Move to next text
            currentIndex.value = (currentIndex.value + 1) % sourceTexts.value.length
            timeoutId = setTimeout(start, typewriterOptions.startDelay || 300)
        }
    }

    const start = () => {
        clearTimeout()
        charIndex = 0
        displayText.value = ''
        isTyping.value = true
        isComplete.value = false
        timeoutId = setTimeout(typeChar, typewriterOptions.startDelay || 0)
    }

    const reset = () => {
        clearTimeout()
        currentIndex.value = 0
        charIndex = 0
        displayText.value = ''
        isTyping.value = false
        isComplete.value = false
    }

    onMounted(() => {
        if (typewriterOptions.autoStart !== false) {
            start()
        }
    })

    onUnmounted(() => {
        clearTimeout()
    })

    return {
        displayText,
        currentIndex,
        currentText,
        isTyping,
        isComplete,
        start,
        reset
    }
}

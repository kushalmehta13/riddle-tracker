<template>
  <form @submit.prevent="onSave" class="w-full max-w-lg bg-white rounded-xl shadow p-8 flex flex-col gap-6 relative">
    <transition name="fade">
      <div v-if="showSaved" class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
        <svg class="w-12 h-12 text-green-500 animate-bounce mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="text-green-700 font-semibold text-lg">Game saved!</span>
      </div>
    </transition>
    <h2 class="text-xl font-bold text-purple-700 mb-2">Today's Riddle</h2>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Riddle Question</label>
      <textarea v-model="question" required rows="2" class="w-full rounded border border-gray-400 focus:border-purple-500 focus:ring focus:ring-purple-200 text-gray-900"></textarea>
      <p v-if="questionError" class="text-red-500 text-xs mt-1">{{ questionError }}</p>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Expected Answer</label>
      <input v-model="expectedAnswer" required type="text" class="w-full rounded border border-gray-400 focus:border-purple-500 focus:ring focus:ring-purple-200 text-gray-900" />
      <p v-if="expectedAnswerError" class="text-red-500 text-xs mt-1">{{ expectedAnswerError }}</p>
    </div>
    <div class="flex items-center gap-4">
      <label class="block text-sm font-medium text-gray-700">Timer (optional)</label>
      <input v-model.number="timerMinutes" type="number" min="0" max="59" step="1" class="w-16 rounded border border-gray-400 text-gray-900" placeholder="min" />
      <span>:</span>
      <input v-model.number="timerSeconds" type="number" min="0" max="59" step="1" class="w-16 rounded border border-gray-400 text-gray-900" placeholder="sec" />
      <button type="button" @click="startTimer" :disabled="timerActive" class="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition">Start</button>
      <button type="button" @click="pauseTimer" :disabled="!timerActive" class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Pause</button>
      <button type="button" @click="resetTimer" class="px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition">Reset</button>
      <span class="ml-2 text-lg font-mono">{{ timerDisplay }}</span>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Actual Answer</label>
      <input v-model="actualAnswer" required type="text" class="w-full rounded border border-gray-400 focus:border-purple-500 focus:ring focus:ring-purple-200 text-gray-900" />
      <p v-if="actualAnswerError" class="text-red-500 text-xs mt-1">{{ actualAnswerError }}</p>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Score</label>
      <div class="flex gap-4">
        <button type="button" @click="score = 0" :class="scoreBtnClass(0)">0</button>
        <button type="button" @click="score = 0.5" :class="scoreBtnClass(0.5)">0.5</button>
        <button type="button" @click="score = 1" :class="scoreBtnClass(1)">1</button>
      </div>
    </div>
    <button type="submit" class="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition">Save Game</button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, defineProps } from 'vue'
import { useGame, type GameEntry as GameEntryType } from '@/composables/useGame'
import { usePlayers } from '@/composables/usePlayers'

const props = defineProps<{ asker: string; answerer: string }>()

const question = ref('')
const expectedAnswer = ref('')
const actualAnswer = ref('')
const score = ref<0 | 0.5 | 1>(1)

const timerMinutes = ref<number | null>(null)
const timerSeconds = ref<number | null>(null)
const timer = ref<number>(0)
const timerActive = ref(false)
let timerInterval: number | null = null

const timerDisplay = computed(() => {
  const t = timer.value
  const min = Math.floor(t / 60)
  const sec = t % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
})

const showSaved = ref(false)
const questionError = ref('')
const expectedAnswerError = ref('')
const actualAnswerError = ref('')

const { addGame } = useGame()
const { players } = usePlayers()

function startTimer() {
  const total = (timerMinutes.value || 0) * 60 + (timerSeconds.value || 0)
  if (total < 1) return
  timer.value = total
  timerActive.value = true
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      timerActive.value = false
      clearInterval(timerInterval!)
      score.value = 0 // auto-score 0 if time expires
    }
  }, 1000) as unknown as number
}

function pauseTimer() {
  timerActive.value = false
  if (timerInterval) clearInterval(timerInterval)
}

function resetTimer() {
  timerActive.value = false
  if (timerInterval) clearInterval(timerInterval)
  timer.value = 0
  timerMinutes.value = null
  timerSeconds.value = null
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

function scoreBtnClass(val: 0 | 0.5 | 1) {
  return [
    'px-4 py-2 rounded font-bold',
    val === score.value ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700',
    'hover:bg-purple-700 hover:text-white transition',
  ].join(' ')
}

function onSave() {
  questionError.value = ''
  expectedAnswerError.value = ''
  actualAnswerError.value = ''
  let valid = true
  if (!question.value.trim()) {
    questionError.value = 'Riddle question is required.'
    valid = false
  }
  if (!expectedAnswer.value.trim()) {
    expectedAnswerError.value = 'Expected answer is required.'
    valid = false
  }
  if (!actualAnswer.value.trim()) {
    actualAnswerError.value = 'Actual answer is required.'
    valid = false
  }
  if (!valid) return

  const today = new Date().toISOString().split('T')[0] // Get current date as YYYY-MM-DD

  const newGame: GameEntryType = {
    id: `${today}-${props.asker}-${props.answerer}`.replace(/\s+/g, '-').toLowerCase(), // Simple unique ID using props
    date: today,
    asker: props.asker,
    answerer: props.answerer,
    question: question.value.trim(),
    expectedAnswer: expectedAnswer.value.trim(),
    actualAnswer: actualAnswer.value.trim(),
    score: score.value,
    responseTime: timerActive.value ? undefined : timer.value
  }

  const added = addGame(newGame)

  if (added) {
    showSaved.value = true
    setTimeout(() => {
      showSaved.value = false
      // Clear form after successful save
      question.value = ''
      expectedAnswer.value = ''
      actualAnswer.value = ''
      score.value = 1
      timerMinutes.value = null
      timerSeconds.value = null
      timer.value = 0
      timerActive.value = false
      if (timerInterval) clearInterval(timerInterval)

    }, 1500)
  } else {
    alert('A game for today with these players already exists.')
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style> 
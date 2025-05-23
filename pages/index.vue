<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300 p-4">
    <div v-if="players" class="w-full max-w-xl flex flex-col items-center">
      <h1 class="text-3xl font-bold text-purple-800 mb-4 text-center">Welcome, {{ players[0] }} &amp; {{ players[1] }}!</h1>
      <p class="text-lg text-gray-700 mb-6 text-center">Ready to play your daily riddle game?</p>
      
      <div class="flex gap-4 mb-8">
        <button @click="goToSetup" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">Change Players</button>
        <button @click="goToHistory" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Game History</button>
      </div>

      <!-- Today's Game Section -->
      <div class="w-full bg-white rounded-xl shadow p-8 flex flex-col gap-6">
        <h2 class="text-xl font-bold text-center text-purple-700">Today's Game</h2>
        
        <!-- Game Entry Form for Current Turn -->
        <div v-if="currentAsker && currentAnswerer">
           <h3 class="text-lg font-semibold mb-4 text-center">{{ currentAsker }}'s Turn to Ask</h3>
          <GameEntry :asker="currentAsker" :answerer="currentAnswerer" @game-saved="handleGameSaved" />
        </div>

        <div v-else class="text-center text-green-700 font-semibold mt-4">
          Today's games are complete!
        </div>

      </div>

    </div>
    <div v-else>
      <p class="text-lg text-gray-700">Redirecting to setup...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayers } from '@/composables/usePlayers'
import { useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import GameEntry from '@/components/GameEntry.vue'
import { useGame, type GameEntry as GameEntryType } from '@/composables/useGame'

const router = useRouter()
const { players, getPlayers, getOriginalPlayers } = usePlayers()
const { getGamesForToday } = useGame()

const originalPlayers = ref<[string, string] | null>(null)
const todayGames = ref<GameEntryType[]>([])

const p1TurnComplete = computed(() => {
  if (!originalPlayers.value) return false
  return todayGames.value.some(g => g.asker === originalPlayers.value?.[0])
})

const p2TurnComplete = computed(() => {
   if (!originalPlayers.value) return false
  return todayGames.value.some(g => g.asker === originalPlayers.value?.[1])
})

const currentAsker = computed(() => {
  if (!originalPlayers.value) return null
  if (!p1TurnComplete.value) {
    return originalPlayers.value[0] // Player 1 asks first
  } else if (!p2TurnComplete.value) {
    return originalPlayers.value[1] // Then Player 2 asks
  } else {
    return null // Both turns complete
  }
})

const currentAnswerer = computed(() => {
   if (!originalPlayers.value) return null
  if (!p1TurnComplete.value) {
    return originalPlayers.value[1]
  } else if (!p2TurnComplete.value) {
    return originalPlayers.value[0]
  } else {
    return null
  }
})

onMounted(() => {
  players.value = getPlayers()
  originalPlayers.value = getOriginalPlayers()
  if (!players.value || !originalPlayers.value) {
    router.replace('/setup')
  } else {
     fetchTodayGames()
  }
})

function fetchTodayGames(){
    todayGames.value = getGamesForToday()
}

function handleGameSaved(game: GameEntryType) {
  // After a game is saved, refetch today's games to update UI and determine next turn
  console.log('Game saved:', game)
  fetchTodayGames()
  console.log("Today's games after save:", todayGames.value)
  console.log('P1 turn complete:', p1TurnComplete.value)
  console.log('P2 turn complete:', p2TurnComplete.value)
  console.log('Current asker after save:', currentAsker.value)
}

function goToSetup() {
  router.push('/setup')
}

function goToHistory() {
  router.push('/history')
}
</script>

<style scoped>
/* Add any specific styles for the index page if needed */
</style> 
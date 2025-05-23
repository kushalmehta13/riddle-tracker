<template>
  <form @submit.prevent="onSubmit" class="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow flex flex-col gap-6">
    <h2 class="text-2xl font-bold text-center text-purple-700 mb-2">Player Setup</h2>
    <div>
      <label for="player1" class="block text-sm font-medium text-gray-700">Player 1 Name</label>
      <input id="player1" v-model="player1" type="text" required maxlength="20" class="mt-1 block w-full rounded border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 text-gray-900" />
      <p v-if="error1" class="text-red-500 text-xs mt-1">{{ error1 }}</p>
    </div>
    <div>
      <label for="player2" class="block text-sm font-medium text-gray-700">Player 2 Name</label>
      <input id="player2" v-model="player2" type="text" required maxlength="20" class="mt-1 block w-full rounded border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200" />
      <p v-if="error2" class="text-red-500 text-xs mt-1">{{ error2 }}</p>
    </div>
    <button type="submit" class="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition">Start Game</button>
  </form>
</template>

<script setup lang="ts">
/**
 * PlayerSetup.vue
 *
 * A form for entering two player names with validation.
 * Emits 'setup-complete' with player names on success.
 */
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'setup-complete', players: [string, string]): void }>()

const player1 = ref('')
const player2 = ref('')
const error1 = ref('')
const error2 = ref('')

function validate(): boolean {
  error1.value = ''
  error2.value = ''
  let valid = true
  if (!player1.value.trim()) {
    error1.value = 'Player 1 name is required.'
    valid = false
  }
  if (!player2.value.trim()) {
    error2.value = 'Player 2 name is required.'
    valid = false
  }
  if (player1.value.trim() && player2.value.trim() && player1.value.trim() === player2.value.trim()) {
    error2.value = 'Names must be unique.'
    valid = false
  }
  return valid
}

function onSubmit() {
  if (validate()) {
    emit('setup-complete', [player1.value.trim(), player2.value.trim()])
  }
}
</script>

<style scoped>
form {
  min-width: 320px;
}
</style> 
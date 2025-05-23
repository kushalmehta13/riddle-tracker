import { ref } from 'vue'

/**
 * usePlayers composable
 *
 * Provides reactive player names and local storage persistence.
 */
const STORAGE_KEY = 'riddle-players'

const players = ref<[string, string] | null>(null)
const originalPlayers = ref<[string, string] | null>(null)

function loadPlayers() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        players.value = JSON.parse(stored)
        originalPlayers.value = players.value // Store original order
      } catch {
        players.value = null
        originalPlayers.value = null
      }
    }
  }
}

function setPlayers(newPlayers: [string, string]) {
  players.value = newPlayers
  originalPlayers.value = newPlayers // Store original order
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlayers))
  }
}

function getPlayers(): [string, string] | null {
  if (!players.value) loadPlayers()
  return players.value
}

function getOriginalPlayers(): [string, string] | null {
  if (!originalPlayers.value) loadPlayers()
  return originalPlayers.value
}

export function usePlayers() {
  loadPlayers() // Load players initially
  return { players, getPlayers, setPlayers, getOriginalPlayers }
} 
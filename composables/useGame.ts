import { ref } from 'vue'

/**
 * useGame composable
 *
 * Manages game entries in local storage.
 */
export interface GameEntry {
  id: string;
  date: string; // ISO date
  asker: string;
  answerer: string;
  question: string;
  expectedAnswer: string;
  actualAnswer: string;
  score: 0 | 0.5 | 1;
  responseTime?: number;
}

const STORAGE_KEY = 'riddle-games'
const games = ref<GameEntry[]>([])

function loadGames() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        games.value = JSON.parse(stored)
      } catch {
        games.value = []
      }
    }
  }
}

function saveGames() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games.value))
  }
}

function getGames(): GameEntry[] {
  if (!games.value.length) loadGames()
  return games.value
}

function getGamesForToday(): GameEntry[] {
  loadGames()
  const today = new Date().toISOString().split('T')[0]
  return games.value.filter(g => g.date === today)
}

function addGame(entry: GameEntry) {
  // Prevent duplicate for same date and players
  const exists = games.value.find(
    g => g.date === entry.date && g.asker === entry.asker && g.answerer === entry.answerer
  )
  if (exists) return false
  games.value.push(entry)
  saveGames()
  return true
}

function findGameByDate(date: string, asker: string, answerer: string): GameEntry | undefined {
  if (!games.value.length) loadGames()
  return games.value.find(g => g.date === date && g.asker === asker && g.answerer === answerer)
}

export function useGame() {
  loadGames() // Load games initially
  return { games, getGames, getGamesForToday, addGame, findGameByDate }
}

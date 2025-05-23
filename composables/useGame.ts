import { ref, type Ref } from 'vue'
import { usePlayers } from './usePlayers'

const GAMES_STORAGE_KEY = 'riddle-games'

export interface GameEntry {
  date: string // Use a string format like 'YYYY-MM-DD' or Date.toDateString()
  asker: string
  answerer: string
  riddle: string
  answer: string
  timer: number // Time in seconds
  attempts: number
  result: 'Solved' | 'Unsolved'
  notes?: string
}

/**
 * Composable to manage game data using local storage.
 * Provides functions to add game entries, retrieve all games, and find games by date.
 */
export function useGame() {
  const games: Ref<GameEntry[]> = ref(loadGames())

  /**
   * Loads game entries from local storage.
   * @returns {GameEntry[]} An array of game entries.
   */
  function loadGames(): GameEntry[] {
    if (typeof window !== 'undefined') {
      const storedGames = localStorage.getItem(GAMES_STORAGE_KEY)
      if (storedGames) {
        try {
          // Parse and return the stored games. Ensure dates are handled if needed later.
          return JSON.parse(storedGames) as GameEntry[]
        } catch (e) {
          console.error('Failed to parse games from local storage:', e)
          return []
        }
      }
    }
    return []
  }

  /**
   * Saves the current game entries to local storage.
   * @param {GameEntry[]} currentGames - The array of game entries to save.
   */
  function saveGames(currentGames: GameEntry[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(currentGames))
    }
  }

  /**
   * Adds a new game entry to the list and saves to local storage.
   * @param {GameEntry} game - The game entry to add.
   */
  function addGame(game: GameEntry) {
    // In a real application, you might want more robust validation or checks
    // For this app, we allow multiple games on the same day with different asker/answerer
    games.value.push(game)
    saveGames(games.value)
  }

  /**
   * Retrieves all game entries.
   * @returns {GameEntry[]} An array of all game entries.
   */
  function getGames(): GameEntry[] {
    return games.value
  }

  /**
   * Retrieves game entries for the current date.
   * @returns {GameEntry[]} An array of game entries for the current date.
   */
  function getGamesForToday(): GameEntry[] {
    const today = new Date().toDateString()
    return games.value.filter(game => game.date === today)
  }


  /**
   * Finds a specific game entry by date and asker/answerer.
   * This might be useful later for editing or viewing a specific game.
   * @param {string} dateString - The date of the game.
   * @param {string} asker - The asker in the game.
   * @param {string} answerer - The answerer in the game.
   * @returns {GameEntry | undefined} The found game entry or undefined if not found.
   */
  function findGame(dateString: string, asker: string, answerer: string): GameEntry | undefined {
    return games.value.find(game =>
      game.date === dateString && game.asker === asker && game.answerer === answerer
    )
  }

  return {
    games,
    addGame,
    getGames,
    getGamesForToday,
    findGame,
  }
}

import { ref, type Ref } from 'vue'

const PLAYERS_STORAGE_KEY = 'riddle-players'
const ORIGINAL_PLAYERS_STORAGE_KEY = 'riddle-original-players'

/**
 * Composable to manage player names using local storage.
 */
export function usePlayers() {
  const players: Ref<[string, string] | null> = ref(null)

  /**
   * Sets the current players and stores them in local storage.
   * Also stores the original players if they are not already set.
   * @param {string[]} playerNames - An array containing two player names.
   */
  function setPlayers(playerNames: string[]) {
    if (playerNames.length === 2 && playerNames.every(name => name.trim() !== '')) {
      players.value = playerNames as [string, string]
      localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players.value))

      // Store original players only once
      if (!localStorage.getItem(ORIGINAL_PLAYERS_STORAGE_KEY)) {
        localStorage.setItem(ORIGINAL_PLAYERS_STORAGE_KEY, JSON.stringify(players.value))
      }
    } else {
      console.error('Invalid player names provided.')
      // Optionally clear invalid players from storage
      // localStorage.removeItem(PLAYERS_STORAGE_KEY)
      // players.value = null
    }
  }

  /**
   * Retrieves the current players from local storage.
   * @returns {[string, string] | null} An array of two player names or null if not set.
   */
  function getPlayers(): [string, string] | null {
    if (players.value) {
      return players.value
    }
    const storedPlayers = localStorage.getItem(PLAYERS_STORAGE_KEY)
    if (storedPlayers) {
      try {
        players.value = JSON.parse(storedPlayers) as [string, string]
        return players.value
      } catch (e) {
        console.error('Failed to parse players from local storage:', e)
        return null
      }
    }
    return null
  }

   /**
   * Retrieves the original players set during the first setup from local storage.
   * @returns {[string, string] | null} An array of two player names or null if not set.
   */
  function getOriginalPlayers(): [string, string] | null {
     const storedOriginalPlayers = localStorage.getItem(ORIGINAL_PLAYERS_STORAGE_KEY)
    if (storedOriginalPlayers) {
      try {
        return JSON.parse(storedOriginalPlayers) as [string, string]
      } catch (e) {
        console.error('Failed to parse original players from local storage:', e)
        return null
      }
    }
    return null
  }


  /**
   * Clears the player data from local storage.
   */
  function clearPlayers() {
    localStorage.removeItem(PLAYERS_STORAGE_KEY)
    localStorage.removeItem(ORIGINAL_PLAYERS_STORAGE_KEY)
    players.value = null
  }

  return {
    players,
    setPlayers,
    getPlayers,
    getOriginalPlayers,
    clearPlayers,
  }
} 
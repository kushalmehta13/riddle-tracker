import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { usePlayers } from './usePlayers'
import { reactive } from 'vue'

describe('usePlayers', () => {
  // Mock localStorage
  const localStorageMock = (
    function() {
      let store: { [key: string]: string } = {}
      return {
        getItem: function(key: string) {
          return store[key] || null
        },
        setItem: function(key: string, value: string) {
          store[key] = value.toString()
        },
        removeItem: function(key: string) {
          delete store[key]
        },
        clear: function() {
          store = {}
        }
      }
    }
  )()

  Object.defineProperty(window, 'localStorage', { value: localStorageMock })

  beforeEach(() => {
    localStorage.clear()
  })

  it('should set and get players', () => {
    const { setPlayers, getPlayers } = usePlayers()
    setPlayers(['Alice', 'Bob'])
    expect(getPlayers()).toEqual(['Alice', 'Bob'])
  })

  it('should persist players in localStorage', () => {
    const { setPlayers } = usePlayers()
    setPlayers(['Charlie', 'David'])
    const storedPlayers = localStorage.getItem('riddle-players')
    expect(storedPlayers).toBe(JSON.stringify(['Charlie', 'David']))
  })

  it('should load players from localStorage', () => {
    localStorage.setItem('riddle-players', JSON.stringify(['Eve', 'Frank']))
    const { getPlayers } = usePlayers()
    expect(getPlayers()).toEqual(['Eve', 'Frank'])
  })

  it('should return null if no players in localStorage', () => {
    const { getPlayers } = usePlayers()
    expect(getPlayers()).toBeNull()
  })

  it('should store and retrieve original players', () => {
    const { setPlayers, getOriginalPlayers } = usePlayers()
    setPlayers(['Grace', 'Heidi'])
    expect(getOriginalPlayers()).toEqual(['Grace', 'Heidi'])
  })
}) 
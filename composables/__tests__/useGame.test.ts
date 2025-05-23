import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useGame } from './useGame'
import { GameEntryType } from '@/types' // Assuming you have a types file
import { ref } from 'vue'

describe('useGame', () => {
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

  it('should add a game entry', () => {
    const { addGame, getGames } = useGame()
    const gameEntry: GameEntryType = {
      date: new Date().toDateString(),
      asker: 'Alice',
      answerer: 'Bob',
      riddle: 'What has an eye, but cannot see?',
      answer: 'A needle',
      timer: 60,
      attempts: 1,
      result: 'Solved',
      notes: 'Easy one',
    }
    addGame(gameEntry)
    const games = getGames()
    expect(games.length).toBe(1)
    expect(games[0]).toEqual(gameEntry)
  })

  it('should retrieve all game entries', () => {
    const { addGame, getGames } = useGame()
    const game1: GameEntryType = {
      date: new Date().toDateString(),
      asker: 'Alice',
      answerer: 'Bob',
      riddle: 'Riddle 1',
      answer: 'Answer 1',
      timer: 60,
      attempts: 1,
      result: 'Solved',
      notes: '',
    }
    const game2: GameEntryType = {
      date: new Date().toDateString(),
      asker: 'Charlie',
      answerer: 'David',
      riddle: 'Riddle 2',
      answer: 'Answer 2',
      timer: 120,
      attempts: 3,
      result: 'Unsolved',
      notes: '',
    }
    addGame(game1)
    addGame(game2)
    const games = getGames()
    expect(games.length).toBe(2)
    expect(games).toEqual([game1, game2])
  })

  it('should find games by date', () => {
    const { addGame, findGameByDate } = useGame()
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    const game1: GameEntryType = {
      date: today,
      asker: 'Alice',
      answerer: 'Bob',
      riddle: 'Riddle 1',
      answer: 'Answer 1',
      timer: 60,
      attempts: 1,
      result: 'Solved',
      notes: '',
    }
    const game2: GameEntryType = {
      date: today,
      asker: 'Charlie',
      answerer: 'David',
      riddle: 'Riddle 2',
      answer: 'Answer 2',
      timer: 120,
      attempts: 3,
      result: 'Unsolved',
      notes: '',
    }
    const game3: GameEntryType = {
      date: yesterday,
      asker: 'Eve',
      answerer: 'Frank',
      riddle: 'Riddle 3',
      answer: 'Answer 3',
      timer: 90,
      attempts: 2,
      result: 'Solved',
      notes: '',
    }
    addGame(game1)
    addGame(game2)
    addGame(game3)

    const todayGames = findGameByDate(today)
    expect(todayGames.length).toBe(2)
    expect(todayGames).toEqual([game1, game2])

    const yesterdayGames = findGameByDate(yesterday)
    expect(yesterdayGames.length).toBe(1)
    expect(yesterdayGames).toEqual([game3])

    const tomorrowGames = findGameByDate('Tomorrow')
    expect(tomorrowGames.length).toBe(0)
    expect(tomorrowGames).toEqual([])
  })

  // Note: The current addGame logic allows duplicates based on date. 
  // If the requirement changes to disallow multiple games on the same day, 
  // this test would need to be updated and the addGame logic modified.
  it('should allow multiple games on the same day', () => {
    const { addGame, getGames } = useGame()
    const today = new Date().toDateString()

    const game1: GameEntryType = {
      date: today,
      asker: 'Alice',
      answerer: 'Bob',
      riddle: 'Riddle 1',
      answer: 'Answer 1',
      timer: 60,
      attempts: 1,
      result: 'Solved',
      notes: '',
    }
    const game2: GameEntryType = {
      date: today,
      asker: 'Bob',
      answerer: 'Alice',
      riddle: 'Riddle 2',
      answer: 'Answer 2',
      timer: 120,
      attempts: 3,
      result: 'Unsolved',
      notes: '',
    }
    addGame(game1)
    addGame(game2)
    const games = getGames()
    expect(games.length).toBe(2)
    expect(games).toEqual([game1, game2])
  })
}) 
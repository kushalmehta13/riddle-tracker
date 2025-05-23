<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
    <PlayerSetup @setup-complete="handleSetup" />
  </div>
</template>

<script setup lang="ts">
import PlayerSetup from '@/components/PlayerSetup.vue'
import { usePlayers } from '@/composables/usePlayers'
import { useRouter } from 'vue-router'

const router = useRouter()
const { setPlayers } = usePlayers()

function handleSetup(players: [string, string]) {
  setPlayers(players)
  router.push('/')
}
</script> 
<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { useAuth } from './stores/auth';
import { computed } from 'vue'

const handleLogout = () => {
  useAuth().logout()
}

const isLogged = computed(() => {
  return useAuth().isLoggedIn
})
</script>

<template>
  <div class=" h-screen">
    <nav class="flex flex-wrap justify-around items-center py-4 font-semibold border-b-2 shadow-sm" v-if="isLogged" aria-label="">
      <RouterLink to="/" class="text-xs md:text-lg">Home</RouterLink>
      <RouterLink to="/statistics" class="text-xs md:text-lg">Statistics</RouterLink>
      <RouterLink to="/history" class="text-xs md:text-lg">History</RouterLink>
      <RouterLink to="/players" class="text-xs md:text-lg">Players</RouterLink>
      <button @click="handleLogout" class="text-xs md:text-lg">Logout</button>
    </nav>
    <nav class="flex flex-wrap justify-around items-center py-4 font-semibold border-b-2 shadow-sm" v-else aria-label="">
      <h1>SCREW</h1>
      <div class="flex justify-around items-center gap-20">
        <RouterLink to="/login" class="text-xs md:text-lg">Login</RouterLink>
        <RouterLink to="/register" class="text-xs md:text-lg">Register</RouterLink>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

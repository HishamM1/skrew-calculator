<template>
    <div class="h-[calc(100vh-100px)] container mx-auto flex items-center flex-col text-xs sm:text-md md:text-2xl">
        <h1 class="text-2xl font-semibold mb-4">History</h1>
        <table class="text-center w-full">
            <thead>
                <tr class="border-b">
                    <th class="font-semibold pr-2">Date</th>
                    <th class="font-semibold pr-2">Players</th>
                    <th class="font-semibold pr-2">Winner</th>
                    <th class="font-semibold pr-2">Total</th>
                    <th class="font-semibold pr-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(game, index) in games" :key="game.id" :class="index % 2 === 0 ? 'bg-gray-100' : ''">
                    <td class="font-semibold pr-2">{{ game.created_at }}</td>
                    <td class="font-semibold pr-2">{{ game.players }}</td>
                    <td class="font-semibold pr-2">{{ game.winner }}</td>
                    <td class="font-semibold pr-2">{{ game.total }}</td>
                    <td class="font-semibold pr-2 flex flex-wrap gap-2 justify-center items-center">
                        <button @click="removeGame(game.id)" class="text-red-500  text-xs sm:text-md md:text-2xl">Delete</button>
                        <RouterLink :to="{ name: 'history-detail', params: { id: game.id } }" class="text-blue-500  text-xs sm:text-md md:text-2xl">View</RouterLink>
                    </td>
                </tr>
            </tbody>
        
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../stores/auth';

const userId = useAuth().user.id

const games = ref([])

onMounted(async () => {
    const { data, error } = await supabase.from('games').select('*').eq('user_id', userId)
    if (error) console.log(error)
    games.value = data
    // format created_at date
    games.value.forEach(async (game) => {
        const date = new Date(game.created_at)
        game.created_at = date.toLocaleDateString()

        const { data:players, error:er } = await supabase.from('game_player').select('*, players (id, name)').eq('game_id', game.id)
        if (er) console.log(er)

        game.players = players.length
        game.winner = players.sort((a, b) => a.total_score - b.total_score)[0].players.name
        game.total = players.sort((a, b) => a.total_score - b.total_score)[0].total_score
    
    })
    console.log(games.value);
})

const removeGame = async (gameId) => {
    if (confirm('Are you sure you want to remove this game?')) {
        const { error } = await supabase.from('games').delete().eq('id', gameId)
        if (error) console.log(error)
        games.value = games.value.filter(id => id !== gameId)
    }
}
</script>
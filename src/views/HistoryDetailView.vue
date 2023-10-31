<template>
        <div class="mt-16">
        <table class="container mx-auto text-center text-xs md:text-base w-full">
            <thead class="text-xs text-gray-700 bg-gray-100  ">
                <th class="w-12"></th>
                <th v-for="player in players" :key="player.player_id">
                    <span class="md:text-lg">{{ player.players.name }}</span>
                </th>
            </thead>
            <tbody>
                <tr class="border-b">
                    <td class="font-semibold pr-2">1st Round</td>
                    <td v-for="player in players" :key="player.player_id">
                        <input type="number" v-model.number="player.first_round" min="0"
                            class="bg-gray-50 border border-black w-full p-2 text-center">
                    </td>
                </tr>
                <tr class="border-b bg-gray-100">
                    <td class="font-semibold pr-2">2nd Round</td>
                    <td v-for="player in players" :key="player.player_id">
                        <input type="number" v-model.number="player.second_round" min="0"
                            class="bg-gray-50 border border-black w-full p-2 text-center">
                    </td>
                </tr>
                <tr class="border-b">
                    <td class="font-semibold pr-2">3rd Round</td>
                    <td v-for="player in players" :key="player.player_id">
                        <input type="number" v-model.number="player.third_round" min="0"
                            class="bg-gray-50 border border-black w-full p-2 text-center">
                    </td>
                </tr>
                <tr class="border-b bg-gray-100">
                    <td class="font-semibold pr-2">4th Round</td>
                    <td v-for="player in players" :key="player.player_id">
                        <input type="number" v-model.number="player.fourth_round" min="0"
                            class="bg-gray-50 border border-black w-full p-2 text-center">
                    </td>
                </tr>
                <tr class="border-b">
                    <td class="font-semibold">5th Round</td>
                    <td v-for="player in players" :key="player.player_id">
                        <input type="number" v-model.number="player.fifth_round" min="0"
                            class="bg-gray-50 border border-black w-full p-2 text-center">
                    </td>
                </tr>
                <tr>
                    <td class="font-semibold pr-2 bg-gray-100">Total</td>
                    <td v-for="player in players" :key="player.player_id">
                        <input type="number" v-model.number="player.total_score"
                            class="bg-gray-50 border border-black w-full p-2 text-center text-red-600 font-semibold"
                            readonly>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabaseClient.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const gameId = route.params.id
const players = ref([])

onMounted(async () => {
    const { data, error } = await supabase.from('game_player').select('*, players (id, name)').eq('game_id', gameId)
    if (error) console.log(error)
    players.value = data
})
</script>

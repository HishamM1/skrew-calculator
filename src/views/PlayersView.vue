<template>
    <div class="flex flex-col justify-center items-center h-[calc(100vh-100px)]">
        <!-- show players -->
        <div class="flex flex-col gap-2">
            <h1 class="underline uppercase text-2xl font-semibold">Players List</h1>
            <div v-if="playersNames.length > 0">
                <div v-for="(player, index) in playersNames" :key="player.id">
                    <div class="flex flex-row gap-2">
                        <p class="text-lg">{{ index + 1 }}.</p>
                        <p class="text-lg">{{ player.name }}</p>
                        <!-- remove button -->
                        <button @click="removePlayer(player.id)" class="text-red-500 text-sm">Delete</button>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="flex flex-row gap-2">
                    <p class="text-lg">No players yet.</p>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <input type="text" v-model="playerName" class="bg-gray-50 border rounded-lg p-2" placeholder="Player name">
                <button @click="addPlayer" class="bg-blue-500 text-white rounded-lg p-2">Add Player</button>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient.js'
import { useAuth } from '../stores/auth';


const userId = useAuth().user.id

onMounted(async () => {
    getPlayers()
})

const playerName = ref('')
const playersNames = ref([])
const addPlayer = async () => {
    const { error } = await supabase
        .from('players')
        .insert([
            { name: playerName.value, user_id: userId }
        ])
    if (error) console.log(error)
    playerName.value = ''
    getPlayers()
}

async function getPlayers() {
    const { data, error } = await supabase.from('players').select('*').eq('user_id', userId)
    if (error) console.log(error)
    playersNames.value = data
}

async function removePlayer(playerId) {
    if (confirm('Are you sure you want to remove this player? All his history will be deleted!')) {
        const { error } = await supabase.from('players').delete().eq('id', playerId)
        if (error) console.log(error)
        getPlayers()
    }
}


</script>
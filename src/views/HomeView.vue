<template>
    <div class="mt-16 ">
        <table class="container mx-auto text-center text-xs md:text-base w-full">
            <thead class="text-xs text-gray-700 bg-gray-100  ">
                <th class="w-12"></th>
                <th v-for="player in players" :key="player.id">
                    <div class="flex flex-col gap-1 items-center justify-center">
                        <button @click="removePlayer(player.id)" class="text-red-500 text-lg">x</button>
                        <select v-model="player.name" class=" w-full bg-gray-50 border rounded-lg p-2">
                            <option value="" disabled selected>Select Player</option>
                            <option v-for="name in playersNames" :key="name.id" :value="name.name">{{ name.name }}
                            </option>
                        </select>
                    </div>
                    <span class="md:text-lg">{{ player.name }}</span>
                </th>
            </thead>
            <tbody>
                <tr class="border-b">
                    <td class="font-semibold pr-2">1st Round</td>
                    <td v-for="player in players" :key="player.id">
                        <input type="number" v-model.number="player.firstRound" min="0"
                            class="bg-gray-50 border border-black w-full p-2 text-center">
                    </td>
                </tr>
                <tr class="border-b bg-gray-100">
                    <td class="font-semibold pr-2">2nd Round</td>
                    <td v-for="player in players" :key="player.id">
                        <input type="number" v-model.number="player.secondRound" min="0"
                            class="bg-gray-50 border border-black w-full p-2 text-center">
                    </td>
                </tr>
                <tr class="border-b">
                    <td class="font-semibold pr-2">3rd Round</td>
                    <td v-for="player in players" :key="player.id">
                        <input type="number" v-model.number="player.thirdRound" min="0"
                            class="bg-gray-50 border border-black w-full p-2 text-center">
                    </td>
                </tr>
                <tr class="border-b bg-gray-100">
                    <td class="font-semibold pr-2">4th Round</td>
                    <td v-for="player in players" :key="player.id">
                        <input type="number" v-model.number="player.fourthRound" min="0"
                            class="bg-gray-50 border border-black w-full p-2 text-center">
                    </td>
                </tr>
                <tr class="border-b">
                    <td class="font-semibold">5th Round</td>
                    <td v-for="player in players" :key="player.id">
                        <input type="number" v-model.number="player.fifthRound" min="0"
                            class="bg-gray-50 border border-black w-full p-2 text-center">
                    </td>
                </tr>
                <tr>
                    <td class="font-semibold pr-2 bg-gray-100">Total</td>
                    <td v-for="player in players" :key="player.id">
                        <input type="number" v-model.number="player.total"
                            class="bg-gray-50 border border-black w-full p-2 text-center text-red-600 font-semibold"
                            readonly>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="flex justify-around">
        <button @click="addPlayer" class="border border-blue-500 text-black px-2 py-1 mt-4 rounded-full shadow-md">Add
            Player</button>
        <button @click="handleFinished"
            class="border border-green-500 text-black px-2 py-1 mt-4 rounded-full shadow-md">Finished</button>
        <button @click="resetPlayers"
            class="border border-red-500 text-black px-2 py-1 mt-4 rounded-full shadow-md">Reset</button>
    </div>
    <ScoreModal :players="players" v-if="showModal" @closeModal="showModal = false" />
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../stores/auth';
import ScoreModal from './Components/ScoreModal.vue';

const playersNames = ref([])
const showModal = ref(false)
const userId = useAuth().user.id

onMounted(async () => {
    // get players names from the database
    const { data, error } = await supabase.from('players').select('*').eq('user_id', userId)

    if (error) console.log(error)
    playersNames.value = data
})

const players = ref([
    { id: 1, name: '', firstRound: '', secondRound: '', thirdRound: '', fourthRound: '', fifthRound: '', total: 0 },
    { id: 2, name: '', firstRound: '', secondRound: '', thirdRound: '', fourthRound: '', fifthRound: '', total: 0 },
    { id: 3, name: '', firstRound: '', secondRound: '', thirdRound: '', fourthRound: '', fifthRound: '', total: 0 },
    { id: 4, name: '', firstRound: '', secondRound: '', thirdRound: '', fourthRound: '', fifthRound: '', total: 0 },
    { id: 5, name: '', firstRound: '', secondRound: '', thirdRound: '', fourthRound: '', fifthRound: '', total: 0 },
])

watch(players.value, () => {
    players.value.forEach(player => {
        player.total = +player.firstRound + +player.secondRound + +player.thirdRound + +player.fourthRound + +player.fifthRound * 2
    })

    players.value.forEach(player => {
        playersNames.value.forEach(name => {
            if (player.name === name.name) {
                player.id = name.id
            }
        })
    })
})

// compute how many players are there in the array by counting names
const playersCount = computed(() => {
    return players.value.filter(player => player.name != "").length
})


const addPlayer = () => {
    let new_id = players.value.length + 1
    players.value.push({ id: new_id, name: '', firstRound: '', secondRound: '', thirdRound: '', fourthRound: '', fifthRound: '', total: 0 })
}

const removePlayer = (id) => {
    if (confirm('Are you sure you want to remove this player?')) {
        players.value = players.value.filter(player => player.id !== id)
        resetIds()
    }

}

function resetIds() {
    players.value.forEach((player, index) => {
        player.id = index + 1
    })
}

function resetPlayers() {
    if (confirm('Are you sure you want to reset the players?')) {
        players.value.forEach(player => {
            player.name = ''
            player.firstRound = ''
            player.secondRound = ''
            player.thirdRound = ''
            player.fourthRound = ''
            player.fifthRound = ''
            player.total = 0
        })
    }
}

const handleFinished = async () => {
    if (playersCount.value < 2) {
        return alert('You need at least 2 players to play!')
    }

    showModal.value = true

    const { data, error } = await supabase.from('games').insert([
        { user_id: userId }
    ]).select()

    if (error) console.log(error)
    console.log(data);
    const gameId = data[0].id

    players.value.forEach(async player => {
        if (player.name === '' && player.total === 0) return;
        const { data, error } = await supabase.from('game_player').insert([
            { game_id: gameId, player_id: player.id, first_round: player.firstRound, second_round: player.secondRound, third_round: player.thirdRound, fourth_round: player.fourthRound, fifth_round: player.fifthRound, total_score: player.total }
        ]).select()
        if (error) console.log(error)
    })

}

</script>
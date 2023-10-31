<template>
    <div class="fixed top-0 right-0 bottom-0 left-0 z-40 bg-opacity-50 bg-black" @click.self="$emit('closeModal')
        ">
        <div
            class=" p-4 md:p-8 min-h-min w-full md:w-5/6 bg-white rounded-lg shadow-lg right-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-screen overflow-y-auto">
            <div>
                <h1 class="text-2xl font-semibold mb-4">Leaderboard</h1>
                <button class="absolute right-4 top-4 border bg-opacity-50 border-black rounded-full px-2 bg-white cursor-pointer"
                    @click="$emit('closeModal')">X</button>
            </div>
            <div>
                <table class="w-full text-center">
                    <thead>
                        <tr class="border-b">
                            <th class="font-semibold pr-2">Rank</th>
                            <th class="font-semibold pr-2">Name</th>
                            <th class="font-semibold pr-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(player, index) in playersSortedByTotal" :key="player.id"
                            :class="index % 2 === 0 ? 'bg-gray-100' : ''">
                            <td class="font-semibold pr-2">{{ index + 1 }}</td>
                            <td class="font-semibold pr-2">{{ player.name }}</td>
                            <td class="font-semibold pr-2">{{ player.total }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps(['players'])

const playersSortedByTotal = computed(() => {
    return props.players.filter(player => player.name != "" && player.total != 0).sort((a, b) => a.total - b.total)
})


</script>
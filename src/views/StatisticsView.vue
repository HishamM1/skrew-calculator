<template>
    <div class="container mx-auto w-1/2 py-10" v-if="chartCondition">
        <h1 class="md:text-xl font-semibold">
            1. Average points per game
        </h1>
        <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
        <h1 class="md:text-xl font-semibold">
            2. Number of match played
        </h1>
        <Bar id="my-chart-id2" :options="chartOptions" :data="chartData2" />
        <h1 class="md:text-xl font-semibold">
            3. Number of wins
        </h1>
        <Bar id="my-chart-id3" :options="chartOptions" :data="chartData3" />
    </div>
    <div v-else>
        <h1 class="text-2xl font-semibold text-center mt-16">No plots, play and it will appear!</h1>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../stores/auth';


const userId = useAuth().user.id
const names = ref([])
const points = ref([])

const names_match_played = ref([])
const number_match_played = ref([])

const names_wins = ref([])
const number_wins = ref([])

const chartCondition = computed(() => {
    return names.value.length > 0 && points.value.length > 0 && names_match_played.value.length > 0 && number_match_played.value.length > 0 && names_wins.value.length > 0 && number_wins.value.length > 0
})

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = computed(() => {
    return {
        labels: names.value,
        datasets: [
            {
                label: 'Average points per game',
                data: points.value,
                backgroundColor: '#f87979',
            }
        ],
    }
})

const chartData2 = computed(() => {
    return {
        labels: names_match_played.value,
        datasets: [
            {
                label: 'Number of match played',
                data: number_match_played.value,
                backgroundColor: '#faebd6',
            }
        ],
    }
})

const chartData3 = computed(() => {
    return {
        labels: names_wins.value,
        datasets: [
            {
                label: 'Number of wins',
                data: number_wins.value,
                backgroundColor: '#1763cf',
            }
        ],
    }
})

const chartOptions = {
    responsive: true,
}




onMounted(async () => {
    let { data: players_id, error: er } = await supabase.from('players').select('id').eq('user_id', userId)
    if (er) console.log(er)
    players_id = players_id.map(player => player.id)

    const { data, error } = await supabase.from('player_average_points').select('*').in('player_id', players_id)
    if (error) console.log(error)
    // destructuring data to get the names and points to pass to the chart
    names.value = data.map(player => player.name)
    points.value = data.map(player => player.average_points_per_game)

    // get number of match played
    const { data: matches, error: err } = await supabase.from('match_played').select('*').in('player_id', players_id)
    if (err) console.log(err)
    names_match_played.value = matches.map(player => player.name)
    number_match_played.value = matches.map(player => player.count)

    // number of wins
    const { data: wins, error: e } = await supabase.from('player_lowest_score').select('*').in('player_id', players_id)
    if (e) console.log(e)
    names_wins.value = wins.map(player => player.name)
    number_wins.value = wins.map(player => player.times_lowest_score)

})



</script>
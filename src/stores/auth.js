import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from "vue-router";

export const useAuth = defineStore('auth', () => {
    const user = ref(null)
    const isLoggedIn = computed(() => user.value !== null)
    const router = useRouter();

    async function login(email, password) {
        const {data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) {
            return error
        }
        getUser()

        router.push({ name: 'home' })
    }
    async function logout() {
        const { data, error } = await supabase.auth.signOut()
        if (error) {
            return error
        }
        user.value = null
        router.push({ name: 'login' })
    }
    async function register(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if (error) {
            return error
        }
        user.value = data.user
        router.push({ name: 'home' })
    }

    async function getUser() {
        if(localStorage.getItem('sb-mmbbvrgjkilapiuuozcs-auth-token')) {
            const session = JSON.parse(localStorage.getItem('sb-mmbbvrgjkilapiuuozcs-auth-token'))
            user.value = session?.user ?? null
        }
    }

    return { user, isLoggedIn, login, logout, register, getUser }
})
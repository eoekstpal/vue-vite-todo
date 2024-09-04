<template>
  <div id="app">
    <LoginPage v-if="!user" />
    <TodoList v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './services/supabase'
import { User } from '@supabase/supabase-js'
import LoginPage from './components/database/LoginPage.vue'
import TodoList from './components/database/TodoList.vue'

const user = ref<User | null>(null)

onMounted(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    user.value = session?.user ?? null
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })
})
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

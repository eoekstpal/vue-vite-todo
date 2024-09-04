<template>
  <div class="app-container">
    <div class="mobile-container">
      <LoginPage v-if="!user" />
      <TodoList v-else />
    </div>
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
:root {
  --mobile-width: 390px;
  --mobile-height: 844px;
}

html, body {
  margin: 0 ;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  /* background-color: #f0f0f0; */
}

.mobile-container {
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (min-width: 391px) {
  .mobile-container {
    width: var(--mobile-width);
    height: var(--mobile-height);
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
}
</style>
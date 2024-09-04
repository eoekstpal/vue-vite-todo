<template>
  <div id="app">
    <TodoList />
  </div>
</template>

<script setup lang="ts">
import TodoList from './components/database/TodoList.vue';
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>

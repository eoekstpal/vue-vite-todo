<template>
  <div class="todo-item">
    <input
      type="checkbox"
      :checked="todo.completed"
      @change="$emit('toggle', todo.id)"
    />
    <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
    <div class="actions">
      <button @click="$emit('edit', todo.id)" class="icon-button">
        <Pencil size="18" />
      </button>
      <button @click="$emit('delete', todo.id)" class="icon-button">
        <Trash2 size="18" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Pencil, Trash2 } from 'lucide-vue-next';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

defineProps<{
  todo: Todo;
}>();

defineEmits<{
  (e: 'toggle', id: number): void;
  (e: 'delete', id: number): void;
  (e: 'edit', id: number): void;
}>();
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

input[type='checkbox'] {
  margin-right: 10px;
}

span {
  flex-grow: 1;
  font-size: 16px;
  margin-right: 10px;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.actions {
  display: flex;
  gap: 5px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: #666;
  transition: color 0.3s;
}

.icon-button:hover {
  color: #000;
}
</style>

<template>
  <li class="todo-item" :class="{ completed: todo.completed }">
    <input
      type="checkbox"
      :checked="todo.completed"
      @change="$emit('toggle', todo.id)"
      class="todo-checkbox"
    />
    <span class="todo-text">{{ todo.text }}</span>
    <div class="todo-actions">
      <button
        @click="$emit('edit', todo.id)"
        class="action-button edit"
        aria-label="Edit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
          ></path>
          <path
            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
          ></path>
        </svg>
      </button>
      <button
        @click="$emit('delete', todo.id)"
        class="action-button delete"
        aria-label="Delete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          ></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Todo {
  id: number;
  text: string;
  is_completed: boolean;
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
  padding: 12px;
  background-color: white;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.todo-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-checkbox {
  margin-right: 12px;
}

.todo-text {
  flex-grow: 1;
  font-size: 16px;
  color: #34495e;
}

.completed .todo-text {
  text-decoration: line-through;
  color: #7f8c8d;
}

.todo-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #bdc3c7;
  transition: color 0.3s;
}

.action-button:hover {
  color: #34495e;
}

.action-button.edit:hover {
  color: #f39c12;
}

.action-button.delete:hover {
  color: #e74c3c;
}
</style>
ㅁ

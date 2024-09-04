<template>
  <div class="todo-app">
    <h1 class="app-title">My Todo List</h1>
    <form @submit.prevent="addTodo" class="todo-form">
      <input
        v-model="newTodo"
        placeholder="What needs to be done?"
        class="todo-input"
      />
      <button type="submit" class="add-button">Add</button>
    </form>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="currentTab = tab"
        :class="{ active: currentTab === tab }"
        class="tab-button"
      >
        {{ tab }}
      </button>
    </div>

    <transition-group name="todo-list" tag="ul" class="todo-list">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @toggle="toggleTodo"
        @delete="deleteTodo"
        @edit="openEditPopup"
      />
    </transition-group>

    <EditTodoModal
      :is-open="isEditPopupOpen"
      :todo-text="editingTodoText"
      @close="closeEditPopup"
      @save="saveEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import TodoItem from './TodoItem.vue';
import EditTodoModal from './EditTodoModal.vue';
import { supabase } from '../../services/supabase';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const todos = ref<Todo[]>([]);
const newTodo = ref('');

const isEditPopupOpen = ref(false);
const editingTodoId = ref<number | null>(null);
const editingTodoText = ref('');

const tabs = ['ALL', 'TODO', 'DONE'];
const currentTab = ref('ALL');

const filteredTodos = computed(() => {
  switch (currentTab.value) {
    case 'TODO':
      return todos.value.filter((todo) => !todo.completed);
    case 'DONE':
      return todos.value.filter((todo) => todo.completed);
    default:
      return todos.value;
  }
});

onMounted(async () => {
  await fetchTodos();
});

async function fetchTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching todos:', error);
  } else {
    todos.value = data || [];
  }
}

async function addTodo() {
  if (newTodo.value.trim()) {
    const { data, error } = await supabase
      .from('todos')
      .insert({ text: newTodo.value.trim(), completed: false })
      .select();

    if (error) {
      console.error('Error adding todo:', error);
    } else if (data) {
      todos.value.push(data[0]);
      newTodo.value = '';
    }
  }
}

async function toggleTodo(id: number) {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', id);

    if (error) {
      console.error('Error toggling todo:', error);
    } else {
      todo.completed = !todo.completed;
    }
  }
}

async function deleteTodo(id: number) {
  const { error } = await supabase.from('todos').delete().eq('id', id);

  if (error) {
    console.error('Error deleting todo:', error);
  } else {
    todos.value = todos.value.filter((t) => t.id !== id);
  }
}

function openEditPopup(id: number) {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) {
    editingTodoId.value = id;
    editingTodoText.value = todo.text;
    isEditPopupOpen.value = true;
  }
}

function closeEditPopup() {
  isEditPopupOpen.value = false;
  editingTodoId.value = null;
  editingTodoText.value = '';
}

async function saveEdit(newText: string) {
  if (editingTodoId.value !== null) {
    const { error } = await supabase
      .from('todos')
      .update({ text: newText.trim() })
      .eq('id', editingTodoId.value);

    if (error) {
      console.error('Error updating todo:', error);
    } else {
      const todo = todos.value.find((t) => t.id === editingTodoId.value);
      if (todo) {
        todo.text = newText.trim();
      }
      closeEditPopup();
    }
  }
}
</script>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.app-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.5em;
}

.todo-form {
  display: flex;
  margin-bottom: 30px;
}

.todo-input {
  flex-grow: 1;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 5px 0 0 5px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.add-button {
  padding: 12px 20px;
  font-size: 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #2980b9;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-button {
  padding: 10px 20px;
  font-size: 14px;
  background-color: #ecf0f1;
  color: #7f8c8d;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-button:first-child {
  border-radius: 5px 0 0 5px;
}

.tab-button:last-child {
  border-radius: 0 5px 5px 0;
}

.tab-button.active {
  background-color: #3498db;
  color: white;
}

.todo-list {
  list-style-type: none;
  padding: 0;
}

.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.5s ease;
}

.todo-list-enter-from,
.todo-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
Last edited 1분 전

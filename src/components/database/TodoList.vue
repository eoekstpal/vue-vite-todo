<template>
  <div class="todo-app">
    <h1 class="app-title">{{ user.user_metadata.name }}'s' Todo List</h1>
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
import {User} from "@supabase/supabase-js";
import {Todo} from '../../types/todo'


defineProps<{
 user: User;
}>();
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
  height: 100%;
  padding:2rem;
  overflow:hidden;
  
}
.todo-list {
  padding: 20px;
  height: 100%;
  overflow-x:auto;
  padding-bottom: 4rem;
}

.app-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.todo-form {
  display: flex;
  margin-bottom: 1.5rem;
}

.todo-input {
  flex-grow: 1;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
}

.add-button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.tabs {
  display: flex;
  margin-bottom: 1rem;
}

.tab-button {
  flex-grow: 1;
  padding: 10px;
  font-size: 0.9rem;
  background-color: #f1f1f1;
  border: none;
  cursor: pointer;
}

.tab-button.active {
  background-color: #4CAF50;
  color: white;
}

.todo-items {
  list-style-type: none;
  padding: 0;
  overflow:auto;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-checkbox {
  margin-right: 10px;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.todo-actions {
  margin-left: auto;
}

.action-button {
  padding: 5px 10px;
  font-size: 0.8rem;
  background-color: #008CBA;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 5px;
}

.action-button.delete {
  background-color: #f44336;
}

.sign-out-button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  font-size: 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
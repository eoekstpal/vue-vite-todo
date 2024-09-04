<template>
  <div class="todo-list">
    <h1>Todo List</h1>
    <form @submit.prevent="addTodo">
      <input v-model="newTodo" placeholder="Add a new todo" />
      <button type="submit">Add</button>
    </form>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="currentTab = tab"
        :class="{ active: currentTab === tab }"
      >
        {{ tab }}
      </button>
    </div>

    <TodoItem
      v-for="todo in filteredTodos"
      :key="todo.id"
      :todo="todo"
      @toggle="toggleTodo"
      @delete="deleteTodo"
      @edit="openEditPopup"
    />

    <!-- Edit Popup -->
    <div v-if="isEditPopupOpen" class="edit-popup">
      <div class="edit-popup-content">
        <h2>Edit Todo</h2>
        <input v-model="editingTodoText" />
        <div class="edit-popup-actions">
          <button @click="saveEdit">Save</button>
          <button @click="closeEditPopup">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TodoItem from './TodoItem.vue';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const todos = ref<Todo[]>([]);
const newTodo = ref('');
let nextId = 1;

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

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: nextId++,
      text: newTodo.value.trim(),
      completed: false,
    });
    newTodo.value = '';
  }
};

const toggleTodo = (id: number) => {
  const todo = todos.value.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
};

const deleteTodo = (id: number) => {
  todos.value = todos.value.filter((todo) => todo.id !== id);
};

const openEditPopup = (id: number) => {
  const todo = todos.value.find((todo) => todo.id === id);
  if (todo) {
    editingTodoId.value = id;
    editingTodoText.value = todo.text;
    isEditPopupOpen.value = true;
  }
};

const closeEditPopup = () => {
  isEditPopupOpen.value = false;
  editingTodoId.value = null;
  editingTodoText.value = '';
};

const saveEdit = () => {
  if (editingTodoId.value !== null) {
    const todo = todos.value.find((todo) => todo.id === editingTodoId.value);
    if (todo) {
      todo.text = editingTodoText.value.trim();
    }
  }
  closeEditPopup();
};
</script>

<style scoped>
.todo-list {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  margin-bottom: 20px;
}

input {
  flex-grow: 1;
  padding: 5px;
  font-size: 16px;
}

button {
  padding: 5px 10px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.tabs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.tabs button {
  flex-grow: 1;
  background-color: #f1f1f1;
  color: black;
  border: 1px solid #ccc;
  padding: 10px;
  cursor: pointer;
}

.tabs button.active {
  background-color: #4caf50;
  color: white;
}

.edit-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.edit-popup-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.edit-popup-actions button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>

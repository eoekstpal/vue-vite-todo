<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
          <h2 class="modal-title">Edit Todo</h2>
          <input
            v-model="localTodoText"
            @keyup.enter="save"
            class="modal-input"
          />
          <div class="modal-actions">
            <button @click="save" class="modal-button save">Save</button>
            <button @click="$emit('close')" class="modal-button cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  todoText: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', text: string): void;
}>();

const localTodoText = ref(props.todoText);

watch(
  () => props.todoText,
  (newText) => {
    localTodoText.value = newText;
  }
);

function save() {
  emit('save', localTodoText.value);
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
}

.modal-title {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.5em;
}

.modal-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-button {
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-button.save {
  background-color: #2ecc71;
  color: white;
}

.modal-button.save:hover {
  background-color: #27ae60;
}

.modal-button.cancel {
  background-color: #e74c3c;
  color: white;
}

.modal-button.cancel:hover {
  background-color: #c0392b;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>

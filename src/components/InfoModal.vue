<script setup lang="ts">
import UiButton from './ui/UIButton.vue'

defineProps<{
  title: string
  message: string
  closeLabel: string
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="overlay" @click="$emit('close')"></div>
  <div class="modal" role="dialog" aria-modal="true" :aria-label="title">
    <header>
      <h2>{{ title }}</h2>
    </header>
    <p>{{ message }}</p>
    <footer>
      <UiButton variant="outline" @click="$emit('close')">{{ closeLabel }}</UiButton>
    </footer>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1001;
  width: min(420px, calc(100% - 32px));
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--background-color);
  transform: translate(-50%, -50%);
}

.modal p {
  margin: 16px 0;
  color: var(--text-secondary);
}

footer {
  display: flex;
  justify-content: flex-end;
}
</style>

<script setup lang="ts">
defineProps<{
  variant: 'primary' | 'danger' | 'outline' | 'icon'
}>()
</script>

<template>
  <button :class="variant">
    <slot></slot>
  </button>
</template>

<style scoped>
.primary {
  background: var(--primary-color);
  color: var(--surface-color);
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
}
.primary:hover {
  opacity: 0.8;
}
.icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
  fill: var(--text-color);
  transition: all 0.25s ease;
  background: none;
  border: none;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon:hover {
  background: var(--primary-color);
}
.icon:hover svg path {
  fill: var(--surface-color);
}

.danger {
  background: var(--error-color);
  color: var(--surface-color);
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
}

.danger:hover {
  opacity: 0.8;
  background: var(--error-color);
  color: var(--surface-color);
}

.outline {
  background: none;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
}
.outline:hover {
  opacity: 0.8;
  background: var(--primary-color);
  color: var(--surface-color);
}
</style>

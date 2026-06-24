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
.icon:hover svg path{
  fill: var(--surface-color);
}
</style>

<script setup lang="ts">
defineProps<{
  ariaLabel: string
  buttons: {
    isActive: boolean
    label: string
    key: string
  }[]
}>()

defineEmits<{
  (e: 'onClick', value: string): void
}>()
</script>

<template>
  <div class="group" role="group" :aria-label="ariaLabel">
    <template v-if="buttons.length > 1">
      <button
        v-for="btn of buttons"
        :key="btn.key"
        :class="{ active: btn.isActive }"
        :aria-pressed="btn.isActive"
        @click="$emit('onClick', btn.key)"
      >
        {{ btn.label }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.group {
  display: inline-flex;
  padding: 3px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  align-self: flex-start;
}

.group button {
  padding: 4px 10px;
  border-radius: 16px;
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    color 0.25s ease;
}

.group button:hover:not(.active) {
  color: var(--text-color);
}

.group button.active {
  background-color: var(--primary-color);
  color: #fff;
}
</style>

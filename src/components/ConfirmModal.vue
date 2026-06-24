<script setup lang="ts">
import UiButton from './ui/UIButton.vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <div class="overlay" @click="emit('close')"></div>
  <div class="container">
    <header>
      <h2>{{ $t('modal.title') }}</h2>
      <UiButton variant="icon" @click="emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
          <path
            fill="#000000"
            d="M10 8.586L2.929 1.515L1.515 2.929L8.586 10l-7.071 7.071l1.414 1.414L10 11.414l7.071 7.071l1.414-1.414L11.414 10l7.071-7.071l-1.414-1.414L10 8.586z"
          />
        </svg>
      </UiButton>
    </header>

    <section class="content">
      <p>{{ $t('modal.message') }}</p>
    </section>

    <footer>
      <UiButton variant="danger" @click="emit('confirm')">
        {{ $t('modal.confirm') }}
      </UiButton>
      <UiButton variant="outline" @click="emit('close')">{{ $t('modal.cancel') }}</UiButton>
    </footer>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

.container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--background-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  font-size: 12px;
  border-bottom: 1px solid var(--border-color);
}

.content {
  padding: 16px;
}

footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>

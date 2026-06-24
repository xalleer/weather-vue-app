<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="app">
    <AppHeader />

    <main class="app-main">
      <div class="container">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 1200px;
  width: 100%;
  min-width: 360px;
  margin: 0 auto;
  padding: 0 16px;
}

.app-main {
  padding: 16px 0;
}
</style>

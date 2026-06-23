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

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <div class="container">
      <h1 class="app-title">Weather</h1>

      <nav class="app-nav">
        <RouterLink to="/">Погода</RouterLink>
        <RouterLink to="/favorites">Вибране</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped></style>

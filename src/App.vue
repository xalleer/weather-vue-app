<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import ConfirmModal from "./components/ConfirmModal.vue";
import {useWeatherStore} from "./stores/weather.ts";

const weatherStore = useWeatherStore()
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

  <Teleport to="body">
    <ConfirmModal
      v-if="weatherStore.isShowConfirmModal"
      @close="weatherStore.isShowConfirmModal = false"
      @confirm="weatherStore.deleteBlock"
    />
  </Teleport>

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

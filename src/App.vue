<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import { useWeatherStore } from './stores/weather.ts'
import InfoModal from './components/InfoModal.vue'
import { onMounted } from 'vue'

const weatherStore = useWeatherStore()

onMounted(async () => {
  weatherStore.loadBlocks()
  await weatherStore.loadWeatherForBlocks()
})
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
    <InfoModal
      v-if="weatherStore.isShowFavoriteLimitModal"
      :title="$t('favoriteLimit.title')"
      :message="$t('favoriteLimit.message')"
      :close-label="$t('favoriteLimit.close')"
      @close="weatherStore.isShowFavoriteLimitModal = false"
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

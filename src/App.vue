<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import { useWeatherStore } from './stores/weather.ts'
import InfoModal from './components/InfoModal.vue'
import { onMounted } from 'vue'
import { useIpStore } from './stores/ip.ts'
import { weatherApi } from './services/api/weather.ts'

const weatherStore = useWeatherStore()
const ipStore = useIpStore()

onMounted(async () => {
  await ipStore.getUserIp()
  if (ipStore.userIp) {
    await ipStore.getLocationByIp(ipStore.userIp)
  }
  weatherStore.loadBlocks()

  const userLocation = ipStore.location
  const locationName = userLocation?.city || userLocation?.region_name || userLocation?.country_name

  if (
    userLocation &&
    locationName &&
    Number.isFinite(userLocation.latitude) &&
    Number.isFinite(userLocation.longitude)
  ) {
    const currentFirstCity = weatherStore.blocks[0]?.selectedCity
    const isPreviouslyDetectedCity = Boolean(
      currentFirstCity &&
        currentFirstCity.lat === userLocation.latitude &&
        currentFirstCity.lon === userLocation.longitude,
    )
    const fallbackCity = {
      name: locationName,
      lat: userLocation.latitude,
      lon: userLocation.longitude,
      country: userLocation.country_code,
      state: userLocation.region_name || undefined,
    }

    try {
      const localizedCity = await weatherApi.getCityByCoordinates(
        userLocation.latitude,
        userLocation.longitude,
      )
      weatherStore.setDefaultCity(localizedCity ?? fallbackCity, isPreviouslyDetectedCity)
    } catch {
      weatherStore.setDefaultCity(fallbackCity, isPreviouslyDetectedCity)
    }
  }

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
  min-width: 0;
  margin: 0 auto;
  padding: 0 16px;
}

@media (max-width: 420px) {
  .app {
    padding: 0 10px;
  }
}

.app-main {
  padding: 16px 0;
}
</style>

<script setup lang="ts">
import { useWeatherStore } from '../stores/weather.ts'
import WeatherCard from '../components/WeatherCard.vue'
import { useI18n } from 'vue-i18n'

const weatherStore = useWeatherStore()
const { t } = useI18n()
</script>
<template>
  <section class="info">
    <h2>{{ t('favorites.title') }}</h2>
  </section>
  <section class="wrapper">
    <template v-for="block of weatherStore.favoriteBlocks" :key="block.id">
      <WeatherCard
        :block="block"
        :error="weatherStore.searchErrorByBlock[block.id] ?? null"
        :filtered-cities="weatherStore.searchResultsByBlock[block.id] ?? []"
        :is-loading="weatherStore.searchLoadingByBlock[block.id] ?? false"
        :weather-loading="weatherStore.weatherLoadingByBlock[block.id] ?? false"
        :weather-error="weatherStore.weatherErrorByBlock[block.id] ?? null"
        :active-block-id="weatherStore.activeBlockId"
        :allow-delete="false"
        @choose-feature="weatherStore.changeFavorite(block)"
        @click="weatherStore.setActiveBlockId(block.id)"
        @change-period="weatherStore.changePeriod"
        @change-time-of-day="weatherStore.changeTimeOfDay"
      />
    </template>
    <p v-if="weatherStore.favoriteBlocks.length === 0">{{ t('favorites.empty') }}</p>
  </section>
</template>

<style scoped>
.wrapper,
.info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px 0;
}

@media (max-width: 768px) {
  .wrapper {
    justify-content: center;
  }
}

@media (max-width: 420px) {
  .wrapper,
  .info {
    gap: 12px;
    padding: 12px 0;
  }
}
</style>

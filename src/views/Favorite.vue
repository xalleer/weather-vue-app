<script setup lang="ts">
import { useWeatherStore } from '../stores/weather.ts'
import WeatherCard from '../components/WeatherCard.vue'

const weatherStore = useWeatherStore()
</script>
<template>
  <section class="info">
    <h2>Збережені</h2>
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
        @choose-feature="weatherStore.changeFavorite(block)"
        @click="weatherStore.setActiveBlockId(block.id)"
        @delete-block="weatherStore.showConfirmModal"
      />
    </template>
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
</style>

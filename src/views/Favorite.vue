<script setup lang="ts">
import {useWeatherStore} from "../stores/weather.ts";
import WeatherCard from "../components/WeatherCard.vue";

const weatherStore = useWeatherStore()

</script>
<template>
  <section class="info">
    <h2>Збережені</h2>
  </section>
  <section class="wrapper">
    <template v-for="block of weatherStore.favoriteBlocks" :key="block.id">
      <WeatherCard :block="block"
                   :error="weatherStore.error"
                   :filteredCities="weatherStore.searchResults"
                   :isLoading="weatherStore.isLoading"
                   :activeBlockId="weatherStore.activeBlockId"
                   @chooseFeature="weatherStore.changeFavorite(block)"
                   @click="weatherStore.setActiveBlockId(block.id)"
                   @handleInput="weatherStore.searchCities($event.searchQuery)"
                   @deleteBlock="weatherStore.showConfirmModal"
      />
    </template>
  </section>
</template>

<style scoped>

.wrapper, .info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px 0;
}
</style>

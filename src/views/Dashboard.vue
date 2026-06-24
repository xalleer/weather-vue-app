<script setup lang="ts">
import { useWeatherStore } from '../stores/weather.ts'
import UIButton from '../components/ui/UIButton.vue'
import WeatherCard, { type WeatherBlock } from '../components/WeatherCard.vue'
import { onMounted } from 'vue'

const weatherStore = useWeatherStore()

const handleInput = (block: WeatherBlock, query: string) => {
  block.searchQuery = query
  weatherStore.searchCities(block.id, query)
}

const handleFocus = (block: WeatherBlock) => {
  block.showDropdown = true
  weatherStore.blocks.forEach((b) => {
    if (b.id !== block.id) {
      b.showDropdown = false
    }
  })
  weatherStore.activeBlockId = block.id
  block.showDropdown = true
  if (block.searchQuery) {
    weatherStore.searchCities(block.id, block.searchQuery)
  }
}

const handleSelectCity = (
  block: WeatherBlock,
  city: Parameters<typeof weatherStore.selectCity>[1],
) => {
  weatherStore.selectCity(block, city)
}

onMounted(() => {
  weatherStore.loadBlocks()
  weatherStore.loadWeatherForBlocks()
})
</script>

<template>
  <section class="add-block-wrapper">
    <h2>Погода</h2>
    <UIButton variant="primary" @click="weatherStore.addBlock()">Новий блок</UIButton>
  </section>
  <section class="wrapper">
    <template v-for="block of weatherStore.blocks" :key="block.id">
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
        @handle-input="handleInput"
        @change-period="weatherStore.changePeriod"
        @handle-focus="handleFocus"
        @select-city="handleSelectCity"
        @delete-block="weatherStore.showConfirmModal"
      />
    </template>
  </section>
</template>

<style scoped>
.add-block-wrapper {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px 0;
}
</style>

<script setup lang="ts">
import {useWeatherStore} from '../stores/weather.ts'
import UIButton from "../components/ui/UIButton.vue";
import WeatherCard, {type WeatherBlock} from "../components/WeatherCard.vue";
import {onMounted} from "vue";

const weatherStore = useWeatherStore()

const handleFocus = (block: WeatherBlock) => {
  console.log(block)
  block.showDropdown = true
  weatherStore.blocks.forEach((b) => {
    if (b.id !== block.id) {
      b.showDropdown = false
    }
  })
  weatherStore.activeBlockId = block.id
  block.showDropdown = true
  if (block.searchQuery) {
    weatherStore.searchCities(block.searchQuery)
  }
}

const handleSelectCity = (block: WeatherBlock) => {
  console.log(block)
  block.showDropdown = false
  block.selectedCity = weatherStore.searchResults[0]
  localStorage.setItem('blocks', JSON.stringify(weatherStore.blocks))
}

onMounted(() => {
  weatherStore.loadBlocks()
})

</script>

<template>
  <section class="add-block-wrapper">
    <h2>Погода</h2>
    <UIButton variant="primary" @click="weatherStore.addBlock()">Новий блок</UIButton>
  </section>
  <section class="wrapper">
    <template v-for="block of weatherStore.blocks" :key="block.id">
      <WeatherCard :block="block"
                   :error="weatherStore.error"
                   :filteredCities="weatherStore.searchResults"
                   :isLoading="weatherStore.isLoading"
                   :activeBlockId="weatherStore.activeBlockId"
                   @chooseFeature="weatherStore.changeFavorite(block)"
                   @click="weatherStore.setActiveBlockId(block.id)"
                   @handleInput="weatherStore.searchCities($event.searchQuery)"
                   @handleFocus="handleFocus"
                   @selectCity="handleSelectCity"
                   @deleteBlock="weatherStore.showConfirmModal"
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

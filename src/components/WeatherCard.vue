<script setup lang="ts">
import type {GeocodedCity} from "../types";
import {computed} from "vue";
import {useLanguageStore} from "../stores/language.ts";
import UIButton from "./ui/UIButton.vue";

export interface WeatherBlock {
  id: number
  searchQuery: string
  showDropdown: boolean
  selectedCity: GeocodedCity | null
  isStar: boolean
}

const languageStore = useLanguageStore()

defineProps<{
  block: WeatherBlock,
  isLoading: boolean,
  filteredCities: GeocodedCity[],
  activeBlockId: number | null
  error: string | null
}>()

defineEmits<{
  (e: 'handleInput', block: WeatherBlock): void
  (e: 'handleFocus', block: WeatherBlock): void
  (e: 'selectCity', block: WeatherBlock): void
  (e: 'chooseFeature', block: WeatherBlock): void
  (e: 'deleteBlock', block: WeatherBlock): void
}>()

const localNamesKey = computed(() => {
  return languageStore.apiLanguage
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="search-container" v-if="!block.selectedCity">
        <div class="searchbar-container">
          <input
              v-model="block.searchQuery"
              autocomplete="address-level2"
              type="search"
              placeholder="Пошук міста..."
              class="search-input"
              @input="$emit('handleInput', block)"
              @focus="$emit('handleFocus', block)"
          />
          <div
              v-if="isLoading && activeBlockId === block.id"
              class="loader-spinner"
          ></div>
        </div>

        <div v-if="error && activeBlockId === block.id" class="search-error">
          {{ error }}
        </div>

        <ul
            v-if="block.showDropdown && activeBlockId === block.id && filteredCities.length > 0"
            class="suggestions-list"
        >
          <li
              @click="$emit('selectCity', block)"
              v-for="city in filteredCities"
              :key="`${city.lat}-${city.lon}`"
              class="suggestion-item"
          >
            <span class="city-name">{{
                city.local_names?.[localNamesKey] ? city.local_names[localNamesKey] : city.name
              }}</span>
            <span class="city-details">
              <span v-if="city.state" class="city-state">{{ city.state }}, </span>
              <span class="city-country">{{ city.country }}</span>
            </span>
          </li>
        </ul>
      </div>
      <div class="selected-city" v-else>
        <span>{{
            block.selectedCity?.local_names?.[localNamesKey] ? block.selectedCity.local_names[localNamesKey] : block.selectedCity?.name
          }}</span>
      </div>

      <UIButton variant="icon" @click="$emit('chooseFeature', block)">
        <svg v-if="!block.isStar" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="#000000"
                d="M21.995 9.933a.5.5 0 0 0-.423-.568l-6.304-.919l-2.82-5.73a.52.52 0 0 0-.896 0l-2.82 5.73l-6.304.92a.5.5 0 0 0-.278.852l4.563 4.46l-1.077 6.3a.5.5 0 0 0 .726.527L12 18.532l5.638 2.973a.506.506 0 0 0 .316.05a.5.5 0 0 0 .41-.576l-1.077-6.3l4.563-4.461a.5.5 0 0 0 .145-.285zM16.4 14.147a.501.501 0 0 0-.143.442l.95 5.558l-4.974-2.623a.506.506 0 0 0-.466 0l-4.974 2.623l.95-5.558a.501.501 0 0 0-.143-.442L3.572 10.21l5.565-.81a.501.501 0 0 0 .376-.275L12 4.07l2.487 5.054a.5.5 0 0 0 .376.274l5.565.811l-4.028 3.938z"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 36 36">
          <path fill="#FFAC33"
                d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.971 1.971 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.978 1.978 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.957 1.957 0 0 1-1.16.379z"/>
        </svg>
      </UIButton>
      <UIButton @click="$emit('deleteBlock', block)" variant="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
        </svg>
      </UIButton>
    </div>
  </div>

</template>

<style scoped>
.card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  width: 100%;
  max-width: 320px;
  height: 350px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  overflow: visible;
  position: relative;
  transition: transform 0.3s ease,
  box-shadow 0.3s ease;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
}


.selected-city,
.search-container {
  position: relative;
  width: 100%;
  padding: 16px;
}

.searchbar-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.25s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--surface-color);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.loader-spinner {
  position: absolute;
  right: 12px;
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.search-error {
  position: absolute;
  top: calc(100% + 4px);
  left: 16px;
  width: calc(100% - 32px);
  color: var(--error-color);
  font-size: 0.8rem;
  padding: 4px 0;
}

.suggestions-list {
  position: absolute;
  top: calc(100% - 8px);
  left: 16px;
  width: calc(100% - 32px);
  max-height: 200px;
  overflow-y: auto;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(30, 41, 59, 0.12);
  list-style: none;
  padding: 6px 0;
  margin: 0;
  z-index: 150;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: color-mix(in srgb, var(--primary-color) 6%, transparent);
}

.city-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-color);
}

.city-details {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.city-state {
  margin-right: 4px;
}

.selected-city span {
  font-weight: 600;
  font-size: 18px;
  color: var(--text-color);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

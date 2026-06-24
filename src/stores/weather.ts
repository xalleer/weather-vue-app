import { defineStore } from 'pinia'
import {computed, ref} from 'vue'
import axios from 'axios'
import type { GeocodedCity } from '../types'
import type {WeatherBlock} from "../components/WeatherCard.vue";
import { weatherApi } from '../services/api/weather.ts'

export const useWeatherStore = defineStore('weather', () => {
  const blocks = ref<WeatherBlock []>([])
  const searchResults = ref<GeocodedCity[]>([])
  const activeBlockId = ref<number | null>(null)

  const isShowConfirmModal = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null

  const loadBlocks = () => {
    const blocksData: WeatherBlock [] = JSON.parse(localStorage.getItem('blocks') || '[]')
    if (blocks) {
      blocks.value = blocksData
    }
  }

  const favoriteBlocks = computed(() => {
    return blocks.value.filter(block => block.isStar)
  })

  const searchCities = async (query: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    if (!query.trim()) {
      searchResults.value = []
      error.value = null
      isLoading.value = false
      return
    }

    isLoading.value = true
    error.value = null

    debounceTimeout = setTimeout(async () => {
      try {
        console.log(query)
        const res: GeocodedCity[] = await weatherApi.searchCities(query)
        searchResults.value = res
        console.log(res)
      } catch (e) {
        console.error(e)
        if (axios.isAxiosError(e)) {
          error.value = e.response?.data?.message || e.message
        } else {
          error.value = (e as Error).message || 'Unknown error occurred'
        }
        searchResults.value = []
      } finally {
        isLoading.value = false
      }
    }, 400)
  }

  const addBlock = () => {
    if (blocks.value.length === 5) return
    blocks.value.push({
      id: blocks.value.length + 1,
      searchQuery: '',
      showDropdown: false,
      selectedCity: null,
      isStar: false
    })
  }

  const setActiveBlockId = (id: number) => {
    activeBlockId.value = id
  }

  const changeFavorite = (block: WeatherBlock) => {
    block.isStar = !block.isStar
    localStorage.setItem('blocks', JSON.stringify(blocks.value))
  }

  const showConfirmModal = (block: WeatherBlock) => {
    isShowConfirmModal.value = true
    activeBlockId.value = block.id
  }

  const deleteBlock = () => {
    blocks.value = blocks.value.filter(b => b.id !== activeBlockId.value)
    isShowConfirmModal.value = false
    activeBlockId.value = null
    localStorage.setItem('blocks', JSON.stringify(blocks.value))
  }

  return {
    blocks,
    searchResults,
    isLoading,
    isShowConfirmModal,
    error,
    activeBlockId,
    favoriteBlocks,
    loadBlocks,
    searchCities,
    addBlock,
    setActiveBlockId,
    changeFavorite,
    deleteBlock,
    showConfirmModal
  }
})

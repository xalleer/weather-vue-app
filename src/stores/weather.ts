import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { api } from '../services/api'
import type { GeocodedCity } from '../types'
import type { AxiosResponse } from 'axios'

export const useWeatherStore = defineStore('weather', () => {
  const searchResults = ref<GeocodedCity[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null

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
        const res: AxiosResponse<GeocodedCity[]> = await api.get('/geo/1.0/direct', {
          params: {
            q: query,
            limit: 5,
          },
        })

        searchResults.value = res.data
        console.log(res.data)
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

  return {
    searchResults,
    isLoading,
    error,
    searchCities,
  }
})

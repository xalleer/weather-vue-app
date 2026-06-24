import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { ForecastData, ForecastPeriod, GeocodedCity, WeatherChartPoint } from '../types'
import type { WeatherBlock } from '../components/WeatherCard.vue'
import { weatherApi } from '../services/api/weather.ts'
import { i18n } from '../services/i18n.ts'

export const useWeatherStore = defineStore('weather', () => {
  const blocks = ref<WeatherBlock[]>([])
  const favoriteBlocks = ref<WeatherBlock[]>([])
  const searchResultsByBlock = ref<Record<number, GeocodedCity[]>>({})
  const searchLoadingByBlock = ref<Record<number, boolean>>({})
  const searchErrorByBlock = ref<Record<number, string | null>>({})
  const weatherLoadingByBlock = ref<Record<number, boolean>>({})
  const weatherErrorByBlock = ref<Record<number, string | null>>({})
  const activeBlockId = ref<number | null>(null)
  const isShowConfirmModal = ref(false)
  const isShowFavoriteLimitModal = ref(false)

  const debounceTimeouts = new Map<number, ReturnType<typeof setTimeout>>()
  const searchControllers = new Map<number, AbortController>()
  const weatherRequestIds = new Map<number, number>()

  const createBlock = (id: number): WeatherBlock => ({
    id,
    searchQuery: '',
    showDropdown: false,
    selectedCity: null,
    isStar: false,
    period: 'day',
    weather: null,
    currentWeather: null,
    chartPoints: [],
  })

  const hydrateBlock = (block: WeatherBlock): WeatherBlock => ({
    ...createBlock(block.id),
    ...block,
    currentWeather: block.currentWeather ?? null,
    chartPoints: block.chartPoints ?? [],
  })

  const cityKey = (city: GeocodedCity) => `${city.lat.toFixed(4)}:${city.lon.toFixed(4)}`
  const persistBlocks = () => localStorage.setItem('blocks', JSON.stringify(blocks.value))
  const persistFavorites = () =>
    localStorage.setItem('favorites', JSON.stringify(favoriteBlocks.value))

  const syncFavoriteState = () => {
    const favoriteKeys = new Set(
      favoriteBlocks.value
        .filter((block) => block.selectedCity)
        .map((block) => cityKey(block.selectedCity as GeocodedCity)),
    )
    blocks.value.forEach((block) => {
      block.isStar = Boolean(block.selectedCity && favoriteKeys.has(cityKey(block.selectedCity)))
    })
  }

  const loadBlocks = () => {
    const storedBlocks: WeatherBlock[] = JSON.parse(localStorage.getItem('blocks') || '[]')
    const favoritesJson = localStorage.getItem('favorites')
    const storedFavorites: WeatherBlock[] = JSON.parse(favoritesJson || '[]')

    blocks.value = storedBlocks.length ? storedBlocks.map(hydrateBlock) : [createBlock(1)]
    const migratedFavorites = favoritesJson
      ? storedFavorites
      : storedBlocks
          .filter((block) => block.isStar && block.selectedCity)
          .map((block, index) => ({
            ...block,
            id: Math.max(0, ...blocks.value.map((item) => item.id)) + index + 1,
          }))
    favoriteBlocks.value = migratedFavorites.map((block) => ({
      ...hydrateBlock(block),
      isStar: true,
    }))
    syncFavoriteState()
    persistBlocks()
    persistFavorites()
  }

  const nextId = () =>
    Math.max(
      0,
      ...blocks.value.map((block) => block.id),
      ...favoriteBlocks.value.map((block) => block.id),
    ) + 1

  const searchCities = (blockId: number, query: string) => {
    const pendingTimeout = debounceTimeouts.get(blockId)
    if (pendingTimeout) clearTimeout(pendingTimeout)

    const previousController = searchControllers.get(blockId)
    searchControllers.delete(blockId)
    previousController?.abort()

    if (!query.trim()) {
      searchResultsByBlock.value[blockId] = []
      searchErrorByBlock.value[blockId] = null
      searchLoadingByBlock.value[blockId] = false
      return
    }

    searchLoadingByBlock.value[blockId] = true
    searchErrorByBlock.value[blockId] = null

    const timeout = setTimeout(async () => {
      debounceTimeouts.delete(blockId)
      const controller = new AbortController()
      searchControllers.set(blockId, controller)

      try {
        searchResultsByBlock.value[blockId] = await weatherApi.searchCities(
          query,
          controller.signal,
        )
      } catch (error) {
        if (axios.isCancel(error)) return
        searchErrorByBlock.value[blockId] = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : (error as Error).message || i18n.global.t('errors.unknown')
        searchResultsByBlock.value[blockId] = []
      } finally {
        if (searchControllers.get(blockId) === controller) {
          searchLoadingByBlock.value[blockId] = false
          searchControllers.delete(blockId)
        }
      }
    }, 400)

    debounceTimeouts.set(blockId, timeout)
  }

  const addBlock = () => {
    if (blocks.value.length >= 5) return
    blocks.value.push(createBlock(nextId()))
    persistBlocks()
  }

  const setActiveBlockId = (id: number) => {
    activeBlockId.value = id
  }

  const changeFavorite = (block: WeatherBlock) => {
    if (!block.selectedCity) return
    const key = cityKey(block.selectedCity)
    const existingIndex = favoriteBlocks.value.findIndex(
      (favorite) => favorite.selectedCity && cityKey(favorite.selectedCity) === key,
    )

    if (existingIndex >= 0) {
      favoriteBlocks.value.splice(existingIndex, 1)
      syncFavoriteState()
      persistFavorites()
      persistBlocks()
      return
    }

    if (favoriteBlocks.value.length >= 5) {
      isShowFavoriteLimitModal.value = true
      return
    }

    favoriteBlocks.value.push({
      ...createBlock(nextId()),
      selectedCity: block.selectedCity,
      searchQuery: block.selectedCity.name,
      period: block.period,
      weather: block.weather,
      currentWeather: block.currentWeather,
      chartPoints: [...block.chartPoints],
      isStar: true,
    })
    syncFavoriteState()
    persistFavorites()
    persistBlocks()
  }

  const showConfirmModal = (block: WeatherBlock) => {
    if (blocks.value.length <= 1) return
    isShowConfirmModal.value = true
    activeBlockId.value = block.id
  }

  const deleteBlock = () => {
    if (blocks.value.length <= 1 || activeBlockId.value === null) {
      isShowConfirmModal.value = false
      activeBlockId.value = null
      return
    }

    const blockId = activeBlockId.value
    const timeout = debounceTimeouts.get(blockId)
    if (timeout) clearTimeout(timeout)
    debounceTimeouts.delete(blockId)
    searchControllers.get(blockId)?.abort()
    searchControllers.delete(blockId)
    delete searchResultsByBlock.value[blockId]
    delete searchLoadingByBlock.value[blockId]
    delete searchErrorByBlock.value[blockId]
    delete weatherLoadingByBlock.value[blockId]
    delete weatherErrorByBlock.value[blockId]
    weatherRequestIds.delete(blockId)

    blocks.value = blocks.value.filter((block) => block.id !== blockId)
    isShowConfirmModal.value = false
    activeBlockId.value = null
    persistBlocks()
  }

  const localDateKey = (unixSeconds: number, timezone: number) =>
    new Date((unixSeconds + timezone) * 1000).toISOString().slice(0, 10)

  const buildChartPoints = (
    forecast: ForecastData,
    period: ForecastPeriod,
    currentTimestamp: number,
    currentTemperature: number,
  ): WeatherChartPoint[] => {
    if (period === 'day') {
      const today = localDateKey(currentTimestamp, forecast.city.timezone)
      const forecastPoints = forecast.list
        .filter((item) => localDateKey(item.dt, forecast.city.timezone) === today)
        .map((item) => ({
          key: String(item.dt + forecast.city.timezone),
          temperature: item.main.temp,
        }))

      return [
        {
          key: String(currentTimestamp + forecast.city.timezone),
          temperature: currentTemperature,
        },
        ...forecastPoints,
      ]
    }

    const dailyTemperatures = new Map<string, number[]>()
    forecast.list.forEach((item) => {
      const date = localDateKey(item.dt, forecast.city.timezone)
      const temperatures = dailyTemperatures.get(date) ?? []
      temperatures.push(item.main.temp)
      dailyTemperatures.set(date, temperatures)
    })

    return Array.from(dailyTemperatures.entries())
      .slice(0, 5)
      .map(([key, temperatures]) => ({
        key,
        temperature: temperatures.reduce((sum, value) => sum + value, 0) / temperatures.length,
      }))
  }

  const isFavoriteBlock = (block: WeatherBlock) =>
    favoriteBlocks.value.some((favorite) => favorite.id === block.id)

  const loadWeatherForBlock = async (block: WeatherBlock) => {
    if (!block.selectedCity) return

    const requestId = (weatherRequestIds.get(block.id) ?? 0) + 1
    weatherRequestIds.set(block.id, requestId)
    weatherLoadingByBlock.value[block.id] = true
    weatherErrorByBlock.value[block.id] = null

    try {
      const [currentWeather, forecast] = await Promise.all([
        weatherApi.getCurrentWeather(block.selectedCity.lat, block.selectedCity.lon),
        weatherApi.getWeather(block.selectedCity.lat, block.selectedCity.lon),
      ])

      if (weatherRequestIds.get(block.id) !== requestId) return
      block.currentWeather = currentWeather
      block.weather = forecast
      block.chartPoints = buildChartPoints(
        forecast,
        block.period,
        currentWeather.dt,
        currentWeather.main.temp,
      )
      if (isFavoriteBlock(block)) persistFavorites()
      else persistBlocks()
    } catch (error) {
      if (weatherRequestIds.get(block.id) !== requestId) return
      weatherErrorByBlock.value[block.id] = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : (error as Error).message || i18n.global.t('errors.unknown')
    } finally {
      if (weatherRequestIds.get(block.id) === requestId) {
        weatherLoadingByBlock.value[block.id] = false
      }
    }
  }

  const selectCity = async (block: WeatherBlock, city: GeocodedCity) => {
    block.selectedCity = city
    block.searchQuery = city.name
    block.showDropdown = false
    syncFavoriteState()
    await loadWeatherForBlock(block)
  }

  const loadWeatherForBlocks = async () => {
    await Promise.allSettled([...blocks.value, ...favoriteBlocks.value].map(loadWeatherForBlock))
  }

  const changePeriod = async (block: WeatherBlock, period: ForecastPeriod) => {
    block.period = period
    if (block.selectedCity) await loadWeatherForBlock(block)
    if (isFavoriteBlock(block)) persistFavorites()
    else persistBlocks()
  }

  return {
    blocks,
    favoriteBlocks,
    searchResultsByBlock,
    searchLoadingByBlock,
    weatherLoadingByBlock,
    isShowConfirmModal,
    isShowFavoriteLimitModal,
    searchErrorByBlock,
    weatherErrorByBlock,
    activeBlockId,
    loadBlocks,
    searchCities,
    selectCity,
    addBlock,
    setActiveBlockId,
    changeFavorite,
    deleteBlock,
    showConfirmModal,
    loadWeatherForBlock,
    changePeriod,
    loadWeatherForBlocks,
  }
})

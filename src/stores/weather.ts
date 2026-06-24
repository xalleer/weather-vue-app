import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'
import type { ForecastData, ForecastPeriod, GeocodedCity, WeatherChartPoint } from '../types'
import type { WeatherBlock } from '../components/WeatherCard.vue'
import { weatherApi } from '../services/api/weather.ts'

export const useWeatherStore = defineStore('weather', () => {
  const blocks = ref<WeatherBlock[]>([])
  const searchResultsByBlock = ref<Record<number, GeocodedCity[]>>({})
  const searchLoadingByBlock = ref<Record<number, boolean>>({})
  const searchErrorByBlock = ref<Record<number, string | null>>({})
  const weatherLoadingByBlock = ref<Record<number, boolean>>({})
  const weatherErrorByBlock = ref<Record<number, string | null>>({})
  const activeBlockId = ref<number | null>(null)

  const isShowConfirmModal = ref(false)
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

  const loadBlocks = () => {
    const blocksData: WeatherBlock[] = JSON.parse(localStorage.getItem('blocks') || '[]')
    blocks.value =
      blocksData.length > 0
        ? blocksData.map((block) => ({
            ...createBlock(block.id),
            ...block,
            currentWeather: block.currentWeather ?? null,
            chartPoints: block.chartPoints ?? [],
          }))
        : [createBlock(1)]
  }

  const favoriteBlocks = computed(() => {
    return blocks.value.filter((block) => block.isStar)
  })

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
        const res = await weatherApi.searchCities(query, controller.signal)
        searchResultsByBlock.value[blockId] = res
      } catch (e) {
        if (axios.isCancel(e)) return

        if (axios.isAxiosError(e)) {
          searchErrorByBlock.value[blockId] = e.response?.data?.message || e.message
        } else {
          searchErrorByBlock.value[blockId] = (e as Error).message || 'Unknown error occurred'
        }
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
    if (blocks.value.length === 5) return
    const nextId = Math.max(0, ...blocks.value.map((block) => block.id)) + 1
    blocks.value.push(createBlock(nextId))
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
    if (activeBlockId.value !== null) {
      const timeout = debounceTimeouts.get(activeBlockId.value)
      if (timeout) clearTimeout(timeout)
      debounceTimeouts.delete(activeBlockId.value)
      searchControllers.get(activeBlockId.value)?.abort()
      searchControllers.delete(activeBlockId.value)
      delete searchResultsByBlock.value[activeBlockId.value]
      delete searchLoadingByBlock.value[activeBlockId.value]
      delete searchErrorByBlock.value[activeBlockId.value]
      delete weatherLoadingByBlock.value[activeBlockId.value]
      delete weatherErrorByBlock.value[activeBlockId.value]
      weatherRequestIds.delete(activeBlockId.value)
    }
    blocks.value = blocks.value.filter((b) => b.id !== activeBlockId.value)
    isShowConfirmModal.value = false
    activeBlockId.value = null
    localStorage.setItem('blocks', JSON.stringify(blocks.value))
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
      localStorage.setItem('blocks', JSON.stringify(blocks.value))
    } catch (e) {
      if (weatherRequestIds.get(block.id) !== requestId) return
      weatherErrorByBlock.value[block.id] = axios.isAxiosError(e)
        ? e.response?.data?.message || e.message
        : (e as Error).message || 'Unknown error occurred'
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
    await loadWeatherForBlock(block)
  }

  const loadWeatherForBlocks = async () => {
    await Promise.allSettled(blocks.value.map(loadWeatherForBlock))
  }

  const changePeriod = async (block: WeatherBlock, period: ForecastPeriod) => {
    block.period = period
    if (block.selectedCity) {
      await loadWeatherForBlock(block)
    }
    localStorage.setItem('blocks', JSON.stringify(blocks.value))
  }

  return {
    blocks,
    searchResultsByBlock,
    searchLoadingByBlock,
    weatherLoadingByBlock,
    isShowConfirmModal,
    searchErrorByBlock,
    weatherErrorByBlock,
    activeBlockId,
    favoriteBlocks,
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

import { api } from './api.ts'
import type { AxiosResponse } from 'axios'
import type { CurrentWeatherData, GeocodedCity, ForecastData } from '../../types'

const searchCities = async (query: string, signal?: AbortSignal) => {
  const res: AxiosResponse<GeocodedCity[]> = await api.get('/geo/1.0/direct', {
    signal,
    params: {
      q: query,
      limit: 5,
    },
  })
  return res.data
}

const getWeather = async (lat: number, lon: number) => {
  const res: AxiosResponse<ForecastData> = await api.get('/data/2.5/forecast', {
    params: { lat, lon },
  })
  return res.data
}

const getCurrentWeather = async (lat: number, lon: number) => {
  const res: AxiosResponse<CurrentWeatherData> = await api.get('/data/2.5/weather', {
    params: { lat, lon },
  })
  return res.data
}

export const weatherApi = { searchCities, getWeather, getCurrentWeather }

import axios from 'axios'
import { useLanguageStore } from '../stores/language.ts'

export const api = axios.create({
  baseURL: '/openweather',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || ''
  const languageStore = useLanguageStore()

  config.params = {
    appid: apiKey,
    lang: languageStore.apiLanguage,
    units: 'metric',
    ...config.params,
  }

  return config
})

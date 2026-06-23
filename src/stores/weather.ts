import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LangType } from '../types'
import { i18n } from '../services/i18n'

export const useWeatherStore = defineStore('weather', () => {
  const language = ref<LangType>((localStorage.getItem('language') as LangType) || 'UK')

  const apiLanguage = computed(() => {
    return language.value === 'UK' ? 'ua' : 'en'
  })

  const changeLanguage = (lang: LangType) => {
    language.value = lang
    localStorage.setItem('language', lang)
    i18n.global.locale = lang
  }

  return {
    language,
    apiLanguage,
    changeLanguage,
  }
})

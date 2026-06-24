import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { LangType } from '../types'
import { i18n } from '../services/i18n.ts'

export const useLanguageStore = defineStore('language', () => {
  const language = ref<LangType>((localStorage.getItem('language') as LangType) || 'UK')

  const apiLanguage = computed(() => {
    return language.value === 'UK' ? 'uk' : 'en'
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

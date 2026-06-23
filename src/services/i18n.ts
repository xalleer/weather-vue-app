import { createI18n } from 'vue-i18n'
import type { LangType } from '../types'
import uk from '../assets/i18n/uk.json'
import en from '../assets/i18n/en.json'

const messages = {
  UK: uk,
  EN: en,
}

export const i18n = createI18n({
  locale: (localStorage.getItem('language') as LangType) || 'UK',
  fallbackLocale: 'UK',
  messages,
})

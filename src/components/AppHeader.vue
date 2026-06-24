<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useLanguageStore } from '../stores/language.ts'
import ToggleButtons from './ui/ToggleButtons.vue'

const languageStore = useLanguageStore()
const isMenuOpen = ref(false)

const languageButtons = computed(() => [
  { isActive: languageStore.language === 'UK', label: 'UA', key: 'UK' },
  { isActive: languageStore.language === 'EN', label: 'EN', key: 'EN' },
])

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLanguageChange = (language: string) => {
  if (language === 'UK' || language === 'EN') {
    languageStore.changeLanguage(language)
  }
}
</script>

<template>
  <header class="header">
    <div class="container">
      <RouterLink to="/" class="app-title" @click="closeMenu"> <span>W</span>eather </RouterLink>

      <div class="desktop-content">
        <nav class="app-nav">
          <RouterLink to="/">{{ $t('header.nav.weather') }}</RouterLink>
          <RouterLink to="/favorites">{{ $t('header.nav.favorites') }}</RouterLink>
        </nav>

        <ToggleButtons
          aria-label="Мова інтерфейсу"
          :buttons="languageButtons"
          @on-click="handleLanguageChange"
        />
      </div>

      <button
        class="burger-btn"
        :class="{ open: isMenuOpen }"
        aria-label="Toggle navigation menu"
        :aria-expanded="isMenuOpen"
        @click="toggleMenu"
      >
        <span class="burger-line"></span>
        <span class="burger-line"></span>
        <span class="burger-line"></span>
      </button>

      <div class="mobile-menu-backdrop" :class="{ active: isMenuOpen }" @click="closeMenu"></div>

      <div class="mobile-menu-drawer" :class="{ open: isMenuOpen }">
        <nav class="mobile-nav">
          <RouterLink to="/" @click="closeMenu">
            {{ $t('header.nav.weather') }}
          </RouterLink>
          <RouterLink to="/favorites" @click="closeMenu">
            {{ $t('header.nav.favorites') }}
          </RouterLink>
        </nav>

        <ToggleButtons
          aria-label="Мова інтерфейсу"
          :buttons="languageButtons"
          @on-click="handleLanguageChange"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--background-color);
  padding: 14px 0;
}

.header > .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.app-title {
  font-size: 1.4rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--text-color);
  letter-spacing: -0.5px;
  white-space: nowrap;
  flex-shrink: 0;
  z-index: 110;
}

.app-title span {
  color: var(--primary-color);
}

.desktop-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.app-nav {
  display: flex;
  gap: 4px;
  align-items: center;
}

.app-nav a {
  position: relative;
  padding: 6px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.app-nav a:hover {
  color: var(--primary-color);
  background-color: color-mix(in srgb, var(--primary-color) 8%, transparent);
}

.app-nav a.router-link-exact-active {
  color: var(--primary-color);
  background-color: color-mix(in srgb, var(--primary-color) 12%, transparent);
  font-weight: 600;
}

.burger-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 110;
}

.burger-line {
  width: 100%;
  height: 2px;
  background-color: var(--text-color);
  border-radius: 2px;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease,
    background-color 0.3s ease;
}

.burger-btn.open .burger-line:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.burger-btn.open .burger-line:nth-child(2) {
  opacity: 0;
}

.burger-btn.open .burger-line:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.mobile-menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(4px);
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.mobile-menu-backdrop.active {
  opacity: 1;
  pointer-events: auto;
}

.mobile-menu-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background-color: var(--surface-color);
  border-left: 1px solid var(--border-color);
  padding: 80px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  z-index: 105;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.05);
}

.mobile-menu-drawer.open {
  transform: translateX(0);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-nav a {
  padding: 10px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.mobile-nav a:hover {
  color: var(--primary-color);
  background-color: color-mix(in srgb, var(--primary-color) 8%, transparent);
}

.mobile-nav a.router-link-exact-active {
  color: var(--primary-color);
  background-color: color-mix(in srgb, var(--primary-color) 12%, transparent);
  font-weight: 600;
}

.mobile-language button {
  padding: 4px 10px;
  border-radius: 16px;
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    color 0.25s ease;
}

.mobile-language button:hover:not(.active) {
  color: var(--text-color);
}

.mobile-language button.active {
  background-color: var(--primary-color);
  color: #fff;
}

@media (max-width: 768px) {
  .desktop-content {
    display: none;
  }

  .burger-btn {
    display: flex;
  }
}

@media (max-width: 420px) {
  .app-title {
    font-size: 1.2rem;
  }

  .mobile-menu-drawer {
    width: 100%;
  }
}
</style>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLanguageStore } from '../stores/language.ts'
import type { ForecastPeriod, WeatherChartPoint } from '../types'

Chart.register(...registerables)

const props = defineProps<{
  period: ForecastPeriod
  points: WeatherChartPoint[]
}>()

const languageStore = useLanguageStore()
const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart<'line'> | null = null

const locale = computed(() => (languageStore.apiLanguage === 'uk' ? 'uk-UA' : 'en-US'))

const labels = computed(() =>
  props.points.map((point) => {
    if (props.period === 'day') {
      return new Intl.DateTimeFormat(locale.value, {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      }).format(new Date(Number(point.key) * 1000))
    }

    const [year, month, day] = point.key.split('-').map(Number)
    return new Intl.DateTimeFormat(locale.value, {
      day: '2-digit',
      month: 'short',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, day)))
  }),
)

const renderChart = () => {
  if (!canvas.value) return
  chart?.destroy()
  chart = new Chart(canvas.value, {
    type: 'line',
    data: {
      labels: labels.value,
      datasets: [
        {
          label: languageStore.apiLanguage === 'uk' ? 'Температура, °C' : 'Temperature, °C',
          data: props.points.map((point) => point.temperature),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { callback: (value) => `${value}°` } },
      },
    },
  })
}

onMounted(renderChart)
watch(() => [props.period, props.points, locale.value], renderChart, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <div class="chart-wrapper">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 175px;
}
</style>

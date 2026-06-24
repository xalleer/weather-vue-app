import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import { ipApi } from '../services/api/ip.ts'
import type { GetByIpResponse } from '../types'

export const useIpStore = defineStore('ip', () => {
  const userIp = ref<string | null>(null)
  const location: Ref<GetByIpResponse | null> = ref(null)

  const getUserIp = async () => {
    try {
      const { ip } = await ipApi.getUserIp()
      userIp.value = ip
    } catch (error) {
      console.error(error)
    }
  }

  const getLocationByIp = async (ip: string) => {
    try {
      const res = await ipApi.getLocationByIp(ip)
      location.value = res
    } catch (error) {
      console.error(error)
    }
  }

  return {
    userIp,
    getUserIp,
    location,
    getLocationByIp,
  }
})

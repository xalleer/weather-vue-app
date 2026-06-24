import axios, {type AxiosResponse} from "axios";
import type {GetByIpResponse} from "../../types";

const getLocationByIp = async (ip: string) => {
  const res: AxiosResponse<GetByIpResponse> = await axios.get(`https://api.ipstack.com/${ip}`, {
    params: {
      access_key: import.meta.env.VITE_IP_STACK_API_KEY
    }
  })
  return res.data
}

const getUserIp = async () => {
  const res: AxiosResponse<{ip: string}> = await axios.get('https://api.ipify.org?format=json')
  return res.data
}

export const ipApi = {
  getLocationByIp,
  getUserIp
}

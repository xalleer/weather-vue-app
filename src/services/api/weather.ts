import { api } from "./api.ts";

const searchCities = async (query: string) => {
  const res = await api.get('/geo/1.0/direct', {
    params: {
      q: query,
      limit: 5,
    },
  })
  return res.data
}

export const weatherApi = { searchCities }

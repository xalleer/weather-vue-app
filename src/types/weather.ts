export type ForecastPeriod = 'day' | '5days'
export type ForecastTimeOfDay = 'day' | 'night'

export interface WeatherChartPoint {
  key: string
  temperature: number
}

export interface CurrentWeatherData {
  dt: number
  timezone: number
  name: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
}

export interface ForecastData {
  cod: '200' | '401' | '500'
  message: number
  cnt: number
  list: Forecast[]
  city: ForecastCity
}

export interface ForecastCity {
  id: number
  name: string
  coord: {
    lat: number
    lon: number
  }
  country: string
  population: number
  timezone: number
  sunrise: number
  sunset: number
}

export interface Forecast {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
    dew_point: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  clouds: {
    all: number
  }
  pop: number
  wind: {
    speed: number
    deg: number
    gust: number
  }
  visibility: number
  sys: {
    pod: string
  }
  dt_txt: string
  rain: {
    '3h': number
  }
  show: {
    '3h': number
  }
}

export interface GetByIpResponse {
  ip: string,
  type: string,
  continent_code: string,
  continent_name: string,
  country_code: string,
  country_name: string,
  region_code: string,
  region_name: string,
  city: string,
  zip: number,
  latitude: number,
  longitude: number,
  msa: null,
  dma: null,
  radius: number,
  ip_routing_type: string,
  connection_type: string,
  location: {
    geoname_id: number,
    capital: string,
    languages: {
      code: string,
      name: string,
      native: string
    }[]
    country_flag: string
    country_flag_emoji: string,
    country_flag_emoji_unicode: string,
    calling_code: number,
    is_eu: boolean
  },
  time_zone: {
    id: string,
    current_time: number,
    gmt_offset: number,
    code: string,
    is_daylight_saving: boolean
  },
  currency: {
    code: string,
    name: string,
    plural: string,
    symbol: symbol,
    symbol_native: symbol
  },
  connection: {
    asn: number,
    isp: string,
    sld: string,
    tld: string,
    carrier: string,
    home: boolean,
    organization_type: string,
    isic_code: string,
    naics_code: number
  }
}

export interface Country {
  name: { common: string }
  capital: string[]
  flags: { png: string }
  region?: string
  subregion?: string
  latlng: [number, number]
}
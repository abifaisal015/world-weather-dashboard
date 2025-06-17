<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import type { Country } from '../types/country'
import SearchBar from './../components/SearchBar.vue'
import LoadingModal from './../components/LoadingModal.vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import { SunIcon, MoonIcon } from '@heroicons/vue/20/solid'

// Props
const props = defineProps<{
  sidebarOpen: boolean
  countries: Country[]
}>()

const emit = defineEmits(['update:sidebarOpen'])

// Date format function
const formattedDate = ref<string | null>(null)
async function getDate(value: [number, number]) {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${value[0]}&longitude=${value[1]}&current_weather=true`,
    )
    if (response.data && response.data.current_weather) {
      return new Date(response.data.current_weather.time).toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    return '-'
  } catch (error) {
    console.error('Error :', error)
    return '-'
  }
}

// Temperature function
const temperature = ref<string | null>(null)
async function getTemperature(value: [number, number]) {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${value[0]}&longitude=${value[1]}&current_weather=true`,
    )
    if (response.data) {
      return (
        response.data.current_weather?.temperature +
        response.data.current_weather_units?.temperature
      )
    }
    return '-'
  } catch (error) {
    console.error('Error :', error)
    return '-'
  }
}

// Is Day function
const isDay = ref<number | null>(null)
async function getIsDay(value: [number, number]) {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${value[0]}&longitude=${value[1]}&current_weather=true`,
    )
    if (response.data) {
      return response.data.current_weather?.is_day
    }
    return '-'
  } catch (error) {
    console.error('Error :', error)
    return '-'
  }
}

// Weather Code function
const weatherCode = ref<number | null>(null)
async function getWeatherCode(value: [number, number]) {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${value[0]}&longitude=${value[1]}&current_weather=true`,
    )
    if (response.data) {
      return response.data.current_weather?.weathercode
    }
    return '-'
  } catch (error) {
    console.error('Error :', error)
    return '-'
  }
}

// Interval function
const interval = ref<string | null>(null)
async function getInterval(value: [number, number]) {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${value[0]}&longitude=${value[1]}&current_weather=true`,
    )
    if (response.data) {
      return (
        response.data.current_weather?.interval +
        ' ' +
        response.data.current_weather_units?.interval
      )
    }
    return '-'
  } catch (error) {
    console.error('Error :', error)
    return '-'
  }
}

// Wind Speed function
const windSpeed = ref<string | null>(null)
async function getWindSpeed(value: [number, number]) {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${value[0]}&longitude=${value[1]}&current_weather=true`,
    )
    if (response.data) {
      return (
        response.data.current_weather?.windspeed +
        ' ' +
        response.data.current_weather_units?.windspeed
      )
    }
    return '-'
  } catch (error) {
    console.error('Error :', error)
    return '-'
  }
}

// Wind Speed function
const windDirection = ref<string | null>(null)
async function getWindDirection(value: [number, number]) {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${value[0]}&longitude=${value[1]}&current_weather=true`,
    )
    if (response.data) {
      return (
        response.data.current_weather?.winddirection +
        ' ' +
        response.data.current_weather_units?.winddirection
      )
    }
    return '-'
  } catch (error) {
    console.error('Error :', error)
    return '-'
  }
}

// Watch
const selectedCountry = ref<Country | null>(null)
const loading = ref(false)

watch(
  () => selectedCountry.value,
  async (country) => {
    // Loading Start
    loading.value = true

    // Define Values
    const latlng: [number, number] =
      country && Array.isArray(country.latlng) && country.latlng.length >= 2
        ? [country.latlng[0], country.latlng[1]]
        : [-5.0, 120.0]

    formattedDate.value = await getDate(latlng)
    temperature.value = await getTemperature(latlng)
    isDay.value = await getIsDay(latlng)
    weatherCode.value = await getWeatherCode(latlng)
    interval.value = await getInterval(latlng)
    windSpeed.value = await getWindSpeed(latlng)
    windDirection.value = await getWindDirection(latlng)

    // Loading End
    loading.value = false
  },
  { immediate: true },
)
</script>

<template>
  <div class="lg:pl-72">
    <!-- Search -->
    <SearchBar
      :type="'home'"
      :countries="props.countries"
      :sidebarOpen="props.sidebarOpen"
      @update:sidebarOpen="emit('update:sidebarOpen', $event)"
      @update:selectedCountry="selectedCountry = $event"
    />

    <!-- Dashboard -->
    <main class="bg-gray-50 py-8 sm:py-16">
      <div class="mx-auto px-6 lg:px-8">
        <div class="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <div class="relative lg:row-span-2 lg:col-span-2">
            <div class="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl shadow-md" />
            <div
              class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]"
            >
              <div class="grid gap-4 lg:grid-cols-2">
                <div class="px-8 lg:pe-0 lg:ps-10 lg:pt-10 pb-0 max-lg:row-start-2">
                  <p class="text-2xl lg:text-3xl font-medium text-indigo-600">
                    Forecast in
                    {{
                      selectedCountry && selectedCountry.name
                        ? selectedCountry.name.common
                        : 'Indonesia'
                    }}
                  </p>
                  <table class="mt-2 w-full">
                    <tbody>
                      <tr class="text-base lg:text-xl text-gray-950">
                        <td width="30%">Capital City</td>
                        <td width="5%" class="text-center">:</td>
                        <td width="65%">
                          {{ selectedCountry ? selectedCountry.capital[0] : 'Jakarta' }}
                        </td>
                      </tr>
                      <tr class="text-sm lg:text-lg text-gray-600">
                        <td>Region</td>
                        <td class="text-center">:</td>
                        <td>
                          {{ selectedCountry ? selectedCountry.subregion : 'South-Eastern Asia' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="px-8 pt-8 lg:ps-0 lg:pe-10 lg:pt-10 pb-0 max-lg:row-start-1">
                  <img
                    class="shadow-md w-30 lg:w-40 ml-auto max-lg:mx-auto"
                    :src="
                      selectedCountry && selectedCountry.flags
                        ? selectedCountry.flags.png
                        : 'https://flagcdn.com/w320/id.png'
                    "
                    alt="Flag"
                  />
                </div>
              </div>
              <div class="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
                <div
                  class="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl"
                >
                  <GoogleMap
                    api-key="AIzaSyAAlDQNG0XQTzZsJkGEJwRyv4sUnVUTnck"
                    class="h-full w-full"
                    :center="
                      selectedCountry && selectedCountry.latlng
                        ? { lat: selectedCountry.latlng[0], lng: selectedCountry.latlng[1] }
                        : { lat: -5.0, lng: 120.0 }
                    "
                    :zoom="4"
                  >
                    <Marker
                      :options="{
                        position:
                          selectedCountry && selectedCountry.latlng
                            ? { lat: selectedCountry.latlng[0], lng: selectedCountry.latlng[1] }
                            : { lat: -5.0, lng: 120.0 },
                      }"
                    />
                  </GoogleMap>
                </div>
              </div>
            </div>
            <div
              class="pointer-events-none absolute inset-px rounded-lg shadow-md ring-1 ring-black/5 lg:rounded-l-4xl"
            />
          </div>
          <div class="relative max-lg:row-start-1">
            <div
              class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-4xl lg:rounded-tr-4xl shadow-md"
            />
            <div
              class="relative flex place-content-between h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tr-[calc(2rem+1px)]"
            >
              <div class="px-8 pt-8 sm:px-10 sm:pt-10">
                <SunIcon
                  v-if="isDay == 1"
                  class="w-15 max-lg:mx-auto text-yellow-500"
                  aria-hidden="true"
                />
                <MoonIcon v-else class="w-15 max-lg:mx-auto text-indigo-900" aria-hidden="true" />
                <p
                  class="mt-3 text-5xl font-medium tracking-tight text-indigo-600 max-lg:text-center"
                >
                  {{ temperature ? temperature : '' }}
                </p>
              </div>
              <div class="px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-8">
                <p class="mt-2 lg:text-lg max-w-lg text-gray-600 max-lg:text-center">
                  {{ formattedDate ? formattedDate : '' }}
                </p>
                <div class="mt-2 font-bold lg:text-xl max-w-lg text-gray-950 max-lg:text-center">
                  <p v-if="weatherCode == 0">Clear Sky</p>
                  <p v-else-if="weatherCode == 1 || weatherCode == 2 || weatherCode == 3">
                    Mainly clear, partly cloudy, and overcast
                  </p>
                  <p v-else-if="weatherCode == 45 || weatherCode == 48">
                    Fog and depositing rime fog
                  </p>
                  <p v-else-if="weatherCode == 51 || weatherCode == 53 || weatherCode == 55">
                    Drizzle: Light, moderate, and dense intensity
                  </p>
                  <p v-else-if="weatherCode == 56 || weatherCode == 57">
                    Freezing Drizzle: Light and dense intensity
                  </p>
                  <p v-else-if="weatherCode == 61 || weatherCode == 63 || weatherCode == 65">
                    Rain: Slight, moderate, and heavy intensity
                  </p>
                  <p v-else-if="weatherCode == 66 || weatherCode == 67">
                    Freezing Rain: Light and heavy intensity
                  </p>
                  <p v-else-if="weatherCode == 71 || weatherCode == 73 || weatherCode == 75">
                    Snow fall: Slight, moderate, and heavy intensity
                  </p>
                  <p v-else-if="weatherCode == 77">Snow grains</p>
                  <p v-else-if="weatherCode == 80 || weatherCode == 81 || weatherCode == 82">
                    Rain showers: Slight, moderate, and violent
                  </p>
                  <p v-else-if="weatherCode == 85 || weatherCode == 86">
                    Snow showers slight and heavy
                  </p>
                  <p v-else-if="weatherCode == 95">Thunderstorm: Slight or moderate</p>
                  <p v-else-if="weatherCode == 96 || weatherCode == 99">
                    Thunderstorm with slight and heavy hail
                  </p>
                  <p v-else>-</p>
                </div>
              </div>
            </div>
            <div
              class="pointer-events-none absolute inset-px rounded-lg shadow-md ring-1 ring-black/5 max-lg:rounded-t-4xl lg:rounded-tr-4xl"
            />
          </div>
          <div class="relative max-lg:row-start-3">
            <div
              class="absolute inset-px rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-br-4xl shadow-md"
            />
            <div
              class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]"
            >
              <div class="px-8 pt-8 sm:px-10 sm:pt-10">
                <ul role="list" class="divide-y divide-gray-300">
                  <li class="flex justify-between items-center py-5">
                    <div class="flex items-center gap-x-2">
                      <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                          fill="#4f39f6"
                          stroke="none"
                        >
                          <path
                            d="M2042 5019 c-26 -13 -55 -39 -70 -62 l-27 -41 0 -215 c0 -242 3 -256 72 -308 35 -27 42 -28 165 -31 l128 -4 0 -132 0 -132 -67 -14 c-234 -45 -488 -153 -730 -310 -22 -14 -28 -10 -145 107 -68 66 -137 128 -155 137 -50 25 -123 21 -169 -10 -59 -39 -262 -243 -292 -293 -31 -53 -34 -119 -7 -171 9 -19 71 -90 137 -156 l119 -121 -51 -79 c-65 -98 -158 -290 -200 -409 -66 -189 -102 -380 -116 -609 -5 -94 -11 -127 -27 -154 -15 -25 -22 -58 -25 -118 l-5 -84 -71 0 c-91 -1 -145 -24 -181 -79 -22 -33 -28 -55 -32 -123 -6 -97 7 -154 44 -199 37 -44 80 -59 166 -59 l74 0 5 -89 c6 -103 26 -146 86 -183 32 -20 53 -23 150 -27 l113 -3 41 -62 c119 -177 310 -380 473 -501 655 -489 1535 -537 2235 -123 52 31 133 84 180 119 104 76 335 307 411 409 342 460 476 1041 368 1598 -44 226 -158 511 -279 696 l-51 79 119 121 c66 66 128 137 137 156 24 45 24 115 0 160 -23 46 -237 264 -294 301 -52 34 -122 39 -174 13 -18 -9 -87 -71 -155 -137 -117 -117 -123 -121 -145 -107 -242 157 -496 265 -729 310 l-68 14 0 132 0 132 128 4 c123 3 130 4 165 31 69 52 72 66 72 308 l0 215 -27 41 c-16 24 -44 49 -70 62 -44 21 -54 21 -614 21 -562 0 -570 0 -612 -21z m1178 -138 c15 -29 13 -354 -2 -369 -17 -17 -1109 -17 -1126 0 -8 8 -12 64 -12 184 0 144 3 175 16 188 14 14 79 16 564 16 533 0 550 -1 560 -19z m-360 -643 l0 -123 -205 0 -205 0 0 123 0 122 205 0 205 0 0 -122z m40 -272 c754 -101 1385 -657 1574 -1387 79 -305 79 -655 1 -949 -205 -769 -852 -1319 -1644 -1400 -131 -13 -236 -13 -359 1 -554 60 -1032 339 -1355 792 l-56 78 22 37 c16 27 23 59 27 122 l5 85 43 -80 c65 -119 145 -227 257 -343 251 -262 539 -423 901 -504 87 -19 128 -22 339 -22 211 0 252 3 339 22 232 52 470 155 646 280 175 124 362 323 477 507 50 79 139 271 171 370 60 183 77 298 77 525 0 173 -4 223 -23 318 -108 535 -441 976 -918 1215 -551 277 -1191 240 -1709 -97 -447 -291 -742 -798 -772 -1329 l-6 -108 -81 3 -81 3 3 85 c6 180 52 403 118 573 254 658 836 1116 1534 1206 105 14 357 12 470 -3z m-1634 -187 l112 -111 -82 -73 c-63 -56 -168 -167 -203 -214 -2 -3 -53 44 -113 104 -82 81 -110 116 -110 135 0 31 234 270 265 270 12 0 64 -44 131 -111z m3051 -11 c92 -92 123 -129 123 -148 0 -18 -28 -53 -106 -131 l-107 -107 -144 145 -145 145 108 109 c66 66 117 109 129 109 12 0 67 -47 142 -122z m-1509 -99 c267 -29 494 -110 710 -252 354 -234 593 -587 684 -1011 30 -139 32 -433 4 -581 -118 -634 -595 -1124 -1233 -1267 -85 -20 -127 -23 -318 -23 -190 0 -233 3 -317 22 -419 95 -766 332 -1000 683 l-69 105 127 3 c71 1 134 0 141 -2 9 -4 13 -29 13 -87 0 -99 17 -140 73 -177 37 -25 51 -27 160 -31 70 -2 136 1 157 8 90 27 129 92 130 214 l0 77 75 0 c85 0 128 14 167 56 39 42 48 75 48 172 -1 166 -63 232 -219 232 l-69 0 -4 88 c-2 76 -7 94 -30 129 -42 63 -74 73 -236 73 -128 0 -142 -2 -173 -23 -63 -42 -79 -79 -79 -178 l0 -89 -220 0 -220 0 0 70 c0 38 -7 91 -16 117 -20 58 -15 246 11 388 34 189 133 433 242 593 329 484 898 753 1461 691z m-1844 -1725 c3 -9 6 -176 6 -373 0 -264 -3 -360 -12 -369 -19 -19 -202 -16 -222 4 -14 13 -16 61 -16 365 0 222 4 357 10 370 10 17 22 19 119 19 90 0 110 -3 115 -16z m964 -358 c2 -264 -1 -373 -9 -382 -12 -15 -180 -21 -213 -8 -14 5 -16 48 -16 378 0 205 3 376 7 380 4 3 57 5 117 4 l111 -3 3 -369z m-1348 -6 l0 -90 -65 0 c-76 0 -85 9 -85 94 0 73 14 86 91 86 l59 0 0 -90z m968 -2 l3 -88 -221 0 -220 0 0 90 0 90 218 -2 217 -3 3 -87z m660 80 c7 -7 12 -40 12 -78 0 -38 -5 -71 -12 -78 -7 -7 -39 -12 -75 -12 l-63 0 0 90 0 90 63 0 c36 0 68 -5 75 -12z"
                          />
                          <path
                            d="M2092 3484 c-19 -13 -22 -24 -20 -57 3 -40 6 -43 61 -71 l58 -29 -103 -51 c-121 -60 -175 -96 -281 -185 -235 -196 -395 -486 -442 -801 -23 -147 -20 -206 10 -235 30 -31 59 -32 89 -2 20 20 24 37 30 126 28 411 271 776 640 963 43 21 80 37 82 35 3 -3 -2 -23 -11 -45 -14 -35 -15 -45 -3 -68 19 -40 63 -52 96 -27 27 20 142 258 142 293 0 10 -8 27 -17 38 -20 22 -260 132 -290 132 -10 0 -29 -7 -41 -16z"
                          />
                          <path
                            d="M2623 3398 c-12 -6 -27 -24 -32 -41 -7 -19 -11 -202 -11 -517 l0 -486 -39 -17 c-80 -36 -151 -147 -151 -237 0 -86 57 -180 138 -228 41 -23 58 -27 127 -27 69 0 86 4 126 27 53 31 96 77 116 126 l13 32 501 0 500 0 26 26 c25 26 26 28 19 126 -39 603 -478 1096 -1067 1202 -119 21 -240 28 -266 14z m337 -173 c345 -93 644 -359 775 -689 33 -85 70 -232 78 -308 l6 -58 -455 0 -454 0 -16 40 c-18 44 -103 127 -140 136 l-24 6 0 456 0 455 68 -7 c37 -3 110 -17 162 -31z m-226 -1036 c21 -18 38 -43 41 -63 14 -70 -49 -146 -121 -146 -68 0 -136 82 -120 146 4 15 22 42 41 61 28 28 40 33 79 33 36 0 52 -6 80 -31z"
                          />
                          <path
                            d="M3827 1917 c-10 -7 -31 -58 -48 -117 -60 -207 -145 -355 -292 -507 -176 -183 -389 -295 -638 -339 -119 -21 -348 -14 -459 13 l-75 18 50 25 c28 14 57 37 65 53 13 24 13 30 0 54 -30 53 -53 51 -196 -12 -71 -32 -137 -65 -146 -73 -10 -8 -18 -29 -18 -45 0 -35 94 -251 123 -284 26 -30 68 -29 95 0 27 29 28 57 1 109 l-21 41 29 -8 c178 -45 397 -57 563 -31 116 18 275 68 372 117 223 111 426 302 556 524 81 139 161 380 142 430 -16 41 -69 58 -103 32z"
                          />
                        </g>
                      </svg>
                      <p class="text-xl font-semibold leading-6 text-gray-900">Interval</p>
                    </div>
                    <p class="text-lg leading-6 text-gray-500 capitalize">
                      {{ interval ? interval : '' }}
                    </p>
                  </li>
                  <li class="flex justify-between items-center py-5">
                    <div class="flex items-center gap-x-2">
                      <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                          fill="#4f39f6"
                          stroke="none"
                        >
                          <path
                            d="M2514 4470 c-144 -26 -267 -93 -379 -205 -139 -139 -206 -289 -209 -466 -1 -91 0 -97 28 -133 67 -89 190 -86 259 6 12 17 22 54 28 109 18 159 93 270 227 337 72 35 81 37 171 37 87 0 102 -3 163 -32 93 -44 151 -100 196 -191 35 -72 37 -81 37 -172 0 -91 -2 -100 -37 -172 -45 -91 -103 -147 -196 -191 l-67 -32 -757 -5 c-745 -5 -757 -5 -784 -26 -52 -39 -69 -71 -69 -133 0 -48 5 -64 29 -95 53 -70 13 -67 859 -64 l762 3 80 27 c116 40 199 92 290 183 91 91 144 175 182 290 23 71 26 96 26 215 0 119 -3 144 -26 215 -38 115 -91 199 -182 290 -139 140 -284 203 -475 210 -58 2 -128 0 -156 -5z"
                          />
                          <path
                            d="M4114 3830 c-144 -26 -267 -93 -379 -205 -139 -139 -206 -289 -209 -466 -1 -91 0 -97 28 -133 67 -89 190 -86 259 6 12 17 22 54 28 109 18 159 93 270 227 337 72 35 81 37 171 37 87 0 102 -3 163 -32 93 -44 151 -100 196 -191 35 -72 37 -81 37 -172 0 -91 -2 -100 -37 -172 -45 -91 -103 -147 -196 -191 l-67 -32 -2037 -5 -2037 -5 -27 -21 c-52 -39 -69 -71 -69 -133 0 -48 5 -64 29 -95 54 -72 -120 -67 2139 -64 l2042 3 80 27 c116 40 199 92 290 183 91 91 144 175 182 290 23 71 26 96 26 215 0 119 -3 144 -26 215 -38 115 -91 199 -182 290 -139 140 -284 203 -475 210 -58 2 -128 0 -156 -5z"
                          />
                          <path
                            d="M735 2066 c-65 -29 -105 -107 -91 -178 7 -36 47 -92 79 -110 17 -10 319 -14 1418 -18 l1395 -5 76 -37 c91 -45 147 -103 191 -196 29 -61 32 -76 32 -162 0 -86 -3 -101 -32 -162 -44 -93 -100 -151 -191 -196 -72 -35 -81 -37 -171 -37 -87 0 -102 3 -163 32 -138 65 -220 182 -237 339 -10 94 -19 114 -68 151 -47 36 -136 40 -179 7 -60 -45 -69 -67 -68 -172 3 -179 70 -329 209 -467 92 -92 176 -144 290 -182 71 -23 96 -26 215 -26 119 0 144 3 215 26 115 38 199 91 290 182 91 91 144 175 182 290 23 71 26 96 26 215 0 119 -3 144 -26 215 -38 115 -91 199 -182 290 -91 91 -174 143 -290 183 l-80 27 -1405 2 c-1157 2 -1410 0 -1435 -11z"
                          />
                        </g>
                      </svg>
                      <p class="text-xl font-semibold leading-6 text-gray-900">Wind Speed</p>
                    </div>
                    <p class="text-lg leading-6 text-gray-500 capitalize">
                      {{ windSpeed ? windSpeed : '' }}
                    </p>
                  </li>
                  <li class="flex justify-between items-center py-5">
                    <div class="flex items-center gap-x-2">
                      <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                          fill="#4f39f6"
                          stroke="none"
                        >
                          <path
                            d="M322 5103 c-18 -9 -43 -30 -55 -47 -20 -28 -22 -45 -25 -187 l-3 -157 -44 -4 c-63 -8 -130 -50 -160 -102 -81 -138 -7 -306 146 -338 l59 -12 -2 -565 -3 -566 -49 -7 c-69 -10 -125 -51 -159 -118 -24 -47 -28 -64 -24 -111 3 -30 14 -74 26 -97 26 -50 89 -99 140 -108 20 -3 44 -8 53 -11 17 -4 18 -54 18 -862 0 -853 0 -858 21 -885 27 -34 71 -35 104 -1 l25 24 0 861 0 860 75 0 75 0 0 -1260 0 -1260 -75 0 -75 0 0 236 c0 277 -4 294 -77 294 -20 0 -41 -8 -53 -20 -19 -19 -20 -33 -20 -281 0 -289 4 -309 64 -352 27 -19 46 -22 147 -25 143 -4 184 11 218 81 l21 43 0 1272 0 1272 145 0 145 0 0 -54 c0 -44 5 -60 25 -84 47 -56 -76 -74 1255 188 333 66 822 162 1086 214 265 52 491 100 503 108 49 30 52 54 49 392 -3 292 -4 315 -22 335 -24 26 -87 29 -107 4 -11 -12 -15 -82 -19 -312 l-5 -295 -257 -52 -258 -51 0 607 0 607 258 -51 257 -52 5 -73 c4 -57 9 -76 24 -87 28 -20 69 -17 97 5 21 17 24 29 27 109 4 98 -10 146 -49 170 -12 8 -110 31 -218 52 -108 22 -450 89 -761 150 -311 61 -691 136 -845 166 -794 157 -942 184 -967 178 -39 -8 -78 -58 -78 -100 l0 -34 -145 0 -145 0 0 142 c0 169 -15 215 -81 248 -51 26 -236 28 -287 3z m218 -263 l0 -130 -75 0 -75 0 0 130 0 130 75 0 75 0 0 -130z m818 -196 l202 -39 0 -935 0 -935 -202 -39 c-112 -21 -209 -41 -215 -43 -10 -4 -13 203 -13 1017 0 814 3 1021 13 1017 6 -2 103 -22 215 -43z m489 -96 l113 -22 0 -856 0 -856 -113 -22 c-62 -12 -119 -22 -125 -22 -9 0 -12 215 -12 900 0 685 3 900 12 900 6 0 63 -10 125 -22z m-867 -63 l0 -75 -390 0 -391 0 -24 25 c-30 30 -32 64 -4 99 l20 26 395 0 394 0 0 -75z m1435 -48 l260 -52 0 -715 0 -715 -260 -52 c-143 -28 -270 -52 -282 -52 l-23 -1 0 820 0 820 23 -1 c12 0 139 -24 282 -52z m555 -110 l105 -22 0 -635 0 -635 -105 -22 c-58 -12 -113 -22 -122 -23 -17 0 -18 39 -18 680 0 641 1 680 18 680 9 -1 64 -11 122 -23z m-2432 -634 l-3 -568 -72 -3 -73 -3 0 571 0 570 75 0 75 0 -2 -567z m440 0 l-3 -568 -142 -3 -143 -3 0 571 0 570 145 0 145 0 -2 -567z m0 -795 l-3 -73 -360 -3 c-198 -1 -375 0 -393 3 -66 12 -95 82 -52 125 19 19 33 20 415 20 l396 0 -3 -72z"
                          />
                          <path
                            d="M1296 2377 c-50 -50 -18 -127 52 -127 50 0 134 -21 182 -45 25 -13 85 -57 134 -99 149 -126 270 -176 421 -176 151 0 271 50 419 176 106 90 162 120 255 136 54 9 84 9 136 -1 90 -16 143 -45 249 -135 149 -126 270 -176 421 -176 151 0 271 50 419 176 106 90 162 120 255 136 54 9 84 9 136 -1 88 -16 142 -45 240 -127 159 -133 241 -172 381 -181 79 -5 81 -5 102 22 27 34 28 65 4 95 -14 17 -34 24 -97 31 -103 11 -173 46 -290 145 -162 138 -322 192 -490 166 -128 -20 -225 -70 -350 -180 -38 -34 -99 -77 -135 -95 -61 -30 -71 -32 -175 -32 -105 0 -114 2 -175 32 -36 18 -105 67 -155 109 -162 138 -322 192 -490 166 -128 -20 -225 -70 -350 -180 -38 -34 -99 -77 -135 -95 -61 -30 -71 -32 -175 -32 -105 0 -114 2 -175 32 -36 18 -105 67 -155 109 -142 119 -220 155 -364 170 -66 6 -71 5 -95 -19z"
                          />
                          <path
                            d="M1293 1848 c-28 -30 -29 -72 -3 -98 21 -21 38 -26 120 -34 76 -8 158 -52 265 -142 192 -161 375 -207 579 -144 79 25 157 73 253 155 43 36 107 80 143 98 61 30 71 32 175 32 105 0 114 -2 175 -32 36 -18 106 -67 155 -109 192 -161 375 -207 579 -144 79 25 157 73 253 155 43 36 107 80 143 98 61 30 71 32 175 32 104 0 114 -2 175 -32 36 -18 94 -58 130 -89 143 -123 223 -165 357 -184 64 -10 86 -9 104 1 53 28 63 73 26 112 -17 20 -38 27 -100 35 -102 13 -161 43 -277 141 -149 126 -259 171 -416 171 -160 0 -261 -42 -419 -175 -49 -41 -113 -86 -141 -100 -106 -53 -251 -53 -359 -1 -27 14 -93 61 -145 105 -149 126 -259 171 -416 171 -160 0 -261 -42 -419 -175 -107 -89 -169 -122 -257 -136 -131 -20 -240 16 -364 120 -169 142 -247 180 -384 188 -80 5 -86 4 -107 -19z"
                          />
                          <path
                            d="M1295 1325 c-31 -30 -32 -69 -2 -99 18 -17 39 -24 92 -29 93 -9 187 -56 290 -147 87 -78 204 -141 293 -159 179 -37 364 17 517 150 148 129 205 154 345 154 85 0 102 -3 160 -31 36 -17 106 -65 155 -108 98 -83 214 -147 303 -165 179 -37 364 17 517 150 148 129 205 154 345 154 85 0 102 -3 161 -31 36 -17 95 -56 130 -85 148 -125 206 -159 311 -184 97 -23 154 -20 183 10 53 52 13 125 -69 125 -101 0 -188 45 -349 179 -77 65 -140 98 -233 121 -192 49 -378 -1 -544 -145 -134 -118 -215 -155 -335 -155 -121 0 -200 38 -368 179 -77 65 -140 98 -233 121 -192 49 -378 -1 -544 -145 -134 -118 -215 -155 -335 -155 -121 0 -193 34 -350 165 -91 76 -193 129 -279 144 -96 18 -134 14 -161 -14z"
                          />
                          <path
                            d="M1310 814 c-32 -14 -46 -48 -36 -89 8 -33 32 -44 121 -55 99 -13 159 -43 275 -141 145 -123 263 -171 415 -171 151 0 270 49 413 170 51 44 117 91 145 106 100 50 258 51 359 1 29 -14 96 -62 148 -106 145 -123 263 -171 415 -171 151 0 270 49 413 170 51 44 117 91 145 106 101 50 258 51 359 1 29 -14 94 -60 143 -101 152 -128 255 -174 385 -174 62 0 71 2 89 26 24 31 26 43 10 78 -13 28 -55 46 -109 46 -84 0 -165 43 -319 170 -139 115 -292 163 -449 140 -130 -18 -213 -59 -344 -171 -46 -39 -110 -85 -143 -102 -52 -27 -73 -31 -157 -35 -150 -7 -204 17 -387 168 -139 115 -293 162 -451 140 -128 -18 -212 -60 -342 -171 -46 -39 -110 -85 -143 -102 -52 -27 -73 -31 -157 -35 -146 -6 -203 16 -348 138 -94 79 -149 114 -220 141 -73 27 -191 39 -230 23z"
                          />
                        </g>
                      </svg>
                      <p class="text-xl font-semibold leading-6 text-gray-900">Wind Direction</p>
                    </div>
                    <p class="text-lg leading-6 text-gray-500 capitalize">
                      {{ windDirection ? windDirection : '' }}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="pointer-events-none absolute inset-px rounded-lg shadow-md ring-1 ring-black/5 max-lg:rounded-b-4xl lg:rounded-br-4xl"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Loading -->
    <LoadingModal :loading="loading" :type="'home'" />
  </div>
</template>

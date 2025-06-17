<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import type { Country } from '../types/country'
import SearchBar from './../components/SearchBar.vue'
import LoadingModal from './../components/LoadingModal.vue'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

// Props
const props = defineProps<{
  sidebarOpen: boolean
  countries: Country[]
}>()

// Emit
const emit = defineEmits(['update:sidebarOpen'])

// searchedCountry
const searchedCountry = ref<Country[]>(props.countries)

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)

const paginatedCountries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return searchedCountry.value.slice(start, end)
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const totalPages = computed(() => Math.ceil(searchedCountry.value.length / itemsPerPage))

// Loading
const loading = ref(false)

// Date format function
const formattedDate = ref<Record<string, string>>({})
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
const temperature = ref<Record<string, string>>({})
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
const isDay = ref<Record<string, string>>({})
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
const weatherCode = ref<Record<string, string>>({})
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
const interval = ref<Record<string, string>>({})
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
const windSpeed = ref<Record<string, string>>({})
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
const windDirection = ref<Record<string, string>>({})
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
watch(searchedCountry, () => {
  currentPage.value = 1
})

watch(
  paginatedCountries,
  async (countries) => {
    // Loading Start
    loading.value = true

    // Define Values
    const dateResults: Record<string, string> = {}
    const temperatureResults: Record<string, string> = {}
    const isDayResults: Record<string, string> = {}
    const weatherCodeResults: Record<string, string> = {}
    const intervalResults: Record<string, string> = {}
    const windSpeedResults: Record<string, string> = {}
    const windDirectionResults: Record<string, string> = {}

    for (const country of countries) {
      if (country && country.latlng && country.latlng.length === 2) {
        dateResults[country.name.common] = await getDate(country.latlng)
        temperatureResults[country.name.common] = await getTemperature(country.latlng)
        isDayResults[country.name.common] = await getIsDay(country.latlng)
        weatherCodeResults[country.name.common] = await getWeatherCode(country.latlng)
        intervalResults[country.name.common] = await getInterval(country.latlng)
        windSpeedResults[country.name.common] = await getWindSpeed(country.latlng)
        windDirectionResults[country.name.common] = await getWindDirection(country.latlng)
      }
    }

    formattedDate.value = dateResults
    temperature.value = temperatureResults
    isDay.value = isDayResults
    weatherCode.value = weatherCodeResults
    interval.value = intervalResults
    windSpeed.value = windSpeedResults
    windDirection.value = windDirectionResults

    // Loading End
    loading.value = false
  },
  { immediate: true },
)
</script>

<template>
  <div class="xl:pl-72">
    <!-- Search -->
    <SearchBar
      :type="'weather'"
      :countries="props.countries"
      :sidebarOpen="props.sidebarOpen"
      @update:sidebarOpen="emit('update:sidebarOpen', $event)"
      @update:searchedCountry="searchedCountry = $event"
    />

    <!-- Data Table -->
    <main class="bg-gray-50 py-8">
      <div class="px-4 sm:px-6 lg:px-8">
        <h1 class="text-xl font-semibold leading-6 text-indigo-600">Weather</h1>
        <p class="mt-2 text-base text-gray-700">
          A collection of weather data from around the world including temperature, interval, wind
          speed, wind direction, and conditions for each location.
        </p>
        <div class="mt-8 flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div class="overflow-hidden shadow-md ring-1 ring-black/5 sm:rounded-lg relative">
                <table class="min-w-full divide-y-2 divide-black">
                  <thead class="bg-indigo-600">
                    <tr>
                      <th
                        scope="col"
                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                      >
                        <a href="#" class="group inline-flex">
                          Country
                          <span
                            class="invisible ml-2 flex-none rounded group-hover:visible group-focus:visible"
                          >
                            <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        <a href="#" class="group inline-flex">
                          Region
                          <span
                            class="invisible ml-2 flex-none rounded group-hover:visible group-focus:visible"
                          >
                            <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        <a href="#" class="group inline-flex">
                          Date & Time
                          <span
                            class="invisible ml-2 flex-none rounded group-hover:visible group-focus:visible"
                          >
                            <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        <a href="#" class="group inline-flex">
                          Temperature
                          <span
                            class="invisible ml-2 flex-none rounded group-hover:visible group-focus:visible"
                          >
                            <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        <a href="#" class="group inline-flex">
                          Interval
                          <span
                            class="invisible ml-2 flex-none rounded group-hover:visible group-focus:visible"
                          >
                            <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        <a href="#" class="group inline-flex">
                          Wind
                          <span
                            class="invisible ml-2 flex-none rounded group-hover:visible group-focus:visible"
                          >
                            <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        <a href="#" class="group inline-flex">
                          Adverb of Time
                          <span
                            class="invisible ml-2 flex-none rounded group-hover:visible group-focus:visible"
                          >
                            <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        <a href="#" class="group inline-flex">
                          Status
                          <span
                            class="invisible ml-2 flex-none rounded group-hover:visible group-focus:visible"
                          >
                            <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </a>
                      </th>
                    </tr>
                  </thead>
                  <tbody v-if="paginatedCountries.length > 0" class="bg-white">
                    <tr
                      v-for="(country, index) in paginatedCountries"
                      :key="country && country.name ? country.name.common : ''"
                      :class="index % 2 === 0 ? '' : 'bg-gray-100'"
                    >
                      <td class="py-5 pl-4 pr-3 text-sm sm:pl-6">
                        <div class="flex items-center">
                          <div class="h-10 w-10 flex-shrink-0">
                            <img
                              class="h-10 w-10 rounded-full"
                              :src="country.flags ? country.flags.png : '#'"
                              :alt="country.name ? country.name.common : 'Flag of country'"
                            />
                          </div>
                          <div class="ml-4">
                            <div class="font-medium text-gray-900">
                              {{ country.name ? country.name.common : '-' }}
                            </div>
                            <div class="mt-1 text-gray-500">
                              {{
                                country.capital && country.capital.length > 0
                                  ? country.capital[0]
                                  : '-'
                              }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-3 py-4 text-sm text-gray-500">
                        <span v-if="country.subregion" class="text-gray-900">
                          {{ country.subregion ? country.subregion : '-' }}
                        </span>
                        <span v-else>
                          {{ country.region ? country.region : '-' }}
                        </span>
                      </td>
                      <td class="px-3 py-4 text-sm text-gray-500">
                        {{ formattedDate[country.name.common] ?? '-' }}
                      </td>
                      <td class="px-3 py-4 text-sm text-gray-500">
                        {{ temperature[country.name.common] ?? '-' }}
                      </td>
                      <td class="px-3 py-4 text-sm text-gray-500">
                        {{ interval[country.name.common] ?? '-' }}
                      </td>
                      <td class="px-3 py-4 text-sm text-gray-500">
                        <div class="text-gray-900">
                          Speed : {{ windSpeed[country.name.common] ?? '-' }}
                        </div>
                        <div class="mt-1 text-gray-500">
                          Direction : {{ windDirection[country.name.common] ?? '-' }}
                        </div>
                      </td>
                      <td class="px-3 py-4 text-sm text-gray-500">
                        <span v-if="isDay[country.name.common] == '1'" class="text-gray-900">
                          Daylight
                        </span>
                        <span v-else>Night</span>
                      </td>
                      <td class="px-3 py-4 text-sm text-gray-500">
                        <span v-if="weatherCode[country.name.common] == '0'">Clear Sky</span>
                        <span
                          v-else-if="
                            weatherCode[country.name.common] == '1' ||
                            weatherCode[country.name.common] == '2' ||
                            weatherCode[country.name.common] == '3'
                          "
                        >
                          Mainly clear, partly cloudy, and overcast
                        </span>
                        <span
                          v-else-if="
                            weatherCode[country.name.common] == '45' ||
                            weatherCode[country.name.common] == '48'
                          "
                        >
                          Fog and depositing rime fog
                        </span>
                        <span
                          v-else-if="
                            weatherCode[country.name.common] == '51' ||
                            weatherCode[country.name.common] == '53' ||
                            weatherCode[country.name.common] == '55'
                          "
                        >
                          Drizzle: Light, moderate, and dense intensity
                        </span>
                        <span
                          v-else-if="
                            weatherCode[country.name.common] == '56' ||
                            weatherCode[country.name.common] == '57'
                          "
                        >
                          Freezing Drizzle: Light and dense intensity
                        </span>
                        <span
                          v-else-if="
                            weatherCode[country.name.common] == '61' ||
                            weatherCode[country.name.common] == '63' ||
                            weatherCode[country.name.common] == '65'
                          "
                        >
                          Rain: Slight, moderate, and heavy intensity
                        </span>
                        <span
                          v-else-if="
                            weatherCode[country.name.common] == '66' ||
                            weatherCode[country.name.common] == '67'
                          "
                        >
                          Freezing Rain: Light and heavy intensity
                        </span>
                        <span
                          v-else-if="
                            weatherCode[country.name.common] == '71' ||
                            weatherCode[country.name.common] == '73' ||
                            weatherCode[country.name.common] == '75'
                          "
                        >
                          Snow fall: Slight, moderate, and heavy intensity
                        </span>
                        <span v-else-if="weatherCode[country.name.common] == '77'"
                          >Snow grains</span
                        >
                        <span
                          v-else-if="
                            weatherCode[country.name.common] == '80' ||
                            weatherCode[country.name.common] == '81' ||
                            weatherCode[country.name.common] == '82'
                          "
                        >
                          Rain showers: Slight, moderate, and violent
                        </span>
                        <span
                          v-else-if="
                            weatherCode[country.name.common] == '85' ||
                            weatherCode[country.name.common] == '86'
                          "
                        >
                          Snow showers slight and heavy
                        </span>
                        <span v-else-if="weatherCode[country.name.common] == '95'"
                          >Thunderstorm: Slight or moderate</span
                        >
                        <span
                          v-else-if="
                            weatherCode[country.name.common] == '96' ||
                            weatherCode[country.name.common] == '99'
                          "
                        >
                          Thunderstorm with slight and heavy hail
                        </span>
                        <span v-else>-</span>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="8">
                        <div
                          class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                        >
                          <div class="flex flex-1 justify-between items-center sm:hidden">
                            <a
                              href="#"
                              click.prevent="goToPage(currentPage - 1)"
                              :class="[
                                'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
                                currentPage === 1 ? 'pointer-events-none opacity-50' : '',
                              ]"
                              class=""
                            >
                              Previous
                            </a>
                            <div>
                              <p class="text-sm text-gray-700">
                                Showing
                                {{ ' ' }}
                                <span class="font-medium">
                                  {{ currentPage * itemsPerPage - 9 }}
                                </span>
                                {{ ' ' }}
                                to
                                {{ ' ' }}
                                <span class="font-medium">
                                  {{
                                    searchedCountry.length < currentPage * itemsPerPage
                                      ? searchedCountry.length
                                      : currentPage * itemsPerPage
                                  }}
                                </span>
                                {{ ' ' }}
                                of
                                {{ ' ' }}
                                <span class="font-medium">{{ searchedCountry.length }}</span>
                                {{ ' ' }}
                                results
                              </p>
                            </div>
                            <a
                              href="#"
                              @click.prevent="goToPage(currentPage + 1)"
                              :class="[
                                'relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
                                currentPage === totalPages ? 'pointer-events-none opacity-50' : '',
                              ]"
                            >
                              Next
                            </a>
                          </div>
                          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                              <p class="text-sm text-gray-700">
                                Showing
                                {{ ' ' }}
                                <span class="font-medium">
                                  {{ currentPage * itemsPerPage - 9 }}
                                </span>
                                {{ ' ' }}
                                to
                                {{ ' ' }}
                                <span class="font-medium">
                                  {{
                                    searchedCountry.length < currentPage * itemsPerPage
                                      ? searchedCountry.length
                                      : currentPage * itemsPerPage
                                  }}
                                </span>
                                {{ ' ' }}
                                of
                                {{ ' ' }}
                                <span class="font-medium">{{ searchedCountry.length }}</span>
                                {{ ' ' }}
                                results
                              </p>
                            </div>
                            <div>
                              <nav
                                class="isolate inline-flex -space-x-px rounded-md shadow-xs"
                                aria-label="Pagination"
                              >
                                <a
                                  href="#"
                                  @click.prevent="goToPage(currentPage - 1)"
                                  :class="[
                                    'relative inline-flex items-center rounded-l-md px-1 py-1 xl:px-2 xl:py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
                                    currentPage === 1 ? 'pointer-events-none opacity-50' : '',
                                  ]"
                                >
                                  <span class="sr-only">Previous</span>
                                  <ChevronLeftIcon class="size-5" aria-hidden="true" />
                                </a>
                                <a
                                  v-for="page in totalPages"
                                  :key="page"
                                  href="#"
                                  @click.prevent="goToPage(page)"
                                  :class="[
                                    'relative inline-flex items-center px-4 py-2 max-[1920px]:px-2.5 max-[1920px]:py-1 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0',
                                    page === currentPage
                                      ? 'z-10 bg-indigo-600 text-white'
                                      : 'text-gray-900 hover:bg-gray-50',
                                  ]"
                                >
                                  {{ page }}
                                </a>
                                <a
                                  href="#"
                                  @click.prevent="goToPage(currentPage + 1)"
                                  :class="[
                                    'relative inline-flex items-center rounded-r-md px-1 py-1 xl:px-2 xl:py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
                                    currentPage === totalPages
                                      ? 'pointer-events-none opacity-50'
                                      : '',
                                  ]"
                                >
                                  <span class="sr-only">Next</span>
                                  <ChevronRightIcon class="size-5" aria-hidden="true" />
                                </a>
                              </nav>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <!-- Loading -->
                <LoadingModal :loading="loading" :type="'weather'" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Country } from '../types/country'
import { Bars3Icon, MagnifyingGlassIcon, CheckIcon } from '@heroicons/vue/20/solid'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/vue'

// Props
const props = defineProps<{
  countries: Country[]
  type: string
}>()

// Emit
const emit = defineEmits<{
  (e: 'update:sidebarOpen', value: boolean): void
  (e: 'update:selectedCountry', value: Country | null): void
  (e: 'update:searchedCountry', value: Country[]): void
}>()

// Reactive variables
const query = ref('')
const selectedCountry = ref(null)
const filteredCountries = computed(() =>
  query.value === ''
    ? props.countries
    : props.countries.filter((country) => {
        return country.name.common.toLowerCase().includes(query.value.toLowerCase())
      }),
)

// Display Value
function isCountry(item: unknown): item is Country {
  return (
    !!item &&
    typeof item === 'object' &&
    'name' in item &&
    typeof (item as { name?: unknown }).name === 'object' &&
    item.name !== null &&
    'common' in (item as { name: { common?: unknown } }).name
  )
}

function displayCountryName(item: unknown): string {
  if (isCountry(item)) {
    return item.name.common
  }
  return ''
}

// Watchers
watch([selectedCountry, query], ([country]) => {
  emit('update:selectedCountry', country)
  emit('update:searchedCountry', filteredCountries.value)
})
</script>

<template>
  <div
    class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-md sm:gap-x-6 sm:px-6 lg:px-8"
  >
    <button
      type="button"
      class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
      @click="emit('update:sidebarOpen', true)"
    >
      <span class="sr-only">Open sidebar</span>
      <Bars3Icon class="h-6 w-6" aria-hidden="true" />
    </button>

    <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

    <div class="relative flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
      <MagnifyingGlassIcon
        class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
        aria-hidden="true"
      />
      <Combobox v-if="type == 'home'" as="div" v-model="selectedCountry" class="w-full h-full pl-5">
        <ComboboxInput
          as="template"
          class="w-full h-full border-0 py-1.5 pl-3 pr-10 text-gray-900 sm:text-sm sm:leading-6 focus:outline-0"
          @change="query = $event.target.value"
          :displayValue="displayCountryName"
        >
          <input placeholder="Search Country..." autocomplete="off" />
        </ComboboxInput>
        <ComboboxOptions
          v-if="filteredCountries.length > 0"
          class="relative z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-md ring-1 ring-black/5 focus:outline-none sm:text-sm"
        >
          <ComboboxOption
            v-for="country in filteredCountries"
            :key="country && country.name ? country.name.common : ''"
            :value="country"
            as="template"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                'relative cursor-default select-none py-2 pl-3 pr-9',
                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
              ]"
            >
              <div class="flex items-center">
                <img
                  :src="country && country.flags ? country.flags.png : '#'"
                  :alt="country && country.name ? country.name.common : ''"
                  class="h-6 w-6 flex-shrink-0 rounded-full"
                />
                <span :class="['ml-3 truncate', selected && 'font-semibold']">
                  {{ country && country.name ? country.name.common : '' }}
                </span>
              </div>
              <span
                v-if="selected"
                :class="[
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                  active ? 'text-white' : 'text-indigo-600',
                ]"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </Combobox>
      <input
        v-else-if="type == 'weather'"
        type="text"
        v-model="query"
        placeholder="Search Country..."
        class="block w-full border-0 py-1.5 pl-8 pr-10 text-gray-900 sm:text-sm sm:leading-6 focus:outline-0"
      />
    </div>
  </div>
</template>

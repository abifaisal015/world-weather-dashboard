<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import axios from 'axios'
import type { Country } from './types/country'
import SideNavigation from './components/SideNavigation.vue'

const sidebarOpen = ref(false)
const countries = ref<Country[]>([])

onMounted(() => {
  axios
    .get('https://restcountries.com/v3.1/all')
    .then((response) => {
      countries.value = response.data
    })
    .catch((error) => {
      console.error('Error :', error)
    })
})
</script>

<template>
  <div>
    <SideNavigation :sidebarOpen="sidebarOpen" @update:sidebarOpen="sidebarOpen = $event" />
    <RouterView
      :sidebarOpen="sidebarOpen"
      :countries="countries"
      @update:sidebarOpen="sidebarOpen = $event"
    />
  </div>
</template>

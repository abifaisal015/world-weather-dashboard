<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { HomeIcon, CloudIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  sidebarOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:sidebarOpen', value: boolean): void
}>()

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Weather', href: '/weather', icon: CloudIcon },
]
</script>

<template>
  <div>
    <TransitionRoot as="template" :show="props.sidebarOpen">
      <Dialog as="div" class="relative z-50 xl:hidden" @close="emit('update:sidebarOpen', false)">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    class="-m-2.5 p-2.5"
                    @click="emit('update:sidebarOpen', false)"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>

              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div class="flex h-16 shrink-0 items-center">
                  <img class="h-8 w-auto" src="/weather-icon.png" alt="World Weather" />
                  <span class="ml-3 font-semibold text-lg">World Weather</span>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <RouterLink
                            :to="item.href"
                            class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:text-indigo-600 hover:bg-gray-50"
                          >
                            <component
                              :is="item.icon"
                              class="h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </RouterLink>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4"
      >
        <div class="flex h-16 shrink-0 items-center">
          <img class="h-8 w-auto" src="/weather-icon.png" alt="World Weather" />
          <span class="ml-3 font-semibold text-lg">World Weather</span>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <RouterLink
                    :to="item.href"
                    class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:text-indigo-600 hover:bg-gray-50"
                  >
                    <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                    {{ item.name }}
                  </RouterLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

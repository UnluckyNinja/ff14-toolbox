<script lang="ts" setup>
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'

const props = withDefaults(defineProps<{
  current?: string
}>(), {
  current: '',
})

const showDropdown = ref(false)

function handleClick() {
  showDropdown.value = false
}
const reference = ref(null)
const floating = ref(null)

const { floatingStyles } = useFloating(reference, floating, {
  placement: 'bottom-end',
  middleware: [offset(5), flip(), shift()],
  whileElementsMounted: autoUpdate,
})
const rootComp = ref()
onClickOutside(rootComp, () => {
  showDropdown.value = false
})
</script>

<template>
  <div ref="rootComp">
    <!-- Selected -->
    <div
      ref="reference"
      class="flex text-sm items-center border rounded p-1 focus:ring bg-white ring-blue hover:cursor-pointer dark:bg-dark-1 focus:ring-2 dark:bg-gray-800"
      tabindex="0"
      @click="showDropdown = true"
    >
      <slot class="flex-1" name="content">
        <div class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          {{ props.current }}
        </div>
      </slot>
      <div i-carbon-list class="flex-none mx-1" />
    </div>
    <!-- Dropdown -->
    <div
      v-if="showDropdown" ref="floating"
      class="border rounded bg-white dark:bg-gray-800 divide-y z-10 max-h-50vh overflow-auto children:px-4 children:py-1 hover:children:cursor-pointer hover:children:bg-gray/20"
      :style="floatingStyles"
    >
      <slot name="default" :handle-click="handleClick" />
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>

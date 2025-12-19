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
      class="dark:bg-dark-1 text-sm p-1 border rounded bg-white flex ring-blue items-center dark:bg-gray-800 hover:cursor-pointer focus:ring focus:ring-2px"
      tabindex="0"
      @click="showDropdown = true"
    >
      <slot class="flex-1" name="content">
        <div class="flex-1 whitespace-nowrap text-ellipsis overflow-hidden">
          {{ props.current }}
        </div>
      </slot>
      <div i-carbon-list class="mx-1 flex-none" />
    </div>
    <!-- Dropdown -->
    <div
      v-if="showDropdown" ref="floating"
      class="border rounded bg-white max-h-50vh z-10 overflow-auto divide-y children:px-4 children:py-1 dark:bg-gray-800 hover:children:bg-gray/20 hover:children:cursor-pointer"
      :style="floatingStyles"
    >
      <slot name="default" :handle-click="handleClick" />
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>

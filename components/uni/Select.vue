<script lang="ts" setup>
import { autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/vue';

const props = withDefaults(defineProps<{
  current?: string
}>(), {
  current: ''
})

const showDropdown = ref(false)

function handleClick() {
  showDropdown.value = false;
}
const reference = ref(null);
const floating = ref(null);

const { floatingStyles, middlewareData } = useFloating(reference, floating, {
  placement: 'bottom-end',
  middleware: [offset(5), flip(), shift()],
  whileElementsMounted: autoUpdate,
});
const rootComp = ref()
onClickOutside(rootComp, () => {
  showDropdown.value = false
})

</script>

<template>
  <div ref="rootComp">
    <!-- Selected -->
    <div ref="reference"
      class="p-1 flex items-center focus:ring-2 ring-blue border rounded bg-light-1 dark:bg-dark-1 hover:cursor-pointer foucs:ring hover:brightness-110 text-sm"
      @click="showDropdown = true"
      tabindex="0">
      <slot class="flex-1" name="content">
        <div class="flex-1 whitespace-nowrap text-ellipsis overflow-hidden">
          {{ props.current }}
        </div>
      </slot>
      <div i-carbon-list class="flex-none mx-1"></div>
    </div>
    <!-- Dropdown -->
    <div v-if="showDropdown" ref="floating"
      class="children:px-4 children:py-1 border divide-y hover:children:bg-gray/20 hover:children:cursor-pointer rounded bg-light-1 max-h-50vh overflow-auto"
      :style="floatingStyles">
      <slot name="default" :handleClick="handleClick"></slot>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>

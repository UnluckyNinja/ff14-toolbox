<script lang="ts" setup>
import { useNumberSystem } from '~/utils/intl'

const props = withDefaults(defineProps<{
  value: number
  locale?: Intl.LocalesArgument
  options?: Intl.NumberFormatOptions
  padRight?: number
  padChar?: string
}>(), {
  options: () => ({
    maximumFractionDigits: 2,
  }),
  padRight: 0,
  padChar: '0',
})

const { decimal, formatter, group } = useNumberSystem(() => props.locale, () => props.options)

const num = computed(() => {
  const parts = formatter.value.formatToParts(props.value)

  const integers = parts.filter(it => it.type === 'integer').map(it => it.value)
  let fraction = parts.find(it => it.type === 'fraction')?.value ?? ''
  if (fraction.length < props.padRight) {
    fraction = fraction + props.padChar.repeat(props.padRight - fraction.length)
  }
  return {
    integers,
    fraction,
    decimal,
    group,
  }
})
</script>

<template>
  <span>
    <slot name="integer" v-bind="num">
      <span>{{ num.integers.join(group) }}</span>
    </slot>
    <slot name="fraction" v-bind="num">
      <span>{{ decimal }}{{ num.fraction }}</span>
    </slot>
  </span>
</template>

<style lang="postcss" scoped>

</style>

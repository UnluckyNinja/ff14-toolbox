<script lang="ts" setup>
const props = withDefaults(defineProps<{
  value: number
  options?: Partial<Intl.NumberFormatOptions>
  padRight?: number
  padChar?: string
}>(), {
  options: (): Intl.NumberFormatOptions => ({
    maximumFractionDigits: 2,
  }),
  padRight: 0,
  padChar: '0',
})
const decimalPoint = 1.1.toLocaleString().replace(/\d/g, '')
const parts = computed(() => {
  const str = props.value.toLocaleString(undefined, props.options)
  const dotPosition = str.indexOf(decimalPoint)
  if (dotPosition < 0) {
    return {
      whole: str,
      fraction: `${props.padChar.repeat(props.padRight)}`,
    }
  }
  const pad = props.padChar.repeat(Math.max(props.padRight - (str.length - dotPosition - 1), 0))
  return {
    whole: str.substring(0, dotPosition),
    fraction: str.substring(dotPosition + 1, str.length) + pad,
  }
})
</script>

<template>
  <span>
    <slot name="whole" :num="parts.whole" :decimal-point="decimalPoint">
      <span>{{ parts.whole }}</span>
    </slot>
    <slot name="fraction" :num="parts.fraction" :decimal-point="decimalPoint">
      <span>{{ decimalPoint }} {{ parts.fraction }}</span>
    </slot>
  </span>
</template>

<style lang="postcss" scoped>

</style>

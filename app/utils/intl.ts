export function useNumberSystem(locale?: MaybeRefOrGetter<Intl.LocalesArgument>, options?: MaybeRefOrGetter<Intl.NumberFormatOptions>) {
  const _locale = toRef(locale)
  const _options = toRef(options)
  const formatter = ref(new Intl.NumberFormat())
  const decimal = ref<string>('.')
  const group = ref<string>(',')

  const stop = watch([_locale, _options], () => {
    formatter.value = new Intl.NumberFormat(_locale.value, _options.value)
    const _example = formatter.value.formatToParts(10000.5)
    decimal.value = _example.find(it => it.type === 'decimal')?.value ?? '.'
    group.value = _example.find(it => it.type === 'group')?.value ?? ','
  }, { immediate: true })

  tryOnScopeDispose(() => {
    stop()
  })

  return {
    locale: _locale,
    options: _options,
    formatter,
    decimal,
    group,
  }
}

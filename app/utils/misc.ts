export const usePricePalette = createGlobalState(() => {
  const colorMode = useColorMode()

  const numbersColor = computed(() => {
    if (colorMode.value === 'dark') {
      return [
        '#FFC242',
        '#FF9C38',
        '#FF6161',
      ]
    }
    return [
      '#C78800',
      '#E07000',
      '#EB0000',
    ]
  })

  return numbersColor
})

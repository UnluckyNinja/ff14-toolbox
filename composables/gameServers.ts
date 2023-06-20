interface DataCenter {
  name: string
  region: string
  worlds: number[]
}

export function useServerInfo() {
  const { data: dataCenters } = useFetch<DataCenter[]>('https://universalis.app/api/v2/data-centers', { server: false, responseType: 'json' })
  const { data: worlds } = useFetch<{ id: number; name: string }[]>('https://universalis.app/api/v2/worlds', { server: false, responseType: 'json' })

  const regions = computed(() => {
    if (!dataCenters.value)
      return []
    return [...new Set(dataCenters.value.map(it => it.region))]
  })

  return {
    regions,
    dataCenters,
    worlds,
  }
}

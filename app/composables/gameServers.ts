interface DataCenter {
  name: string
  region: string
  worlds: number[]
}

export const useServerInfo = createGlobalState(() => {
  const { data: dataCenters } = useFetch<DataCenter[]>('https://universalis.app/api/v2/data-centers', { server: false, responseType: 'json' })
  const { data: worlds } = useFetch<{ id: number, name: string }[]>('https://universalis.app/api/v2/worlds', { server: false, responseType: 'json' })

  const regions = computed(() => {
    if (!dataCenters.value)
      return []
    return [...new Set(dataCenters.value.map(it => it.region))]
  })

  const worldMap = new Map<number, string>()
  watch(worlds, (newVal) => {
    if (!newVal) return
    worldMap.clear()
    for (const world of newVal) {
      worldMap.set(world.id, world.name)
    }
  })

  return {
    regions,
    dataCenters,
    worlds,
    getWorldName(id: number | undefined | null) {
      if (id === undefined || id === null) {
        return ''
      }
      return worldMap.get(id)
    },
  }
})

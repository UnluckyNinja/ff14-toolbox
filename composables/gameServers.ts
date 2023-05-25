interface DataCenter {
  name: string
  region: string
  worlds: number[]
}

export function useServerInfo() {
  const state = useState('server-info', () => {
    const { data: dataCenters } = useFetch<DataCenter[]>('https://universalis.app/api/v2/data-centers', { server: false, responseType: 'json' })
    const { data: worlds } = useFetch<{ id: number; name: string }[]>('https://universalis.app/api/v2/worlds', { server: false, responseType: 'json' })
    const regions = computed(() => {
      if (!dataCenters.value)
        return []
      return [...new Set(dataCenters.value.map(it => it.region))]
    })

    return reactive({
      regions,
      dataCenters,
      worlds,
    })
  })

  return state
}

export async function fetchMarket(server: string | number, items: (string | number)[] | string, options?: Record<string, any>) {
  const url = `https://universalis.app/api/v2/${server}/${Array.isArray(items) ? items.join(',') : items}`
  const queries = {
    ...options,
  }
  const querystring = new URLSearchParams(queries).toString()
  const data = await fetch(`${url}?${querystring}`)
  return await data.json()
}

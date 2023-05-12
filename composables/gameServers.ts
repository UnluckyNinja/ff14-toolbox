import { MaybeRef } from '@vueuse/core'

type DataCenter = {
  name: string,
  region: string,
  worlds: (keyof Worlds)[]
}

type Worlds = {
  [key: string]: string
}

export type Server = {
  region: string,
  section: string,
  world: number,
  dcObj: DataCenter,
  label: string,
}

export function fetchServerInfo() {
  onBeforeMount(() => {
    const state = useState('server-info', () => {
      return [] as Server[]
    })
    const { data: dataCenters } = useFetch<DataCenter[]>('https://universalis.app/api/v2/data-centers', { server: false, responseType: 'json' })
    const { data: worlds } = useFetch<{ id: number, name: string }[]>('https://universalis.app/api/v2/worlds', { server: false, responseType: 'json' })

    watchEffect(() => {
      if (!dataCenters.value || !worlds.value) {
        state.value = []
        return
      }

      const ws = useState('server-worlds', ()=>({} as Worlds))
      
      ws.value = Object.fromEntries(worlds.value.map(({ id, name }) => [id, name]))
      

      state.value = dataCenters.value.filter(it=>it.region==='中国').flatMap(dc => {
        return dc.worlds.map(world => {
          return {
            region: dc.region,
            section: dc.name,
            world,
            dcObj: dc,
            label: `${dc.region}-${dc.name}-${ws.value[world]}`
          }
        }) as Server[]
      })
    })
  })
}

export function useServerInfo() {

  const state = useState('server-info', () => {
    return [] as Server[]
  })

  return state
}

export function useServerWorlds() {

  const state = useState('server-worlds', () => ({} as Worlds))

  return state
}

export async function fetchMarket(server: string|number, items: (string|number)[] | string, options?: any){
  const url = `https://universalis.app/api/v2/${server}/${Array.isArray(items) ? items.join(',') : items}`
  const queries = {
    ...options,
  }
  const querystring = new URLSearchParams(queries).toString()
  const data = await fetch(`${url}?${querystring}`)
  return await data.json()
}
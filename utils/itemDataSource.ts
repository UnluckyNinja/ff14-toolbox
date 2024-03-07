export interface XAContent<T> {
  Pagination: {
    Page: number
    PageNext: number | null
    PagePrev: number | null
    PageTotal: number
    Results: number
    ResultsPerPage: number
    ResultsTotal: number
  }
  Results: T[]
}

export interface XAItem {
  ID: number
  Icon: string // URL
  Name: string
  Url: string // URL
}

export const BASE_EN = 'https://xivapi.com'
export const BASE_ZH = 'https://cafemaker.wakingsands.com'

type LangOption = 'en' | 'zh'
interface BaseSetting {
  item: LangOption
  icon: LangOption
}

export function useXABase(){
  const baseSetting = useCookie<BaseSetting>('xivapi-base', {
    default: () => {
      return {
        item: 'zh',
        icon: 'en'
      }
    }
  })

  const base = computed(()=>{
    return {
      item: baseSetting.value.item === 'zh' ? BASE_ZH : BASE_EN,
      icon: baseSetting.value.icon === 'zh' ? BASE_ZH : BASE_EN
    }
  })
  function toggleBase(type: keyof BaseSetting, value?: LangOption){
    baseSetting.value[type] = value ?? (baseSetting.value[type] === 'zh' ? 'en' : 'zh')
  }

  const itemURL = computed(() => {
    return new URL('item', base.value.item).href
  })

  return {
    baseSetting,
    base,
    toggleBase,
    itemURL,
  }
}

export async function fetchItems<T extends string | number>(ids: T[]): Promise<XAItem[]> {
  // docs on $fetch: https://github.com/unjs/ofetch
  const { itemURL } = useXABase()
  const json = await $fetch<XAContent<XAItem>>(itemURL.value, {
    query: {
      ids: ids.join(','),
      limit: ids.length,
    },
  })
  return json.Results
}

export function itemIconUrl(iconID: string | number, base?: string) {
  let defaultBase = useXABase().base
  const _id = `${iconID}`.padStart(6, '0')
  const folder = _id.substring(0, 3).padEnd(6, '0')
  return computed(()=>`${base || defaultBase.value.icon}/i/${folder}/${_id}.png`)
}

export function itemUrl(id: string | number, base?: string) {
  let defaultBase = useXABase().base
  return computed(()=>`${base || defaultBase.value.item}/item/${id}`)
}

export function useFailedIcons() {
  return useState('failed-icons', () => new Set<number | string>())
}

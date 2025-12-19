export interface XAContent<T> {
  schema: string
  version: string
  rows: T[]
}

export interface XAItem {
  row_id: number
  fields: {
    Icon: {
      id: number
      path: string
      path_hr1: string
    }
    Name: string
    Singular: string // URL
  }
}

export const BASE_EN = 'https://v2.xivapi.com/api/'
export const BASE_ZH = 'https://xivapi-v2.xivcdn.com/api/'

type LangOption = 'en' | 'zh'
interface BaseSetting {
  item: LangOption
  icon: LangOption
}

export function useXABase() {
  const baseSetting = useCookie<BaseSetting>('xivapi-base', {
    default: () => {
      return {
        item: 'zh',
        icon: 'en',
      }
    },
    sameSite: 'lax',
  })

  const base = computed(() => {
    return {
      item: baseSetting.value.item === 'zh' ? BASE_ZH : BASE_EN,
      icon: baseSetting.value.icon === 'zh' ? BASE_ZH : BASE_EN,
    }
  })
  function toggleBase(type: keyof BaseSetting, value?: LangOption) {
    baseSetting.value[type] = value ?? (baseSetting.value[type] === 'zh' ? 'en' : 'zh')
  }

  const itemURL = computed(() => {
    return new URL('sheet/Item', base.value.item).href
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
      rows: ids.join(','),
      limit: ids.length,
    },
  })
  return json.rows
}

export function itemIconUrl(iconID: string | number, base?: string) {
  const defaultBase = useXABase().base
  const _id = `${iconID}`.padStart(6, '0')
  const folder = _id.substring(0, 3).padEnd(6, '0')
  return new URL(`asset?path=ui/icon/${folder}/${_id}.tex&format=png`, base || defaultBase.value.icon).href
}

export function itemUrl(id: string | number, base?: string) {
  const defaultBase = useXABase().base
  return new URL(`sheet/Item/${id}`, base || defaultBase.value.item).href
}

export function useFailedIcons() {
  return useState('failed-icons', () => new Set<number | string>())
}

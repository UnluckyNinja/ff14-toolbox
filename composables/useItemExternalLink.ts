import type { MaybeRef } from '@vueuse/core'

// utils to generate links
export function huijiLink(id: string | number, name: string) {
  const _id = typeof id === 'number' ? id : Number.parseInt(id)
  const isItem = _id > 1000 || _id < 20 // skip tomestone
  return `https://ff14.huijiwiki.com/wiki/${isItem ? '物品:' : ''}${name}`
}
export function universalisLink(id: string | number) {
  return `https://universalis.app/market/${id}`
}
export function garlandDataCNLink(id: string | number) {
  return `https://www.garlandtools.cn/db/#item/${id}`
}
export function garlandDataEnLink(id: string | number) {
  return `https://www.garlandtools.org/db/#item/${id}`
}

export function useItemExternalLink(item: MaybeRef<{ id: string, name: string, dataSource: 'en' | 'cn' }>) {
  const huiji = ref('')
  const universalis = ref('')
  const garlandData = ref('')

  function update(id: string, name: string, dataSource: 'en' | 'cn') {
    huiji.value = huijiLink(id, name)
    universalis.value = universalisLink(id)
    if (dataSource === 'cn') {
      garlandData.value = garlandDataCNLink(id)
    } else {
      garlandData.value = garlandDataEnLink(id)
    }
  }

  watch(item, (newVal) => {
    const { id, name, dataSource } = unref(newVal)
    update(id, name, dataSource)
  }, { immediate: true })

  return {
    huiji,
    universalis,
    garlandData,
  }
}

export function getItemExternalLink(item: { id: string, name: string }) {
  return {
    huiji: huijiLink(item.id, item.name),
    universalis: universalisLink(item.id),
    garlandData: garlandDataCNLink(item.id),
  }
}

export function getLinks(id: number, name: string) {
  return [
    {
      label: '灰机wiki',
      url: huijiLink(id, name),
    },
    {
      label: 'Universalis',
      url: universalisLink(id),
    },
    {
      label: 'GarlandData',
      url: garlandDataCNLink(id),
    },
  ]
}

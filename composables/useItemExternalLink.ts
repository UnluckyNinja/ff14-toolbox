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
export function garlandDataLink(id: string | number) {
  return `https://www.garlandtools.cn/db/#item/${id}`
}

export function useItemExternalLink(item: MaybeRef<{ id: string; name: string }>) {
  const huiji = ref('')
  const universalis = ref('')
  const garlandData = ref('')

  function update(id: string, name: string) {
    huiji.value = huijiLink(id, name)
    universalis.value = universalisLink(id)
    garlandData.value = garlandDataLink(id)
  }

  watch(item, (newVal) => {
    const { id, name } = unref(newVal)
    update(id, name)
  }, { immediate: true })

  return {
    huiji,
    universalis,
    garlandData,
  }
}

export function getItemExternalLink(item: { id: string; name: string }) {
  return {
    huiji: huijiLink(item.id, item.name),
    universalis: universalisLink(item.id),
    garlandData: garlandDataLink(item.id),
  }
}

const base = 'https://cafemaker.wakingsands.com'

export function itemIconUrl(id: string | number) {
  const _id = `${id}`.padStart(6, '0')
  const folder = _id.substring(0, 3).padEnd(6, '0')
  return `${base}/i/${folder}/${_id}.png`
}

export function itemUrl(id: string | number) {
  return `${base}/item/${id}`
}

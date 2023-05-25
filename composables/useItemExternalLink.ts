import type { MaybeRef } from '@vueuse/core'

// utils to generate links
function huijiLink(id: string, name: string) {
  const _id = parseInt(id)
  const isItem = _id > 1000 || _id < 20 // skip tomestone
  return `https://ff14.huijiwiki.com/wiki/${isItem ? '物品:' : ''}${name}`
}
function universalisLink(id: string) {
  return `https://universalis.app/market/${id}`
}
function garlandDataLink(id: string) {
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

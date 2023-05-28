<script lang="ts" setup>
import type { Instance } from '~/composables/instances'

const instances = useInstanceContent()
type InsType = Exclude<keyof typeof instances, 'types'>
const categories: {
  type: InsType
  name: string
  icon: string
}[] = [
  {
    type: 'dungeons',
    name: '迷宫挑战',
    icon: '61801',
  },
  {
    type: 'trials',
    name: '讨伐歼灭战',
    icon: '61804',
  },
  {
    type: 'raids',
    name: '大型任务',
    icon: '61802',
  },
  {
    type: 'treasures',
    name: '寻宝',
    icon: '61808',
  },
  {
    type: 'variants',
    name: '特殊迷宫探索',
    icon: '61846',
  },
]
const base = 'https://cafemaker.wakingsands.com/i/'
function imgUrl(_id: string) {
  const id = `${_id}`.padStart(6, '0')
  const folder = id.substring(0, 3).padEnd(6, '0')
  return `${base}${folder}/${id}.png`
}
const selectedCategory = ref<InsType>('dungeons')
const sublistIndex = ref(0)
function chooseCategory(type: InsType) {
  selectedCategory.value = type
  sublistIndex.value = 0
}

const list = computed(() => {
  const filteredInstances = instances[selectedCategory.value]

  // subcategory
  if (['dungeons', 'trials', 'raids'].includes(selectedCategory.value)) {
    const types = [90, 80, 70, 60, 50]
    const result = filteredInstances.reduce((arr, ins) => {
      const id = types.findLastIndex(lvl => lvl >= (ins.max_lvl ?? 90))
      arr[id].children.push(ins)
      return arr
    }, ['等级 81~90', '等级 71~80', '等级 61~70', '等级 51~60', '等级 1~50'].map((it) => {
      return {
        name: it,
        children: [] as Instance[],
      }
    }))
    return result
  }
  else {
    return [{
      name: '全部',
      children: [...filteredInstances],
    }]
  }
})
</script>

<template>
  <div class="m-2 border p-2 flex flex-col gap-2">
    <div class="text-center">
      副本列表
    </div>
    <div class="flex justify-around">
      <UButton
        v-for="c in categories" :key="c.name" class="p-1"
        size="xl"
        color="gray" square :padded="true"
        :title="c.name"
        @click="chooseCategory(c.type)"
      >
        <img class="w-6 h-6" :src="imgUrl(c.icon)">
      </UButton>
    </div>
    <div class="flex flex-col overflow-hidden">
      <div v-for="item, i in list" :key="item.name">
        <UButton block color="white" variant="solid" size="xs" @click="sublistIndex = i">
          {{ item.name }}
        </UButton>
        <div class="transition transition-all ease-in-out overflow-auto duration-250" :class="sublistIndex === i ? 'max-h-999' : 'max-h-0'">
          <UButton
            v-for="ins in item.children" :key="ins.i"
            color="gray" block variant="ghost" size="2xs"
          >
            <div class="text-xs text-left w-full flex gap-1">
              <img class="w-4 h-4 inline-block" :src="imgUrl(`${ins.c}`)">
              <div class="truncate flex-grow" :title="ins.n">
                {{ ins.n }}
              </div>
              <div class="text-gray">
                Lv.{{ ins.min_lvl }}
              </div>
            </div>
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>

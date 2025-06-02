<script lang="ts" setup>
import type { Instance } from '~/composables/instances'

const emits = defineEmits<{
  (event: 'update:modelValue', value: Instance): void
}>()

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

const imgUrl = itemIconUrl

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
    const types = [100, 90, 80, 70, 60, 50]
    const result = filteredInstances.reduce((arr, ins) => {
      const id = types.findLastIndex(lvl => lvl >= (ins.max_lvl ?? 100))
      arr[id].children.push(ins)
      return arr
    }, ['等级 91~100', '等级 81~90', '等级 71~80', '等级 61~70', '等级 51~60', '等级 1~50'].map((it) => {
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
  <div class="border-muted m-2 p-2 border rounded flex flex-col gap-2">
    <!-- header -->
    <div class="text-center">
      副本列表
    </div>
    <!-- categories -->
    <div class="flex justify-around">
      <UButton
        v-for="c in categories" :key="c.name" class="p-1"
        size="xl" variant="soft"
        color="neutral" square :padded="true"
        :title="c.name"
        @click="chooseCategory(c.type)"
      >
        <img class="h-8 w-8" :src="imgUrl(c.icon).value">
      </UButton>
    </div>
    <!-- instances list -->
    <div class="flex flex-col overflow-hidden">
      <div v-for="item, i in list" :key="item.name">
        <!-- collapse toggle -->
        <UButton block color="secondary" variant="outline" size="sm" @click="sublistIndex = i">
          {{ item.name }}
        </UButton>
        <!-- sublist -->
        <div class="transition-all duration-500 ease-out overflow-auto" :class="sublistIndex === i ? 'h-120' : 'h-0'">
          <UButton
            v-for="ins in item.children" :key="ins.i"
            color="neutral" block variant="ghost" size="xs"
            @click="emits('update:modelValue', ins)"
          >
            <div class="text-base text-left flex gap-1 w-full items-center">
              <!-- icon -->
              <img class="h-4 w-4 inline-block" :src="imgUrl(`${ins.c}`).value">
              <!-- name -->
              <div class="flex-grow truncate" :title="ins.n">
                {{ ins.n }}
              </div>
              <!-- minimum character level -->
              <div class="text-muted">
                Lv.{{ ins.min_lvl === 1 ? ins.max_lvl : ins.min_lvl }}
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

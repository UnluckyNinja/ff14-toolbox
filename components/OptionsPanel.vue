<script lang="ts" setup>
const props = withDefaults(defineProps<{
  display?: {
    hq: boolean
  }
}>(), {
  display: () => ({
    hq: true,
  }),
})
const servers = reactive(useServerInfo())
const settings = reactive(useSettings())

if (settings.selectedRegion === '') {
  nextTick(() => {
    const stop = watch(servers, () => {
      if (settings.selectedRegion !== '') {
        stop()
        return
      }
      if (servers.regions.length > 0) {
        if (servers.regions.includes('中国'))
          settings.selectedRegion = '中国'
        else
          settings.selectedRegion = servers.regions[0]

        stop()
      }
    }, { immediate: true })
  })
}

// when selected region change, automatically change selected data center
watch(() => settings.selectedRegion, (newVal) => {
  const dcs = servers.dataCenters?.filter(it => it.region === newVal)
  if (!dcs || dcs.length === 0)
    return

  settings.selectedDataCenter = dcs[0].name
  settings.selectedServer = dcs[0].name
})

const dataCenterObj = computed(() => {
  return servers.dataCenters?.find(it => it.name === settings.selectedDataCenter)
})

// when selected data center change, automatically change selected server to that data center
watch(() => settings.selectedDataCenter, (newVal) => {
  settings.selectedServer = newVal
})

const dataCenterOptions = computed(() => {
  return servers.dataCenters?.filter(it => it.region === settings.selectedRegion) ?? []
})

const serverOptions = computed(() => {
  if (!dataCenterObj.value)
    return []
  return dataCenterObj.value.worlds.map(it => servers.worlds?.find(w => w.id === it)?.name) as string[]
})
</script>

<template>
  <div v-if="servers.regions.length > 0">
    <!-- settings -->
    <div
      v-if="settings.showOptions"
      class="options-panel max-w-screen grid grid-flow-row items-baseline gap-2 p-2 overflow-hidden"
    >
      <div class="col-start-1">
        运营地区
      </div>
      <div class="col-start-2">
        <UPopover class="inline-block">
          <UButton class="min-w-30" color="white" trailing-icon="i-heroicons-chevron-down-20-solid">
            <span class="flex-1">
              {{ settings.selectedRegion }}
            </span>
          </UButton>
          <template #panel="{ close }">
            <UButton v-for="region in servers.regions" :key="region" block color="gray" variant="ghost" tabindex="0" @click="close(); settings.selectedRegion = region">
              <span class="text-sm">
                {{ region }}
              </span>
            </UButton>
          </template>
        </UPopover>
      </div>
      <div class="col-start-1">
        大区
      </div>
      <div class="col-start-2">
        <UPopover class="inline-block">
          <UButton class="min-w-30" color="white" trailing-icon="i-heroicons-chevron-down-20-solid">
            <span class="flex-1">
              {{ settings.selectedDataCenter }}
            </span>
          </UButton>
          <template #panel="{ close }">
            <UButton v-for="dc in dataCenterOptions" :key="dc.name" block color="gray" variant="ghost" tabindex="0" @click="close(); settings.selectedDataCenter = dc.name">
              <span class="text-sm">
                {{ dc.name }}
              </span>
            </UButton>
          </template>
        </UPopover>
      </div>
      <div class="col-start-1">
        条目数量
      </div>
      <div class="col-start-2">
        <UInput class="inline-block" v-model="settings.numberPerPage" type="number" name="npp-input" />
      </div>
      <!-- servers -->
      <div v-if="settings.selectedDataCenter" class="whitespace-nowrap col-start-1">
        市场服务器
      </div>
      <div class="col-start-2">
        <div class="w-full flex flex-wrap gap-4">
          <URadio
          v-model="settings.selectedServer"
          :label="settings.selectedDataCenter" help="显示全区数据"
          :value="settings.selectedDataCenter"
          @click="settings.selectedServer = settings.selectedDataCenter"
          />
          <URadio
          v-for="sv in serverOptions"
          :key="sv"
          v-model="settings.selectedServer" :label="sv"
          :value="sv"
          @click="settings.selectedServer = sv"
          />
        </div>
      </div>
      <div v-if="props.display.hq" class="col-span-1">
        仅HQ
      </div>
      <UToggle v-if="props.display.hq" v-model="settings.onlyHQ" />
      <slot />
      <!-- workaround for UToggle tailwind class conflict -->
      <!-- <div class="translate-x-4" /> -->
    </div>
  </div>
  <div v-else class="p-4">
    获取Universalis服务器数据中
  </div>
</template>

<style lang="pcss" scoped>
.options-panel {
  grid-auto-columns: min-content auto;
}
</style>

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
      class="options-panel border-muted my-2 p-2 border rounded-lg gap-2 grid grid-flow-row max-w-screen items-center overflow-hidden"
    >
      <div class="text-right col-start-1">
        运营地区
      </div>
      <div class="col-start-2">
        <USelectMenu v-model="settings.selectedRegion" :items="servers.regions" class="min-w-48" />
      </div>
      <div class="text-right col-start-1">
        大区
      </div>
      <div class="col-start-2">
        <USelectMenu v-model="settings.selectedDataCenter" value-key="name" label-key="name" :items="dataCenterOptions" class="min-w-48" />
      </div>
      <div class="text-right col-start-1">
        条目数量
      </div>
      <div class="col-start-2">
        <UInput v-model="settings.numberPerPage" class="inline-block" type="number" name="npp-input" />
      </div>
      <!-- servers -->
      <div v-if="settings.selectedDataCenter" class="text-right col-start-1 whitespace-nowrap">
        市场服务器
      </div>
      <div class="col-start-2">
        <div class="flex flex-wrap gap-4 w-full">
          <URadioGroup
            v-model="settings.selectedServer"
            :items="[settings.selectedDataCenter]"
          >
            <template #label>
              显示全区数据
            </template>
          </URadioGroup>
          <URadioGroup
            v-model="settings.selectedServer"
            orientation="horizontal"
            :items="serverOptions"
          />
        </div>
      </div>
      <div v-if="props.display.hq" class="text-right col-span-1">
        仅HQ
      </div>
      <USwitch v-if="props.display.hq" v-model="settings.onlyHQ" />
      <slot />
      <!-- workaround for UToggle tailwind class conflict -->
      <!-- <div class="translate-x-4" /> -->
    </div>
  </div>
  <div v-else>
    <div class="bg-muted my-2 grid h-40 grid-place-content-center animate-pulse">
      获取Universalis服务器数据中
    </div>
  </div>
</template>

<style lang="pcss" scoped>
.options-panel {
  grid-auto-columns: min-content auto;
}
</style>

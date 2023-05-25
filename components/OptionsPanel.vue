<script lang="ts" setup>
const servers = useServerInfo()
const settings = useSettings()
if (settings.value.selectedRegion === '') {
  nextTick(() => {
    const stop = watch(servers, () => {
      if (settings.value.selectedRegion !== '') {
        stop()
        return
      }
      if (servers.value.regions.length > 0) {
        if (servers.value.regions.includes('中国'))
          settings.value.selectedRegion = '中国'
        else
          settings.value.selectedRegion = servers.value.regions[0]

        stop()
      }
    }, { immediate: true })
  })
}

// when selected region change, automatically change selected data center
watch(() => settings.value.selectedRegion, (newVal) => {
  const dcs = servers.value.dataCenters?.filter(it => it.region === newVal)
  if (!dcs || dcs.length === 0)
    return

  settings.value.selectedDataCenter = dcs[0].name
})

const dataCenterObj = computed(() => {
  return servers.value.dataCenters?.find(it => it.name === settings.value.selectedDataCenter)
})

// when selected data center change, automatically change selected server to that data center
watch(() => settings.value.selectedDataCenter, (newVal) => {
  settings.value.selectedServer = newVal
})

const dataCenterOptions = computed(() => {
  return servers.value.dataCenters?.filter(it => it.region === settings.value.selectedRegion) ?? []
})

const serverOptions = computed(() => {
  if (!dataCenterObj.value)
    return []
  return dataCenterObj.value.worlds.map(it => servers.value.worlds?.find(w => w.id === it)?.name) as string[]
})
</script>

<template>
  <div>
    <!-- settings -->
    <div
      v-if="settings.showOptions"
      class="grid grid-cols-12 gap-2 p-2 even:children:justify-self-start odd:children:justify-self-end"
    >
      <div class="col-span-1">
        运营地区
      </div>
      <UniSelect v-slot="{ handleClick }" class="col-span-2 w-full flex-1" :current="settings.selectedRegion">
        <div v-for="region in servers.regions" :key="region" tabindex="0" @click="handleClick(); settings.selectedRegion = region">
          <span class="text-sm">
            {{ region }}
          </span>
        </div>
      </UniSelect>
      <div class="col-span-1">
        大区
      </div>
      <UniSelect v-slot="{ handleClick }" class="col-span-2 w-full flex-1" :current="settings.selectedDataCenter">
        <div v-for="dc in dataCenterOptions" :key="dc.name" tabindex="0" @click="handleClick(); settings.selectedDataCenter = dc.name">
          <span class="text-sm">
            {{ dc.name }}
          </span>
        </div>
      </UniSelect>
      <div class="col-span-1">
        条目数量
      </div>
      <div class="col-span-2">
        <UInput v-model="settings.numberPerPage" type="number" name="npp-input" />
      </div>
    </div>
    <!-- servers -->
    <div v-if="settings.selectedDataCenter" class="grid grid-cols-12 gap-y-2 p-2">
      <div class="col-span-1">
        市场服务器
      </div>
      <div class="col-span-11 flex flex-wrap gap-4">
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
      <div class="col-span-1">
        仅HQ
      </div>
      <UToggle v-model="settings.onlyHQ" />
      <!-- workaround for UToggle tailwind class conflict -->
      <!-- <div class="translate-x-4" /> -->
    </div>
  </div>
</template>

<style lang="postcss" scoped>
</style>

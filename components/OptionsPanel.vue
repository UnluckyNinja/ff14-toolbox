<script lang="ts" setup>
const servers = reactive(useServerInfo())
const settings = useSettings()
if (settings.value.selectedRegion === '') {
  nextTick(() => {
    const stop = watch(servers, () => {
      if (settings.value.selectedRegion !== '') {
        stop()
        return
      }
      if (servers.regions.length > 0) {
        if (servers.regions.includes('中国'))
          settings.value.selectedRegion = '中国'
        else
          settings.value.selectedRegion = servers.regions[0]

        stop()
      }
    }, { immediate: true })
  })
}

// when selected region change, automatically change selected data center
watch(() => settings.value.selectedRegion, (newVal) => {
  const dcs = servers.dataCenters?.filter(it => it.region === newVal)
  if (!dcs || dcs.length === 0)
    return

  settings.value.selectedDataCenter = dcs[0].name
})

const dataCenterObj = computed(() => {
  return servers.dataCenters?.find(it => it.name === settings.value.selectedDataCenter)
})

// when selected data center change, automatically change selected server to that data center
watch(() => settings.value.selectedDataCenter, (newVal) => {
  settings.value.selectedServer = newVal
})

const dataCenterOptions = computed(() => {
  return servers.dataCenters?.filter(it => it.region === settings.value.selectedRegion) ?? []
})

const serverOptions = computed(() => {
  if (!dataCenterObj.value)
    return []
  return dataCenterObj.value.worlds.map(it => servers.worlds?.find(w => w.id === it)?.name) as string[]
})
</script>

<template>
  <div>
    <!-- settings -->
    <div
      v-if="settings.showOptions"
      class="flex flex-wrap gap-2 p-2 items-center"
    >
      <div>
        运营地区
        <div class="inline-block">
          <UPopover class="mr-10">
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
      </div>
      <div>
        大区
        <div class="inline-block">
          <UPopover class="mr-10">
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
      </div>
      <div>
        条目数量
        <div class="inline-block">
          <UInput v-model="settings.numberPerPage" type="number" name="npp-input" />
        </div>
      </div>
    </div>
    <!-- servers -->
    <div v-if="settings.selectedDataCenter" class="grid grid-cols-12 p-2 gap-y-2">
      <div class="col-span-1">
        市场服务器
      </div>
      <div class="flex gap-4 col-span-11 flex-wrap">
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

<script lang="ts" setup>
import type { DuckDBClient } from '~/data/duckDB';
import type { Server } from './composables/gameServers';
import type { Setting } from './composables/setting';
import { loadItemData, getItemData } from './data';

const uiState = useUIState()
uiState.value.loading = true
fetchServerInfo()

const db = useState<DuckDBClient | null>('duckdb', () => null)

onMounted(async () => {
  if (db.value) return
  await loadItemData()
  const text = getItemData()
  const { DuckDBClient } = await import('~/data/duckDB')
  db.value = await DuckDBClient.of({
    items: text,
  })
  uiState.value.loading = false
})

const results = ref()

const servers = useServerInfo()
const worlds = useServerWorlds()

const settings = useSetting()
const showSettings = ref(false)

const userDataCenter = ref<Server>()


// load from storage and save on change
onMounted(() => {

  const local = useLocalStorage<Setting>('items-search-settings', settings.value)

  settings.value = local.value

  if (settings.value.userDataCenter || servers.value) {
    userDataCenter.value = settings.value.userDataCenter ?? servers.value?.[0]
  }

  watch(settings, () => {
    local.value = settings.value
    console.log('settings: ' + settings.value)
    if (settings.value.userDataCenter) {
      marketCenter.value = settings.value.userDataCenter.section
    }
  })
  const stop = watch(servers, (newVal) => {
    if (!userDataCenter.value) {
      userDataCenter.value = settings.value.userDataCenter ?? servers.value?.[0]
    } else {
      stop()
    }
  })
  watch(userDataCenter, (newVal) => {
    if (newVal) {
      settings.value.userDataCenter = newVal
    }
  })
})

const serverOptions = computed(() => {
  if (!userDataCenter.value) return []
  return [userDataCenter.value.section, ...userDataCenter.value.dcObj.worlds]
})


const marketCenter = useState<string | number>('marketCenter', () => userDataCenter.value?.section ?? '')

watch(serverOptions, (newVal) => {
  if (newVal.length > 0) {
    marketCenter.value = newVal[0]
  }
})

// on searchbar select item
const selectedItem = shallowRef<any>(null)
provide('selected-item', selectedItem)

function onItemClick(item: any) {
  selectedItem.value = item
}

// handy nametag
function copyName() {
  if (selectedItem.value && navigator.clipboard) {
    navigator.clipboard.writeText(selectedItem.value.name)
  }
}

// utils to generate links
function huijiLink(item: any) {
  const id = parseInt(item.id)
  const isItem = id > 1000 || id < 20
  return `https://ff14.huijiwiki.com/wiki/${isItem ? '物品:' : ''}${item.name}`
}
function universalisLink(item: any) {
  return `https://universalis.app/market/${item.id}`
}
function garlandDataLink(item: any) {
  return `https://www.garlandtools.cn/db/#item/${item.id}`
}


const isAppLoading = computed(() => {
  if (servers.value.length === 0) return true
  return uiState.value.loading
})
</script>

<template>
  <div class="p-20">
    <div v-if="isAppLoading" class="grid grid-rows-2 place-content-center items-center gap-4 text-center">
      <div class="row-span-1 text-3xl">加载数据中，请稍候</div>
      <div class="row-span-1">
        <ASpinner class="w-20"></ASpinner>
      </div>
    </div>
    <div v-else>
      <!-- search bar -->
      <div class="flex items-center gap-4 my-2">
        <SearchBar class="flex-1" @update:modelValue="results = $event" @itemClick="onItemClick($event)">Primary
        </SearchBar>
        <OptionsButton @click="showSettings = !showSettings" class="flex-none"></OptionsButton>
      </div>
      <!-- settings -->
      <div v-if="showSettings"
        class="bg-blueGray-3 p-2 grid grid-cols-12 gap-2 odd:children:justify-self-end even:children:justify-self-start ">
        <div class="col-span-1">数据区域</div>
        <UniSelect class="col-span-3 w-full flex-1" :current="userDataCenter?.label" #default="{ handleClick }">
          <div v-for="server in servers" :key="server.label" tabindex="0" @click="handleClick(); userDataCenter = server">
            <span class="text-sm">
              {{ server.label }}
            </span>
          </div>
        </UniSelect>
        <div class="col-span-1">条目数量</div>
        <div class="col-span-2">
          <input v-model="settings.numberPerPage" type="number" name="" id="">
        </div>
      </div>
      <!-- servers -->
      <div v-if="userDataCenter" class="grid grid-cols-12 p-2 bg-light-8 gap-y-2">
        <div class="col-span-1">市场服务器</div>
        <div class="col-span-11 flex flex-wrap gap-4">
          <label v-for="option, i in serverOptions" :key="i">
            <input type="radio" :checked="marketCenter === option" @change="marketCenter = option">
            {{ i === 0 ? option + '区' : worlds[option] }}
          </label>
        </div>
        <div class="col-span-1">仅HQ</div>
        <div class="col-span-11">
          <input v-model="settings.onlyHQ" type="checkbox" name="" id="">
        </div>
      </div>
      <!-- info -->
      <div v-if="selectedItem" class="flex items-center my-2">
        已选择物品：
        <div class="group hover:cursor-pointer bg-dark/10 hover:bg-dark/20 select-none active:bg-dark/40 flex items-center rounded px-1" @click="copyName">
          {{ selectedItem.name }}
          <div i-carbon-copy class="ml-1 inline-block"></div>
        </div>
        <div class="underline children:mx-2 text-blue-7">
          <a :href="huijiLink(selectedItem)" class="inline-flex w-max items-center" target="_blank">
            灰机Wiki
            <div i-carbon-link class="inline-block"></div>
          </a>
          <a :href="universalisLink(selectedItem)" class="inline-flex w-max flex items-center" target="_blank">
            Universalis
            <div i-carbon-link class="inline-block"></div>
          </a>
          <a :href="garlandDataLink(selectedItem)" class="inline-flex w-max flex items-center" target="_blank">
            GarlandData
            <div i-carbon-link class="inline-block"></div>
          </a>
        </div>
      </div>
      <MarketInfo></MarketInfo>
    </div>
  </div>
</template>

<style>
body {
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji", FFXIV_Lodestone_SSF;
}

@font-face {
  font-family: FFXIV_Lodestone_SSF;
  font-style: normal;
  font-weight: 400;
  src: url('/FFXIV_Lodestone_SSF.woff');
  src: url('/FFXIV_Lodestone_SSF.woff') format("woff");
}

progress {
  border-width: unset;
  border-style: unset;
  border-color: unset;
}
</style>
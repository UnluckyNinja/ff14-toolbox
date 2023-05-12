<script lang="ts" setup>
import type { Server } from './composables/gameServers';
import type { Setting } from './composables/setting';


fetchServerInfo()

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


const marketCenter = ref<string | number>(userDataCenter.value?.section ?? '')

watch(serverOptions, (newVal) => {
  if (newVal.length > 0) {
    marketCenter.value = newVal[0]
  }
})

const selectedItem = shallowRef<any>(null)

const marketInfo = ref<any>(null)
const updating = ref(false)

watch([selectedItem, marketCenter, () => settings.value.onlyHQ], async ([item, market, HQ]) => {
  if (!item || !market) return {}
  updating.value = true
  const options: any = {
    listings: settings.value.numberPerPage,
    entries: 10
  }
  if (item.canBeHQ && HQ) {
    options.hq = true
  }
  marketInfo.value = await fetchMarket(market, item.id, options)
  updating.value = false
})

function onItemClick(item: any) {
  selectedItem.value = item
}

function copyName() {
  if (selectedItem.value && navigator.clipboard) {
    navigator.clipboard.writeText(selectedItem.value.name)
  }
}

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
</script>

<template>
  <div class="p-20">
    <Suspense>
      <div>
        <!-- search bar -->
        <div class="flex">
          <SearchBar class="flex-1" @update:modelValue="results = $event" @itemClick="onItemClick($event)">Primary
          </SearchBar>
          <OptionsButton @click="showSettings = !showSettings" class="flex-none"></OptionsButton>
        </div>
        <!-- settings -->
        <div v-if="showSettings"
          class="bg-blueGray-3 p-2 grid grid-cols-12 gap-2 odd:children:justify-self-end even:children:justify-self-start ">
          <div class="col-span-1">数据区域</div>
          <UniSelect class="col-span-3 w-full flex-1" :current="userDataCenter?.label" #default="{ handleClick }">
            <div v-for="server in servers" :key="server.label" tabindex="0"
              @click="handleClick(); userDataCenter = server">
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
        <div v-if="selectedItem" class="flex items-center">
          已选择物品：
          <div class="group hover:cursor-pointer hover:bg-dark/20 flex items-center rounded px-1" @click="copyName">
            {{ selectedItem.name }}
            <div i-carbon-copy class="invisible group-hover:visible inline-block"></div>
          </div>
          <div class="underline children:mx-2 text-blue-5">
            <a :href="huijiLink(selectedItem)" target="_blank">
              灰机Wiki
            </a>
            <a :href="universalisLink(selectedItem)" target="_blank">
              Universalis
            </a>
            <a :href="garlandDataLink(selectedItem)" target="_blank">
              GarlandData
            </a>
          </div>
        </div>
        <!-- prices -->
        <div v-if="updating">
          <div class="text-center">
            <div i-line-md-loading-twotone-loop class="w-24 h-24 inline-block"></div>
          </div>
        </div>
        <div v-if="marketInfo && !updating">
          <div class="text-center font-bold text-xl m-4" v-if="marketInfo.listings.length === 0 && marketInfo.recentHistory.length === 0">
            该物品可能无法交易
          </div>
          <div class="text-center" v-else>
            <!-- on sale -->
            <h2 class="text-2xl m-2">在售列表</h2>
            <table class="min-w-1/2 mx-auto table-auto">
              <thead>
                <tr>
                  <th>物品名</th>
                  <th>单价</th>
                  <th>数量</th>
                  <th>总计</th>
                  <th>雇员名</th>
                  <th>服务器</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in marketInfo.listings" class="odd:bg-dark/10 divide-x children:px-4 children:py-2">
                  <td>{{ selectedItem.name }}{{ item.hq ? '' : '' }}</td>
                  <td class="text-end">{{ item.pricePerUnit }}</td>
                  <td>x {{ item.quantity }}</td>
                  <td class="text-end">{{ item.total }}</td>
                  <td>{{ item.retainerName }}</td>
                  <td>{{ item.worldName }}</td>
                </tr>
              </tbody>
            </table>
            <!-- history -->
            <h2 class="text-2xl m-2">历史交易</h2>
            <table class="min-w-1/2 mx-auto table-auto">
              <thead>
                <tr>
                  <th>物品名</th>
                  <th>单价</th>
                  <th>数量</th>
                  <th>总计</th>
                  <th>购买者</th>
                  <th>服务器</th>
                  <th>购买时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in marketInfo.recentHistory" class="odd:bg-dark/10 divide-x children:px-4 children:py-2">
                  <td>{{ selectedItem.name }}{{ item.hq ? '' : '' }}</td>
                  <td class="text-end">{{ item.pricePerUnit }}</td>
                  <td>x {{ item.quantity }}</td>
                  <td class="text-end">{{ item.total }}</td>
                  <td>{{ item.buyerName }}</td>
                  <td>{{ item.worldName }}</td>
                  <td>{{ new Date(item.timestamp * 1000).toLocaleString('zh-CN') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Suspense>
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
</style>
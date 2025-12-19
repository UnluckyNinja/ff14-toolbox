<script lang="ts" setup>
import { useDuckDB } from '~/lib/duckDB'

definePageMeta({
  title: '数据库批量查询',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

const db = useDuckDB()

provide('duckDB', db)

const { queryID, queryExactNameAll } = useQueries()

const input = ref('')
const output = ref('')

const perLines = ref(1)
const keepLine = ref(0)

const isPerLinesValid = computed(() => {
  return perLines.value >= 1 && Number.isInteger(perLines.value)
})
const isKeepLineValid = computed(() => {
  return keepLine.value >= 0 && Number.isInteger(keepLine.value) && keepLine.value < perLines.value
})

const history = reactive<{
  input: string
}[]>([])

function shrinkTexts() {
  if (!isPerLinesValid.value || !isKeepLineValid.value)
    return
  const lines = input.value.split('\n')
  if (lines.length < perLines.value)
    return
  history.push({ input: input.value })
  input.value = lines.filter((it, idx) => {
    return idx % perLines.value === keepLine.value
  }).join('\n')
}
function clickUndo() {
  if (history.length <= 0)
    return
  input.value = history.pop()!.input
}

const sourceType = ref('ID')

const results = shallowReactive<any[]>([])
const targetProperty = ref('name')

watch(sourceType, (newVal) => {
  if (newVal === 'ID' && targetProperty.value === 'id')
    targetProperty.value = 'name'
  if (newVal === '名称' && targetProperty.value === 'name')
    targetProperty.value = 'id'
  results.splice(0)
})

const options = computed(() => {
  if (results.length <= 0)
    return ['id', 'name']

  const first = results.find(it => !!it)
  if (!first)
    return ['id', 'name']

  return Object.keys(first)
})

function updateOutput() {
  output.value = results.map((it) => {
    if (!it)
      return ''
    return it[targetProperty.value]
  }).join('\n')
}
async function search() {
  const lines = input.value.split('\n').map(it => it.trim())
  results.splice(0)

  const queryFunc = sourceType.value === 'ID' ? queryID : queryExactNameAll
  for (let i = 0; i < lines.length; i++)
    results[i] = await queryFunc(lines[i])
  updateOutput()
}
watch(targetProperty, () => {
  updateOutput()
})
</script>

<template>
  <UContainer class="">
    <DBLoading v-if="!db" />
    <div v-else>
      <div class="my-2 grid grid-cols-11">
        <div class="border-muted p-2 border rounded-lg col-span-5">
          <div class="mb-2">
            数据清理，粘贴的数据源需要选择性剔除时使用
          </div>
          <div class="flex gap-2 items-center">
            <UFormField label="每n行" help="必须为大于等于1的整数" :error="isPerLinesValid ? '' : '必须为大于等于1的整数'">
              <UInput v-model.number="perLines" type="number" />
            </UFormField>
            <UFormField label="保留行" hint="从0起" help="必须为大于等于0且小于前者的整数" :error="isKeepLineValid ? '' : '必须为大于等于0且小于前者的整数'">
              <UInput v-model.number="keepLine" type="number" class="w-full" />
            </UFormField>
            <UButton :disabled="!isPerLinesValid || !isKeepLineValid" @click="shrinkTexts">
              处理
            </UButton>
            <UButton color="error" :disabled="history.length <= 0" variant="soft" @click="clickUndo">
              撤销
            </UButton>
          </div>
        </div>
        <div class="col-span-1" />
        <div class="flex flex-col col-span-5 justify-end">
          <div class="mb-4 flex gap-2 items-center">
            <UFormField v-if="results.length > 0" label="转换属性">
              <USelectMenu v-model="targetProperty" class="min-w-40" :items="options" />
            </UFormField>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-11">
        <div class="col-span-5">
          <UTextarea v-model="input" placeholder="将数据源粘贴在这里，每行一条数据" class="font-mono w-full" :ui="{ base: 'resize-none' }" variant="subtle" :rows="20" />
        </div>
        <div class="flex flex-col gap-8 col-span-1 place-self-center">
          <UFormField label="源数据类型">
            <USelect v-model="sourceType" class="w-full" :items="['ID', '名称']" />
          </UFormField>
          <UButton @click="search">
            >> 查询 >>
          </UButton>
        </div>
        <div class="col-span-5">
          <UTextarea v-model="output" placeholder="这里会输出所选属性" class="font-mono w-full" :ui="{ base: 'resize-none' }" variant="subtle" :rows="20" readonly />
        </div>
      </div>
    </div>
  </UContainer>
</template>

<style lang="postcss" scoped>
</style>

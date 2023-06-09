<script lang="ts" setup>
definePageMeta({
  title: '数据库批量查询',
})
const route = useRoute()
useHead({
  title: route.meta.title as string,
})

const { db } = useDuckDB()

provide('duckDB', db)

const { queryID, queryExactName } = useQueries(db)

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

  const queryFunc = sourceType.value === 'ID' ? queryID : queryExactName
  for (let i = 0; i < lines.length; i++)
    results[i] = await queryFunc(lines[i])
  updateOutput()
}
watch(targetProperty, () => {
  updateOutput()
})
</script>

<template>
  <div class="mx-auto mt-10 container">
    <DBLoading v-if="!db" />
    <div v-else>
      <div class="grid grid-cols-11">
        <div class="col-span-5">
          <div class="mb-4 flex items-center gap-2">
            <UFormGroup label="每n行" help="必须为大于等于1的整数" :error="isPerLinesValid ? '' : '必须为大于等于1的整数'">
              <UInput v-model.number="perLines" type="number" />
            </UFormGroup>
            <UFormGroup label="保留行" hint="从0起" help="必须为大于等于0且小于前者的整数" :error="isKeepLineValid ? '' : '必须为大于等于0且小于前者的整数'">
              <UInput v-model.number="keepLine" type="number" />
            </UFormGroup>
            <UButton :disabled="!isPerLinesValid || !isKeepLineValid" @click="shrinkTexts">
              处理
            </UButton>
            <UButton color="red" :disabled="history.length <= 0" variant="soft" @click="clickUndo">
              撤销
            </UButton>
          </div>
        </div>
        <div class="col-span-1" />
        <div class="col-span-5">
          <div class="mb-4 flex items-center gap-2">
            <UFormGroup v-if="results.length > 0" label="转换属性">
              <USelectMenu v-model="targetProperty" class="min-w-40" :options="options" />
            </UFormGroup>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-11">
        <div class="col-span-5">
          <UTextarea v-model="input" class="font-mono" variant="outline" :rows="20" />
        </div>
        <div class="col-span-1 flex flex-col place-self-center gap-8">
          <UFormGroup label="源数据类型">
            <USelectMenu v-model="sourceType" :options="['ID', '名称']" />
          </UFormGroup>
          <UButton @click="search">
            >> 查询 >>
          </UButton>
        </div>
        <div class="col-span-5">
          <UTextarea v-model="output" class="font-mono" variant="outline" :rows="20" readonly />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
</style>

export const usePricePalette = createGlobalState(() => {
  const colorMode = useColorMode()

  const numbersColor = computed(() => {
    if (colorMode.value === 'dark') {
      return [
        '#FFC242',
        '#FF9C38',
        '#FF6161',
      ]
    }
    return [
      '#C78800',
      '#E07000',
      '#EB0000',
    ]
  })

  return numbersColor
})

export type TypeofMapKey<T> = T extends Map<infer K, any> ? K : never
export type TypeofMapValue<T> = T extends Map<any, infer V> ? V : never

interface FetchWithProgressOptions {
  onProgress?: (received: number, contentLength?: number) => void
}

type ResultType = 'u8array' | 'blob' | 'text'

export async function fetchWithProgress(url: string, options?: RequestInit & FetchWithProgressOptions, type?: 'u8array'): Promise<Uint8Array<ArrayBuffer>>
export async function fetchWithProgress(url: string, options?: RequestInit & FetchWithProgressOptions, type?: 'blob'): Promise<Blob>
export async function fetchWithProgress(url: string, options?: RequestInit & FetchWithProgressOptions, type?: 'text'): Promise<string>
export async function fetchWithProgress(url: string, options?: RequestInit & FetchWithProgressOptions, type: ResultType = 'u8array') {
  const res = await fetch(url, options)
  const { onProgress } = options ?? {}
  if (!res.body) {
    return null
  }
  const reader = res.body.getReader()
  const contentLength = parseInt(res.headers.get('content-length') ?? '0')
  if (contentLength) {
    onProgress?.(0, contentLength)
  }
  let receivedLength = 0
  const chunks: Uint8Array<ArrayBuffer>[] = []
  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    chunks.push(value)
    receivedLength += value.length
    onProgress?.(receivedLength, contentLength)
  }

  if (type === 'blob') {
    return new Blob(chunks)
  }

  const chunksAll = new Uint8Array(receivedLength)
  let position = 0
  for (const chunk of chunks) {
    chunksAll.set(chunk, position)
    position += chunk.length
  }
  if (type === 'text') {
    return new TextDecoder().decode(chunksAll)
  }

  return chunksAll
}

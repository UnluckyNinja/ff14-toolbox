export interface HistoryItem {
  id: string
  name: string
  iconID: string
}

export function useSearchHistory() {
  const MAX_RECORD = 20

  const history = useState('item-search:history', () => {
    const store = useLocalStorage('item-search:history', [] as HistoryItem[])

    return store
  })

  function add(item: HistoryItem) {
    const idx = history.value.findIndex(it => it.id === item.id)
    // bring it to front if recently searched
    if (idx >= 0)
      history.value.splice(idx, 1)

    history.value.push(item)
    if (history.value.length > MAX_RECORD)
      history.value.shift()
  }

  return {
    history,
    add,
  }
}

export function useSettings() {
  const state = useState('item-search:settings', () => {
    const defaultSettings = {
      showOptions: true,
      onlyHQ: true,
      selectedRegion: '',
      selectedDataCenter: '',
      selectedServer: 0 as string | number,
      numberPerPage: 20,
    }

    const settings = useLocalStorage('item-search:settings', defaultSettings, { mergeDefaults: true })

    return settings
  })

  return state
}

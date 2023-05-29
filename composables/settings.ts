export function useSettings() {
  const defaultSettings = {
    showOptions: true,
    onlyHQ: false,
    selectedRegion: '',
    selectedDataCenter: '',
    selectedServer: '',
    numberPerPage: 20,
  }

  const settings = useLocalStorage('item-search:settings', defaultSettings, { mergeDefaults: true })

  return settings
}

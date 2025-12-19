export function useSettings() {
  const defaultSettings = {
    showOptions: true,
    onlyHQ: false,
    selectedRegion: '',
    selectedDataCenter: '',
    selectedServer: '',
    numberPerPage: 20,
  }

  const showOptions = useLocalStorage('item-search:settings.showOptions', defaultSettings.showOptions)
  const onlyHQ = useLocalStorage('item-search:settings.onlyHQ', defaultSettings.onlyHQ)
  const selectedRegion = useLocalStorage('item-search:settings.selectedRegion', defaultSettings.selectedRegion)
  const selectedDataCenter = useLocalStorage('item-search:settings.selectedDataCenter', defaultSettings.selectedDataCenter)
  const selectedServer = useLocalStorage('item-search:settings.selectedServer', defaultSettings.selectedServer)
  const numberPerPage = useLocalStorage('item-search:settings.numberPerPage', defaultSettings.numberPerPage)

  return {
    showOptions,
    onlyHQ,
    selectedRegion,
    selectedDataCenter,
    selectedServer,
    numberPerPage,
  }
}

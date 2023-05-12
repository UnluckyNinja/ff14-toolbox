import { Server } from './gameServers'

export type Setting = {
  userDataCenter: Server | null,
  onlyHQ: boolean,
  numberPerPage: number,
}

export function useSetting(): Ref<Setting>{
  const setting = useState('setting', ()=>{
    const value = reactive({
      userDataCenter: null,
      onlyHQ: false,
      numberPerPage: 20,
    })
    return value
  })
  return setting
}

type UIState = {
  loading: boolean,
  searching: boolean,
  showSearchResult: boolean,
}

export function useUIState(): Ref<UIState>{
  const state = useState('ui-state', ()=>{
    const value = reactive({
      loading: false,
      searching: false,
      showSearchResult: false,
    })
    return value
  })
  return state
}
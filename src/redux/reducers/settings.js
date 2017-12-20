const initialState = {
  settings: {},
  isLoading: false,
  showSettingForm: false,
  showSetting: null,
  recentlyPlayedLength: 0,
  mostPlayedLength: 0
};

export default function settings(state = initialState, action = {}) {
  switch (action.type) {
    // case 'SETTINGS_LOADING':
    //   return {
    //     ...state,
    //     isLoading: true,
    //   }
    case 'SETTINGS_LOADING_SUCCESS':
      return {
        ...state,
        isLoading: false,
        settings: action.payload.settings,
        recentlyPlayedLength: action.payload.recentlyPlayedLength,
        mostPlayedLength: action.payload.mostPlayedLength
      }
    // case 'SETTINGS_LOADING_ERROR':
    //   return {
    //     ...state,
    //     isLoading: false,
    //   }
    case 'SETTINGS_SHOW_SET_SETTING':
      return {
        ...state,
        showSettingForm: true,
        showSetting: action.payload.setting
      }
    case 'SETTINGS_LANGUAGE_CHANGED_SUCCESS':
    case 'SETTINGS_RESET_MOST_PLAYED_SUCCESS':
    case 'SETTINGS_CANCEL_SHOW_SET_SETTING':
    case 'SETTINGS_RESET_RECENTLY_PLAYED_SUCCESS':
      return {
        ...state,
        showSettingForm: false,
        showSetting: null
      }
    case 'SETTINGS_SET_RECENTLY_PLAYED_LENGTH_SUCCESS':
      return {
        ...state,
        recentlyPlayedLength: action.payload.recentlyPlayedLength,
        showSettingForm: false,
        showSetting: null
      }
    case 'SETTINGS_SET_MOST_PLAYED_LENGTH_SUCCESS':
      return {
        ...state,
        mostPlayedLength: action.payload.mostPlayedLength,
        showSettingForm: false,
        showSetting: null
      }
    default:
      return state;
  }
}
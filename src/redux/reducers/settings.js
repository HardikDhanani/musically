const initialState = {
  settings: {},
  isLoading: false,
  showSettingForm: false,
  showSetting: null,
  recentlyPlayedLength: 0,
  mostPlayedLength: 0,
  mostPlayedReproductions: 0
};

export default function settings(state = initialState, action = {}) {
  switch (action.type) {
    case 'SETTINGS_LOADING_SUCCESS':
      return {
        ...state,
        isLoading: false,
        settings: action.payload.settings,
        recentlyPlayedLength: action.payload.recentlyPlayedLength,
        mostPlayedLength: action.payload.mostPlayedLength,
        mostPlayedReproductions: action.payload.mostPlayedReproductions,
      }
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
    case 'SETTINGS_SET_MOST_PLAYED_REPRODUCTIONS_SUCCESS':
      return {
        ...state,
        mostPlayedReproductions: action.payload.mostPlayedReproductions,
        showSettingForm: false,
        showSetting: null
      }
    default:
      return state;
  }
}
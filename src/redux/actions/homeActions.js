import LocalService from '../../services/LocalService';

// export const loadingSongs = () => {
//   return {
//     type: 'LOADING_SONGS'
//   }
// }

// export const loadingSongsSuccess = (songs) => {
//   return {
//     type: 'LOADING_SONGS_SUCCESS',
//     payload: {
//       songs
//     }
//   }
// }

// export const loadingSongsError = () => {
//   return {
//     type: 'LOADING_SONGS_ERROR'
//   }
// }

export const sectionChanged = (section) => {
  return {
    type: 'SECTION_CHANGED',
    payload: {
      section
    }
  }
}

// export function loadSongs() {
//   return dispatch => {
//     dispatch(loadingSongs())

//     LocalService.getSongs()
//       .then(songs => {
//         dispatch(loadingSongsSuccess(songs))
//       })
//       .catch(error => {
//         dispatch(loadingSongsError())
//       });
//   }
// }

export function selectedSectionChanged(section) {
  return dispatch => {
    dispatch(sectionChanged(section))
  }
}

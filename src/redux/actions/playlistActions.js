import LocalService from '../../services/LocalService';
import * as favoritesActions from './favoritesActions';
import * as appActions from './appActions';

const loading = () => {
  return {
    type: 'PLAYLIST_LOADING'
  }
}

const loadingSuccess = (playlist) => {
  return {
    type: 'PLAYLIST_LOADING_SUCCESS',
    payload: {
      playlist
    }
  }
}

const loadingError = () => {
  return {
    type: 'PLAYLIST_LOADING_ERROR'
  }
}

const removingSong = () => {
  return {
    type: 'PLAYLIST_REMOVING_SONG'
  }
}

const removingSongSuccess = (playlist) => {
  return {
    type: 'PLAYLIST_REMOVING_SONG_SUCCESS',
    payload: {
      playlist
    }
  }
}

export function load(playlistId) {
  return dispatch => {
    dispatch(loading())

    LocalService.getPlaylistById(playlistId)
      .then(playlist => {
        dispatch(loadingSuccess(playlist));
      });
  }
}

const _unlikeIfFavorite = (playlist, song, dispatch) => {
  if(song){
    if(playlist.name.toLowerCase() === 'favorites'){
      song.isFavorite = true;
      favoritesActions.like('song', song, false)(dispatch);
    }
  }
}

export function removeSong(playlistId, songId) {
  return dispatch => {
    dispatch(removingSong());

    let playlist = null;
    let song = null;

    LocalService.getPlaylistById(playlistId)
      .then(pl => {
        playlist = pl;
        
        let index = playlist.songs.findIndex(s => s.id === songId);
        if (index !== -1) {
          song = playlist.songs[index];
          playlist.songs.splice(index, 1);
        }
        LocalService.savePlaylist(playlist)
          .then(() => {
            _unlikeIfFavorite(playlist, song, dispatch);
            appActions.updatePlaylists()(dispatch);
            dispatch(removingSongSuccess(playlist));
          });
      });
  }
}
import { combineReducers } from 'redux';

import home from './home';
import app from './app';
import search from './search';
import artist from './artist';
import album from './album';
import genre from './genre';
import player from './player';
import queue from './queue';
import favorites from './favorites';
import playlists from './playlists';

const reducer = combineReducers({
  app,
  home,
  search,
  artist,
  album,
  genre,
  player,
  queue,
  favorites,
  playlists
});

export default reducer;
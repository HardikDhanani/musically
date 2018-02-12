import { combineReducers } from 'redux';

import home from './home';
import app from './app';
import search from './search';
import artist from './artist';
import album from './album';
import player from './player';
import queue from './queue';
import favorites from './favorites';
import playlist from './playlist';
import settings from './settings';
import playlistSelector from './playlistSelector';
import mostPlayed from './mostPlayed';
import recentlyPlayed from './recentlyPlayed';

const reducer = combineReducers({
  app,
  home,
  search,
  artist,
  album,
  player,
  queue,
  favorites,
  playlist,
  settings,
  playlistSelector,
  mostPlayed,
  recentlyPlayed
});

export default reducer;
import 'jest';

import favorites from '../../../src/redux/reducers/favorites';
import songsSelector from '../../../src/redux/selectors/songs';

jest.mock('../../../src/redux/selectors/songs');

const currentState = {
  songs: [],
  artists: [],
  albums: [],
  genres: [],
  isLoading: false,
  update: false,
};

beforeEach(() => {
  songsSelector.orderBy = jest.fn((group, criteria) => group);
});

it('Favorites reducer | State is undefined | Return initial state', () => {
  let state = favorites(undefined, { type: 'ACTION_TYPE' });

  expect(state.isLoading).toBe(false);
  expect(state.songs).toHaveLength(0);
  expect(state.artists).toHaveLength(0);
  expect(state.albums).toHaveLength(0);
  expect(state.genres).toHaveLength(0);
  expect(state.update).toBe(false);
});

it('Favorites reducer | Unrecognised action type | Return current state', () => {
  let state = favorites(currentState, { type: 'UNRECOGNISED_ACTION_TYPE' });

  expect(state).toEqual(currentState);
});

it('Favorites reducer | FAVORITES_LOADING action type | isLoading is set to true', () => {
  let state = favorites(currentState, { type: 'FAVORITES_LOADING' });

  expect(state.songs).toHaveLength(0);
  expect(state.artists).toHaveLength(0);
  expect(state.albums).toHaveLength(0);
  expect(state.genres).toHaveLength(0);
  expect(state.update).toBe(false);

  expect(state.isLoading).toBe(true);
});

it('Favorites reducer | FAVORITES_LOADING_SUCCESS action type | isLoading and favorites are set', () => {
  let action = {
    type: 'FAVORITES_LOADING_SUCCESS',
    payload: {
      favorites: {
        songs: [],
        artists: [],
        albums: [],
        genres: []
      }
    }
  }
  let state = favorites(currentState, action);

  expect(state.songs).toHaveLength(action.payload.favorites.songs.length);
  expect(state.artists).toHaveLength(action.payload.favorites.artists.length);
  expect(state.albums).toHaveLength(action.payload.favorites.albums.length);
  expect(state.genres).toHaveLength(action.payload.favorites.genres.length);
  expect(state.update).toBe(false);
  expect(state.isLoading).toBe(false);
});

it('Favorites reducer | FAVORITES_LOADING_SUCCESS action type | songsSelector.orderBy gets called', () => {
  let action = {
    type: 'FAVORITES_LOADING_SUCCESS',
    payload: {
      favorites: {
        songs: [{ title: 'song' }],
        artists: [{ artist: 'artist' }],
        albums: [{ album: 'album' }],
        genres: [{ genre: 'genre' }]
      }
    }
  }
  let state = favorites(currentState, action);

  expect(songsSelector.orderBy.mock.calls).toHaveLength(4);

  expect(songsSelector.orderBy.mock.calls[0][0]).toBe(action.payload.favorites.songs);
  expect(songsSelector.orderBy.mock.calls[1][0]).toBe(action.payload.favorites.artists);
  expect(songsSelector.orderBy.mock.calls[2][0]).toBe(action.payload.favorites.albums);
  expect(songsSelector.orderBy.mock.calls[3][0]).toBe(action.payload.favorites.genres);
});

it('Favorites reducer | FAVORITES_LOADING_ERROR action type | isLoading is set to false', () => {
  let state = favorites(currentState, { type: 'FAVORITES_LOADING_ERROR' });

  expect(state.songs).toEqual(currentState.songs);
  expect(state.artists).toEqual(currentState.artists);
  expect(state.albums).toEqual(currentState.albums);
  expect(state.genres).toEqual(currentState.genres);
  expect(state.update).toEqual(currentState.update);

  expect(state.isLoading).toBe(false);
});

it('Favorites reducer | FAVORITES_LIKE_SUCCESS action type | isLoading is set to false', () => {
  let state = favorites(currentState, { type: 'FAVORITES_LIKE_SUCCESS' });

  expect(state.songs).toEqual(currentState.songs);
  expect(state.artists).toEqual(currentState.artists);
  expect(state.albums).toEqual(currentState.albums);
  expect(state.genres).toEqual(currentState.genres);
  expect(state.isLoading).toBe(currentState.isLoading);
  
  expect(state.update).toBe(true);
});
import album from '../../../src/redux/reducers/album';

const currentState = {
  album: null,
  isFavorite: false,
  isLoading: false,
};

it('Album reducer | State is undefined | Return initial state', () => {
  let state = album(undefined, { type: 'ACTION_TYPE' });

  expect(state.album).toBeNull();
  expect(state.isFavorite).toBe(false);
  expect(state.isLoading).toBe(false);
});

it('Album reducer | Unrecognised action type | Return current state', () => {
  let state = album(currentState, { type: 'UNRECOGNISED_ACTION_TYPE' });

  expect(state).toEqual(currentState);
});

it('Album reducer | ALBUM_LOADING action type | isLoading is set to true', () => {
  let state = album(currentState, { type: 'ALBUM_LOADING' });

  expect(state.album).toEqual(currentState.album);
  expect(state.isFavorite).toEqual(currentState.isFavorite);

  expect(state.isLoading).toBe(true);
});

it('Album reducer | ALBUM_LOADING_SUCCESS action type | isLoading and album are set', () => {
  let action = {
    type: 'ALBUM_LOADING_SUCCESS',
    payload: {
      album: {
        isFavorite: false
      },
    }
  }
  let state = album(currentState, action);

  expect(state.album).toEqual(action.payload.album);
  expect(state.isFavorite).toEqual(action.payload.album.isFavorite);
  expect(state.isLoading).toBe(false);
});

it('Album reducer | ALBUM_LOADING_ERROR action type and payload type != album | return current state', () => {
  let action = {
    type: 'ALBUM_LOADING_ERROR',
    payload: {
      type: '!album'
    }
  }
  let state = album(currentState, action);

  expect(state.album).toEqual(currentState.album);
  expect(state.isFavorite).toEqual(currentState.isFavorite);
  expect(state.isLoading).toEqual(currentState.isLoading);
});

it('Album reducer | FAVORITES_LIKE_SUCCESS action type and payload type == album | isFavorite is set', () => {
  let action = {
    type: 'FAVORITES_LIKE_SUCCESS',
    payload: {
      type: 'album',
      target: {
        isFavorite: true
      }
    }
  }
  let state = album(currentState, action);

  expect(state.album).toEqual(currentState.album);
  expect(state.isLoading).toEqual(currentState.isLoading);

  expect(state.isFavorite).toEqual(action.payload.target.isFavorite);
});
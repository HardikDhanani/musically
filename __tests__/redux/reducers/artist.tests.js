import artist from '../../../src/redux/reducers/artist';

const currentState = {
  artist: null,
  isFavorite: false,
  isLoading: false,
};

it('Artist reducer | State is undefined | Return initial state', () => {
  let state = artist(undefined, { type: 'ACTION_TYPE' });

  expect(state.artist).toBeNull();
  expect(state.isFavorite).toBe(false);
  expect(state.isLoading).toBe(false);
});

it('Artist reducer | Unrecognised action type | Return current state', () => {
  let state = artist(currentState, { type: 'UNRECOGNISED_ACTION_TYPE' });

  expect(state).toEqual(currentState);
});

it('Artist reducer | ARTIST_LOADING action type | isLoading is set to true', () => {
  let state = artist(currentState, { type: 'ARTIST_LOADING' });

  expect(state.artist).toEqual(currentState.artist);
  expect(state.isFavorite).toEqual(currentState.isFavorite);

  expect(state.isLoading).toBe(true);
});

it('Artist reducer | ARTIST_LOADING_SUCCESS action type | isLoading and artist are set', () => {
  let action = {
    type: 'ARTIST_LOADING_SUCCESS',
    payload: {
      artist: {
        isFavorite: false
      },
    }
  }
  let state = artist(currentState, action);

  expect(state.artist).toEqual(action.payload.artist);
  expect(state.isFavorite).toEqual(action.payload.artist.isFavorite);
  expect(state.isLoading).toBe(false);
});

it('Artist reducer | FAVORITES_LIKE_SUCCESS action type and payload type != artist | return current state', () => {
  let action = {
    type: 'ARTIST_LOADING_ERROR',
    payload: {
      type: '!artist'
    }
  }
  let state = artist(currentState, action);

  expect(state.artist).toEqual(currentState.artist);
  expect(state.isFavorite).toEqual(currentState.isFavorite);
  expect(state.isLoading).toEqual(currentState.isLoading);
});

it('Artist reducer | FAVORITES_LIKE_SUCCESS action type and payload type == artist | isFavorite is set', () => {
  let action = {
    type: 'FAVORITES_LIKE_SUCCESS',
    payload: {
      type: 'artist',
      target: {
        isFavorite: true
      }
    }
  }
  let state = artist(currentState, action);

  expect(state.artist).toEqual(currentState.artist);
  expect(state.isLoading).toEqual(currentState.isLoading);

  expect(state.isFavorite).toEqual(action.payload.target.isFavorite);
});
import genre from '../../../src/redux/reducers/genre';

const currentState = {
  genre: null,
  isFavorite: false,
  isLoading: false,
};

it('Genre reducer | State is undefined | Return initial state', () => {
  let state = genre(undefined, { type: 'ACTION_TYPE' });

  expect(state.genre).toBeNull();
  expect(state.isFavorite).toBe(false);
  expect(state.isLoading).toBe(false);
});

it('Genre reducer | Unrecognised action type | Return current state', () => {
  let state = genre(currentState, { type: 'UNRECOGNISED_ACTION_TYPE' });

  expect(state).toEqual(currentState);
});

it('Genre reducer | GENRE_LOADING action type | isLoading is set to true', () => {
  let state = genre(currentState, { type: 'GENRE_LOADING' });

  expect(state.genre).toEqual(currentState.genre);
  expect(state.isFavorite).toEqual(currentState.isFavorite);

  expect(state.isLoading).toBe(true);
});

it('Genre reducer | GENRE_LOADING_SUCCESS action type | isLoading and genre are set', () => {
  let action = {
    type: 'GENRE_LOADING_SUCCESS',
    payload: {
      genre: {
        isFavorite: false
      },
    }
  }
  let state = genre(currentState, action);

  expect(state.genre).toEqual(action.payload.genre);
  expect(state.isFavorite).toEqual(action.payload.genre.isFavorite);
  expect(state.isLoading).toBe(false);
});

it('Genre reducer | GENRE_LOADING_ERROR action type and payload type != genre | return current state', () => {
  let action = {
    type: 'GENRE_LOADING_ERROR',
    payload: {
      type: '!genre'
    }
  }
  let state = genre(currentState, action);

  expect(state.genre).toEqual(currentState.genre);
  expect(state.isFavorite).toEqual(currentState.isFavorite);
  expect(state.isLoading).toEqual(currentState.isLoading);
});

it('Genre reducer | FAVORITES_LIKE_SUCCESS action type and payload type == genre | isFavorite is set', () => {
  let action = {
    type: 'FAVORITES_LIKE_SUCCESS',
    payload: {
      type: 'genre',
      target: {
        isFavorite: true
      }
    }
  }
  let state = genre(currentState, action);

  expect(state.genre).toEqual(currentState.genre);
  expect(state.isLoading).toEqual(currentState.isLoading);

  expect(state.isFavorite).toEqual(action.payload.target.isFavorite);
});
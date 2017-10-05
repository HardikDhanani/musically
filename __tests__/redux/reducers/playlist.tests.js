import playlists from '../../../src/redux/reducers/playlists';

let currentState = null;

beforeEach(() => {
  currentState = { isLoading: false };
});

it('Playlist reducer | State is undefined | Return initial state', () => {
  let state = playlists(undefined, { type: 'ACTION_TYPE' });

  expect(state.isLoading).toBe(false);
});

it('Playlist reducer | Unrecognised action type | Return current state', () => {
  let state = playlists(currentState, { type: 'UNRECOGNISED_ACTION_TYPE' });

  expect(state).toEqual(currentState);
});

it('Playlist reducer | PLAYLISTS_LOADING action type | Return isLoading true', () => {
  currentState.isLoading = false;
  let state = playlists(currentState, { type: 'PLAYLISTS_LOADING' });

  expect(state.isLoading).toBe(true);
});

it('Playlist reducer | PLAYLISTS_LOADING_SUCCESS action type | Return isLoading false', () => {
  currentState.isLoading = true;
  let state = playlists(currentState, { type: 'PLAYLISTS_LOADING_SUCCESS' });

  expect(state.isLoading).toBe(false);
});

it('Playlist reducer | PLAYLISTS_LOADING_ERROR action type | Return isLoading false', () => {
  currentState.isLoading = true;
  let state = playlists(currentState, { type: 'PLAYLISTS_LOADING_ERROR' });

  expect(state.isLoading).toBe(false);
});
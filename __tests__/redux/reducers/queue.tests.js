import queue from '../../../src/redux/reducers/queue';

let currentState = null;

beforeEach(() => {
  currentState = {
    queue: [],
    isLoading: false,
    isRemovingSong: false
  };
});

it('Queue reducer | State is undefined | Return initial state', () => {
  let state = queue(undefined, { type: 'ACTION_TYPE' });

  expect(state.isLoading).toBe(false);
  expect(state.queue).toHaveLength(0);
  expect(state.isRemovingSong).toBe(false);
});

it('Queue reducer | Unrecognised action type | Return current state', () => {
  let state = queue(currentState, { type: 'UNRECOGNISED_ACTION_TYPE' });

  expect(state).toEqual(currentState);
});

it('Queue reducer | QUEUE_LOADING action type | Return isLoading true', () => {
  currentState.isLoading = false;
  let state = queue(currentState, { type: 'QUEUE_LOADING' });

  expect(state.isLoading).toBe(true);
});

it('Queue reducer | QUEUE_LOADING_SUCCESS action type | Return isLoading false and queue from action', () => {
  currentState.isLoading = true;
  let action = {
    type: 'QUEUE_LOADING_SUCCESS',
    payload: {
      queue: [{ name: 'song' }]
    }
  };
  let state = queue(currentState, action);

  expect(state.isLoading).toBe(false);
  expect(state.queue).toEqual(action.payload.queue);
});

it('Queue reducer | QUEUE_LOADING_ERROR action type | Return isLoading false', () => {
  currentState.isLoading = true;
  let state = queue(currentState, { type: 'QUEUE_LOADING_ERROR' });

  expect(state.isLoading).toBe(false);
});

it('Queue reducer | QUEUE_REMOVING_SONG action type | Return isRemovingSong true', () => {
  currentState.isRemovingSong = false;
  let state = queue(currentState, { type: 'QUEUE_REMOVING_SONG' });

  expect(state.isRemovingSong).toBe(true);
});

it('Queue reducer | QUEUE_REMOVING_SONG_SUCCESS action type | Return isRemovingSong false and queue from action', () => {
  currentState.isRemovingSong = false;
  let action = {
    type: 'QUEUE_REMOVING_SONG_SUCCESS',
    payload: {
      queue: [{ name: 'song' }]
    }
  };
  let state = queue(currentState, action);

  expect(state.isRemovingSong).toBe(false);
  expect(state.queue).toBe(action.payload.queue);
});

it('Queue reducer | QUEUE_REMOVING_SONG_ERROR action type | Return isRemovingSong false', () => {
  currentState.isRemovingSong = true;
  let state = queue(currentState, { type: 'QUEUE_REMOVING_SONG_ERROR' });

  expect(state.isRemovingSong).toBe(false);
});
import home from '../../../src/redux/reducers/home';

const currentState = {
  isLoading: false,
  error: null,
  selectedSection: 'artists',
};

it('Home reducer | State is undefined | Return initial state', () => {
  let state = home(undefined, { type: 'ACTION_TYPE' });

  expect(state.isLoading).toBe(false);
  expect(state.error).toBeNull();
  expect(state.selectedSection).toEqual('artists');
});

it('Home reducer | Unrecognised action type | Return current state', () => {
  let state = home(currentState, { type: 'UNRECOGNISED_ACTION_TYPE' });

  expect(state).toEqual(currentState);
});

it('Home reducer | LOADING_SONGS action type | isLoading is set to true', () => {
  let state = home(currentState, { type: 'LOADING_SONGS' });

  expect(state.error).toEqual(currentState.error);
  expect(state.selectedSection).toEqual(currentState.selectedSection);

  expect(state.isLoading).toBe(true);
});

it('Home reducer | LOADING_SONGS_SUCCESS action type | isLoading is set to false', () => {
  let currentState = {
    ...currentState,
    isLoading: true
  }
  let state = home(currentState, { type: 'LOADING_SONGS_SUCCESS' });

  expect(state.selectedSection).toEqual(currentState.selectedSection);

  expect(state.error).toBeNull();
  expect(state.isLoading).toBe(false);
});

it('Home reducer | LOADING_SONGS_ERROR action type | isLoading is set to false and error is set', () => {
  let currentState = {
    ...currentState,
    isLoading: true
  }
  let state = home(currentState, { type: 'LOADING_SONGS_ERROR' });

  expect(state.selectedSection).toEqual(currentState.selectedSection);

  expect(state.error).toEqual('Something went wrong loading songs');
  expect(state.isLoading).toBe(false);
});

it('Home reducer | SECTION_CHANGED action type | isLoading is set to false and error is set', () => {
  let action = {
    type: 'SECTION_CHANGED',
    payload: {
      section: 'section'
    }
  }
  let state = home(currentState, action);

  expect(state.error).toEqual(currentState.error);
  expect(state.isLoading).toBe(currentState.isLoading);

  expect(state.selectedSection).toEqual(action.payload.section);
});
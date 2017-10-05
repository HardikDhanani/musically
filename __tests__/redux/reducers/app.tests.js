import app from '../../../src/redux/reducers/app';

const currentState = {
  isReady: false,
  goHome: false,
  session: null,
  songs: [],
  albums: [],
  artists: [],
  genres: [],
  showMenu: false,
  targetMenu: null,
  menuPositionX: null,
  menuPositionY: null,
};

it('App reducer | State is undefined | Return initial state', () => {
  let state = app(undefined, { type: 'ACTION_TYPE' });

  expect(state.isReady).toBe(false);
  expect(state.goHome).toBe(false);
  expect(state.session).toBeNull();
  expect(state.showMenu).toBe(false);
  expect(state.targetMenu).toBeNull();
  expect(state.menuPositionX).toBeNull();
  expect(state.menuPositionY).toBeNull();
  expect(state.songs).toHaveLength(0);
  expect(state.albums).toHaveLength(0);
  expect(state.artists).toHaveLength(0);
  expect(state.genres).toHaveLength(0);
});

it('App reducer | Unrecognised action type | Return current state', () => {
  let state = app(currentState, { type: 'UNRECOGNISED_ACTION_TYPE' });

  expect(state).toEqual(currentState);
});

it('App reducer | GO_HOME action type | GoHome is set to true', () => {
  let state = app(currentState, { type: 'APP_GO_HOME' });

  expect(state.isReady).toEqual(currentState.isReady);
  expect(state.session).toEqual(currentState.session);
  expect(state.showMenu).toEqual(currentState.showMenu);
  expect(state.targetMenu).toEqual(currentState.targetMenu);
  expect(state.menuPositionX).toEqual(currentState.menuPositionX);
  expect(state.menuPositionY).toEqual(currentState.menuPositionY);
  expect(state.songs).toHaveLength(currentState.songs.length);
  expect(state.albums).toHaveLength(currentState.albums.length);
  expect(state.artists).toHaveLength(currentState.artists.length);
  expect(state.genres).toHaveLength(currentState.genres.length);

  expect(state.goHome).toBe(true);
});

it('App reducer | APP_STARTING_SUCCESS action type | isReady and session and songs are set', () => {
  let action = {
    type: 'APP_STARTING_SUCCESS',
    payload: {
      session: {},
      songs: [],
      albums: [],
      artists: [],
      genres: []
    }
  }
  let state = app(currentState, action);
  
  expect(state.goHome).toEqual(currentState.goHome);
  expect(state.showMenu).toEqual(currentState.showMenu);
  expect(state.targetMenu).toEqual(currentState.targetMenu);
  expect(state.menuPositionX).toEqual(currentState.menuPositionX);
  expect(state.menuPositionY).toEqual(currentState.menuPositionY);
  
  expect(state.isReady).toEqual(true);
  expect(state.session).toEqual(action.payload.session);
  expect(state.songs).toEqual(action.payload.songs);
  expect(state.albums).toEqual(action.payload.albums);
  expect(state.artists).toEqual(action.payload.artists);
  expect(state.genres).toEqual(action.payload.genres);
});

it('App reducer | APP_SET_MENU action type | showMenu is toggled and targetMenu and position are set', () => {
  let action = {
    type: 'APP_SET_MENU',
    payload: {
      target: {},
      positionX: 1,
      positionY: 1
    }
  }
  let state = app(currentState, action);
  
  expect(state.goHome).toEqual(currentState.goHome);
  expect(state.isReady).toEqual(currentState.isReady);
  expect(state.session).toEqual(currentState.session);
  expect(state.songs).toEqual(currentState.songs);
  expect(state.albums).toEqual(currentState.albums);
  expect(state.artists).toEqual(currentState.artists);
  expect(state.genres).toEqual(currentState.genres);

  expect(state.showMenu).toEqual(!currentState.showMenu);
  expect(state.targetMenu).toEqual(action.payload.target);
  expect(state.menuPositionX).toEqual(action.payload.positionX);
  expect(state.menuPositionY).toEqual(action.payload.positionY);
});
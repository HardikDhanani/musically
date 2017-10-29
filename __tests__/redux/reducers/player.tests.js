import player from '../../../src/redux/reducers/player';

let currentState = null;

beforeEach(() => {
  currentState = {
    isFavorite: false,
    currentSong: null,
    currentIndex: -1,
    elapsedTime: 0,
    queue: [],
    showMenu: false,
    isLoading: false,
    randomActive: false,
    playing: false,
    repeatMode: 'NONE'
  };
});

it('Player reducer | State is undefined | Return initial state', () => {
  let state = player(undefined, { type: 'ACTION_TYPE' });

  expect(state.isLoading).toBe(false);
  expect(state.isFavorite).toBe(false);
  expect(state.currentSong).toBeNull();
  expect(state.currentIndex).toEqual(-1);
  expect(state.elapsedTime).toEqual(0);
  expect(state.queue).toHaveLength(0);
  expect(state.showMenu).toEqual(false);
  expect(state.randomActive).toEqual(false);
  expect(state.playing).toEqual(false);
  expect(state.repeatMode).toEqual('NONE');
});

it('Player reducer | Unrecognised action type | Return current state', () => {
  let state = player(currentState, { type: 'UNRECOGNISED_ACTION_TYPE' });

  expect(state).toEqual(currentState);
});

it('Player reducer | APP_STARTING_SUCCESS action type and no queue | Return empty queue', () => {
  let action = {
    type: 'APP_STARTING_SUCCESS',
    payload: {
      session: {}
    }
  }
  let state = player(currentState, action);

  expect(state.queue).toHaveLength(0);
});

it('Player reducer | APP_STARTING_SUCCESS action type and no session | Return empty queue and no currentSong', () => {
  let action = {
    type: 'APP_STARTING_SUCCESS',
    payload: {}
  }
  let state = player(currentState, action);

  expect(state.queue).toHaveLength(0);
  expect(state.currentSong).toBeNull();
  expect(state.currentIndex).toEqual(-1);
});

it('Player reducer | APP_STARTING_SUCCESS action type and queue | Return queue', () => {
  let action = {
    type: 'APP_STARTING_SUCCESS',
    payload: {
      session: {
        queue: [{}]
      }
    }
  }
  let state = player(currentState, action);

  expect(state.queue).toHaveLength(action.payload.session.queue.length);
});

it('Player reducer | APP_STARTING_SUCCESS action type and currentSong | Return currentSong', () => {
  let currentSong = { name: 'name' }
  let action = {
    type: 'APP_STARTING_SUCCESS',
    payload: {
      session: {
        currentSong
      }
    }
  }
  let state = player(currentState, action);

  expect(state.currentSong).toEqual(currentSong);
});

it('Player reducer | APP_STARTING_SUCCESS action type and currentSong | Return the currentIndex in the queue of the currentSong', () => {
  let currentSong = { name: 'name', isFavorite: true }
  let action = {
    type: 'APP_STARTING_SUCCESS',
    payload: {
      session: {
        queue: [{ name: 'previousSong' }, currentSong, { name: 'otherSong' }],
        currentSong,
      }
    }
  }
  let state = player(currentState, action);

  expect(state.currentIndex).toEqual(1);
  expect(state.isFavorite).toEqual(currentSong.isFavorite);
});

it('Player reducer | APP_STARTING_SUCCESS action type and no currentSong | Return -1 as currentIndex', () => {
  let currentSong = { name: 'name' }
  let action = {
    type: 'APP_STARTING_SUCCESS',
    payload: {
      session: {}
    }
  }
  let state = player(currentState, action);

  expect(state.currentIndex).toEqual(-1);
});

it('Player reducer | APP_STARTING_SUCCESS action type | Return isLoading as false', () => {
  let action = {
    type: 'APP_STARTING_SUCCESS',
    payload: {
      session: {}
    }
  }
  let state = player(currentState, action);

  expect(state.isLoading).toBe(false);
});

it('Player reducer | PLAYER_LOADING action type | Return isLoading as true', () => {
  currentState.isLoading = false;
  let state = player(currentState, { type: 'PLAYER_LOADING' });

  expect(state.isLoading).toBe(true);
});

it('Player reducer | PLAYER_LOADING_SUCCESS action type | Return queue and currentSong and currentIndex', () => {
  let currentSong = { name: 'song', isFavorite: true };
  let action = {
    type: 'PLAYER_LOADING_SUCCESS',
    payload: {
      queue: [currentSong],
      currentSong,
      currentIndex: 1
    }
  }
  let state = player(currentState, action);

  expect(state.queue).toEqual(action.payload.queue);
  expect(state.currentSong).toEqual(action.payload.currentSong);
  expect(state.currentIndex).toEqual(action.payload.currentIndex);
  expect(state.isLoading).toBe(false);
  expect(state.isFavorite).toEqual(currentSong.isFavorite);
});

it('Player reducer | PLAYER_SET_MENU action type | Return oposite showMenu', () => {
  currentState.showMenu = true;
  let state = player(currentState, { type: 'PLAYER_SET_MENU' });

  expect(state.showMenu).toBe(!currentState.showMenu);
});

it('Player reducer | PLAYER_SONG_CHANGED action type | Return currentSong and set elapsedTime to 0', () => {
  let action = {
    type: 'PLAYER_SONG_CHANGED',
    payload: {
      currentSong: { name: 'song', isFavorite: true },
      currentIndex: 2
    }
  }
  let state = player(currentState, action);

  expect(state.currentSong).toEqual(action.payload.currentSong);
  expect(state.currentIndex).toEqual(action.payload.currentIndex);
  expect(state.elapsedTime).toEqual(0);
  expect(state.isFavorite).toEqual(action.payload.currentSong.isFavorite);
});

it('Player reducer | PLAYER_RAMDOM action type | Return currentSong and set elapsedTime to 0', () => {
  currentState.randomActive = false;
  let state = player(currentState, { type: 'PLAYER_RAMDOM' });

  expect(state.randomActive).toEqual(!currentState.randomActive);
});

it('Player reducer | PLAYER_REPEAT action type and repeatMode NONE | Return repeatMode ONE', () => {
  currentState.repeatMode = 'NONE';
  let state = player(currentState, { type: 'PLAYER_REPEAT' });

  expect(state.repeatMode).toEqual('ONE');
});

it('Player reducer | PLAYER_REPEAT action type and repeatMode ONE | Return repeatMode ALL', () => {
  currentState.repeatMode = 'ONE';
  let state = player(currentState, { type: 'PLAYER_REPEAT' });

  expect(state.repeatMode).toEqual('ALL');
});

it('Player reducer | PLAYER_REPEAT action type and repeatMode ALL | Return repeatMode NONE', () => {
  currentState.repeatMode = 'ALL';
  let state = player(currentState, { type: 'PLAYER_REPEAT' });

  expect(state.repeatMode).toEqual('NONE');
});

it('Player reducer | PLAYER_PLAY action type | Return playing true', () => {
  let state = player(currentState, { type: 'PLAYER_PLAY' });

  expect(state.playing).toEqual(true);
});

it('Player reducer | PLAYER_PAUSE action type | Return playing false', () => {
  let state = player(currentState, { type: 'PLAYER_PAUSE' });

  expect(state.playing).toEqual(false);
});

it('Player reducer | PLAYER_STOP action type | Return playing false', () => {
  let state = player(currentState, { type: 'PLAYER_STOP' });

  expect(state.playing).toEqual(false);
});

it('Player reducer | PLAYER_TIME_ELAPSED action type | Return actual time elapsed plus action time elapse', () => {
  let action = {
    type: 'PLAYER_TIME_ELAPSED',
    payload: {
      elapsedTime: 500
    }
  };
  let state = player(currentState, action);

  expect(state.elapsedTime).toEqual(currentState.elapsedTime + action.payload.elapsedTime);
});

it('Player reducer | PLAYER_PROGRESS_CHANGED action type | Return new elapsed time', () => {
  let action = {
    type: 'PLAYER_PROGRESS_CHANGED',
    payload: {
      newElapsed: 500
    }
  };
  let state = player(currentState, action);

  expect(state.elapsedTime).toEqual(action.payload.newElapsed);
});

it('Player reducer | PLAYER_ADD_TO_QUEUE action type | Return actual queue plus new queue', () => {
  currentState.queue = [{ name: 'song1' }];
  let action = {
    type: 'PLAYER_ADD_TO_QUEUE',
    payload: {
      queue: [{ name: 'song2' }, { name: 'song3' }]
    }
  };
  let state = player(currentState, action);

  expect(state.queue).toEqual(currentState.queue.concat(action.payload.queue));
});

it('Player reducer | PLAYER_ADD_TO_QUEUE action type and action.queue empty | Return actual queue', () => {
  currentState.queue = [{ name: 'song1' }];
  let action = {
    type: 'PLAYER_ADD_TO_QUEUE',
    payload: {}
  };
  let state = player(currentState, action);

  expect(state.queue).toEqual(currentState.queue);
});

it('Player reducer | FAVORITES_LIKE_SUCCESS action type and currentSong available and payload type is song | Return currentSong.isFavorite as target.isFavorite', () => {
  currentState.currentSong = [{ name: 'song1', isFavorite: false }];
  let action = {
    type: 'FAVORITES_LIKE_SUCCESS',
    payload: {
      type: 'song',
      target: {
        isFavorite: true
      }
    }
  };
  let state = player(currentState, action);

  expect(state.isFavorite).toEqual(action.payload.target.isFavorite);
});

it('Player reducer | FAVORITES_LIKE_SUCCESS action type and currentSong unavailable | Return current state', () => {
  currentState.currentSong = null;
  let state = player(currentState, { type: 'FAVORITES_LIKE_SUCCESS' });

  expect(state).toEqual(currentState);
});

it('Player reducer | FAVORITES_LIKE_SUCCESS action type and currentSong available and payload type is not song | Return current state', () => {
  currentState.currentSong = [{ name: 'song1', isFavorite: false }];
  let action = {
    type: 'FAVORITES_LIKE_SUCCESS',
    payload: {
      type: '!song'
    }
  };
  let state = player(currentState, action);

  expect(state).toEqual(currentState);
});
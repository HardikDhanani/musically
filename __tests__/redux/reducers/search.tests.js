import 'jest';

import search from '../../../src/redux/reducers/search';
import songsSelector from '../../../src/redux/selectors/songs';

jest.mock('../../../src/redux/selectors/songs');

let currentState = null;

beforeEach(() => {
  currentState = {
    criteria: null,
    result: {
      byTitle: [],
      byArtist: [],
      byAlbum: [],
      byGenre: [],
    },
    isSearching: false,
    mustCompleteCriteria: true,
  };

  songsSelector.orderBy = jest.fn((group, criteria) => group);
  songsSelector.groupByAlbum = jest.fn((songs) => songs);
  songsSelector.groupByArtists = jest.fn((songs) => songs);
  songsSelector.groupByGenre = jest.fn((songs) => songs);
});

it('Search reducer | State is undefined | Return initial state', () => {
  let state = search(undefined, { type: 'ACTION_TYPE' });

  expect(state.isSearching).toBe(false);
  expect(state.mustCompleteCriteria).toBe(true);
  expect(state.criteria).toBeNull();
  expect(state.result.byAlbum).toHaveLength(0);
  expect(state.result.byTitle).toHaveLength(0);
  expect(state.result.byArtist).toHaveLength(0);
  expect(state.result.byGenre).toHaveLength(0);
});

it('Search reducer | Unrecognised action type | Return current state', () => {
  let state = search(currentState, { type: 'UNRECOGNISED_ACTION_TYPE' });

  expect(state).toEqual(currentState);
});

it('Search reducer | SEARCHING action type | Return criteria and isSearching true and mustCompleteCriteria false', () => {
  let action = {
    type: 'SEARCHING',
    payload: {
      criteria: 'some criteria'
    }
  }
  let state = search(currentState, action);

  expect(state.criteria).toEqual(action.payload.criteria);
  expect(state.isSearching).toBe(true);
  expect(state.mustCompleteCriteria).toBe(false);
});

it('Search reducer | SEARCHING_SUCCESS action type | Return criteria and isSearching false and mustCompleteCriteria false', () => {
  let action = {
    type: 'SEARCHING_SUCCESS',
    payload: {
      criteria: 'some criteria',
      result: {
        byTitle: [],
        byAlbum: [],
        byArtist: [],
        byGenre: []
      }
    }
  }
  let state = search(currentState, action);

  expect(state.criteria).toEqual(action.payload.criteria);
  expect(state.isSearching).toBe(false);
  expect(state.mustCompleteCriteria).toBe(false);
});

it('Search reducer | SEARCHING_SUCCESS action type | Call selector orderBy for each type of result', () => {
  let action = {
    type: 'SEARCHING_SUCCESS',
    payload: {
      criteria: 'some criteria',
      result: {
        byTitle: [],
        byAlbum: [],
        byArtist: [],
        byGenre: []
      }
    }
  }
  let state = search(currentState, action);

  expect(songsSelector.orderBy.mock.calls).toHaveLength(4);

  expect(songsSelector.orderBy.mock.calls[0][0]).toBe(action.payload.result.byTitle);
  expect(songsSelector.orderBy.mock.calls[1][0]).toBe(action.payload.result.byAlbum);
  expect(songsSelector.orderBy.mock.calls[2][0]).toBe(action.payload.result.byArtist);
  expect(songsSelector.orderBy.mock.calls[3][0]).toBe(action.payload.result.byGenre);
});

it('Search reducer | SEARCHING_SUCCESS action type | Call selector groupByAlbum for albums', () => {
  let action = {
    type: 'SEARCHING_SUCCESS',
    payload: {
      criteria: 'some criteria',
      result: {
        byTitle: [],
        byAlbum: [],
        byArtist: [],
        byGenre: []
      }
    }
  }
  let state = search(currentState, action);

  expect(songsSelector.groupByAlbum.mock.calls).toHaveLength(1);

  expect(songsSelector.groupByAlbum.mock.calls[0][0]).toBe(action.payload.result.byAlbum);
});

it('Search reducer | SEARCHING_SUCCESS action type | Call selector groupByArtists for artists', () => {
  let action = {
    type: 'SEARCHING_SUCCESS',
    payload: {
      criteria: 'some criteria',
      result: {
        byTitle: [],
        byAlbum: [],
        byArtist: [],
        byGenre: []
      }
    }
  }
  let state = search(currentState, action);

  expect(songsSelector.groupByArtists.mock.calls).toHaveLength(1);

  expect(songsSelector.groupByArtists.mock.calls[0][0]).toBe(action.payload.result.byArtist);
});

it('Search reducer | SEARCHING_SUCCESS action type | Call selector groupByGenre for genres', () => {
  let action = {
    type: 'SEARCHING_SUCCESS',
    payload: {
      criteria: 'some criteria',
      result: {
        byTitle: [],
        byAlbum: [],
        byArtist: [],
        byGenre: []
      }
    }
  }
  let state = search(currentState, action);

  expect(songsSelector.groupByGenre.mock.calls).toHaveLength(1);

  expect(songsSelector.groupByGenre.mock.calls[0][0]).toBe(action.payload.result.byGenre);
});

it('Search reducer | SEARCHING_ERROR action type | Return criteria and isSearching false and mustCompleteCriteria false', () => {
  let action = {
    type: 'SEARCHING_ERROR',
    payload: {
      criteria: 'some criteria'
    }
  }
  let state = search(currentState, action);

  expect(state.criteria).toEqual(action.payload.criteria);
  expect(state.isSearching).toBe(false);
  expect(state.mustCompleteCriteria).toBe(false);
});

it('Search reducer | SEARCHING_MUST_COMPLETE_CRITERIA action type | Return mustCompleteCriteria true', () => {
  let state = search(currentState, { type: 'SEARCHING_MUST_COMPLETE_CRITERIA' });

  expect(state.mustCompleteCriteria).toBe(true);
});
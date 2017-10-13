const songsSelector = jest.genMockFromModule('../../src/redux/selectors/songs');

songsSelector.orderBy = jest.fn((group, criteria) => group);
songsSelector.groupByAlbum = jest.fn((songs) => songs);
songsSelector.groupByArtists = jest.fn((songs) => songs);
songsSelector.groupByGenre = jest.fn((songs) => songs);

module.exports = songsSelector;
const songs = jest.genMockFromModule('../../src/redux/selectors/songs');

let calls = {
  orderBy: 0
}

songs.orderBy = (songs, criteria) => {
  calls.orderBy++;

  console.log('mock.songs: ' + JSON.stringify(songs));

  return songs;
};

songs.__reset = () => {
  calls.orderBy = 0;
}

module.exports = songs;
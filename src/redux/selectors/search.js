let _ = require('underscore-node');

export function albums(songs) {
  let groups = _.groupBy(songs, song => {
    return song.artist + '#' + song.album;
  });

  let ret = _.map(groups, group => {
    return {
      artist: group[0].artist,
      album: group[0].album,
      songs: Object.keys(group).length
    }
  });

  return ret;
}

export function songs(songs) {
  return songs;
}

export function artists(songs) {
  let groups = _.groupBy(songs, song => {
    return song.artist;
  });

  let ret = _.map(groups, group => {
    let albums = _.groupBy(group, song => {
      return song.album;
    });

    return {
      artist: group[0].artist,
      albums: Object.keys(albums).length,
      songs: Object.keys(group).length
    }
  });

  return ret;
}

export function genres(songs) {
  let groups = _.groupBy(songs, song => {
    return song.genre;
  });

  return _.map(groups, group => {
    let albums = _.groupBy(group, song => {
      return song.album;
    });

    let artists = _.groupBy(group, song => {
      return song.album;
    });

    return {
      genre: group[0].genre,
      albums: Object.keys(albums).length,
      artists: Object.keys(artists).length,
      songs: Object.keys(group).length
    }
  });
}
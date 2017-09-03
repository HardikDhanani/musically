let _ = require('underscore-node');

const _getCover = (group) => {
  let elem = group.find(g => g.cover !== null && g.cover !== undefined);
  return elem ? (elem.cover || null) : null;
}

export function groupByAlbum(songs) {
  if (!songs || !songs.length)
    return [];

  let filtered = songs.filter(s => s.artist !== null && s.artist !== undefined && s.artist.toLowerCase() !== '<unknown>' && s.album !== null && s.album !== undefined && s.album.toLowerCase() !== '<unknown>');
  let groups = _.groupBy(filtered, song => {
    return song.artist.toLowerCase() + '#' + song.album.toLowerCase();
  });

  let ret = _.map(groups, group => {
    return {
      id: group[0].artist.toLowerCase() + '#' + group[0].album.toLowerCase(),
      artist: group[0].artist,
      album: group[0].album,
      songs: group,
      cover: _getCover(group)
    }
  });

  return ret;
}

export function groupByArtists(songs) {
  if (!songs || !songs.length)
    return [];

  let filtered = songs.filter(s => s.artist !== null && s.artist !== undefined && s.artist.toLowerCase() !== '<unknown>');
  let groups = _.groupBy(filtered, song => {
    return song.artist.toLowerCase();
  });

  let ret = _.map(groups, group => {
    let albums = groupByAlbum(group);

    return {
      id: group[0].artist.toLowerCase(),
      artist: group[0].artist,
      albums: albums,
      cover: _getCover(albums)
    }
  });

  return ret;
}

export function groupByGenre(songs) {
  if (!songs || !songs.length)
    return [];

  let filtered = songs.filter(s => s.genre !== null && s.genre !== undefined && s.genre.toLowerCase() !== '<unknown>');
  let groups = _.groupBy(filtered, song => {
    return song.genre.toLowerCase();
  });

  let ret = _.map(groups, group => {
    let albums = groupByAlbum(group);

    return {
      id: group[0].genre.toLowerCase(),
      genre: group[0].genre,
      albums: albums,
      cover: _getCover(group)
    }
  });

  return ret;
}

export function orderBy(group, criteria) {
  return _.sortBy(group, criteria);
}
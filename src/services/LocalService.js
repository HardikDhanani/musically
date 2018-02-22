import { AsyncStorage, NativeModules } from 'react-native';
import Storage from 'react-native-storage';
import MusicFilesManager from './MusicFilesManager';

import Cache from './Cache';

class LocalService {
  constructor() {
    this.__initLocalStorage = this.__initLocalStorage.bind(this);
    this._getStorage = this._getStorage.bind(this);
    this.scanCovers = this.scanCovers.bind(this);
    this.saveSession = this.saveSession.bind(this);
    this.saveSongs = this.saveSongs.bind(this);
    this.saveArtists = this.saveArtists.bind(this);
    this.saveAlbums = this.saveAlbums.bind(this);
    this.savePlaylists = this.savePlaylists.bind(this);
    this.getSongs = this.getSongs.bind(this);
    this.getArtists = this.getArtists.bind(this);
    this.getAlbums = this.getAlbums.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
    this.getSession = this.getSession.bind(this);
    this.isFirstTime = this.isFirstTime.bind(this);
    this.firstTimeDone = this.firstTimeDone.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);

    this.__initLocalStorage();
    this._cache = new Cache();
  }

  __initLocalStorage() {
    this._storage = new Storage({
      size: 1000,
      storageBackend: AsyncStorage,
      defaultExpires: null,
      enableCache: true,

      // if data was not found in storage or expired, 
      // the corresponding sync method will be invoked and return  
      // the latest data. 
      sync: {
        // we'll talk about the details later. 
      }
    })
  }

  _getStorage() {
    if (!this._storage)
      this.__initLocalStorage();

    return this._storage;
  }

  scanCovers(ids) {
    return MusicFilesManager.getCovers(ids)
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  saveSession(session) {
    return this._getStorage().save({
      key: 'SESSION',
      data: session,
      expires: null
    })
      .then(() => {
        this._cache.save('SESSION', session);
        return session;
      });
  }

  saveSongs(songs) {
    return this._getStorage().save({
      key: 'SONGS',
      data: songs,
      expires: null
    })
      .then(() => this._cache.save('SONGS', songs));
  }

  saveArtists(artists) {
    return this._getStorage().save({
      key: 'ARTISTS',
      data: artists,
      expires: null
    })
      .then(() => this._cache.save('ARTISTS', artists));
  }

  saveAlbums(albums) {
    return this._getStorage().save({
      key: 'ALBUMS',
      data: albums,
      expires: null
    })
      .then(() => this._cache.save('ALBUMS', albums));
  }

  savePlaylists(playlists) {
    return this._getStorage().save({
      key: 'PLAYLISTS',
      data: playlists,
      expires: null
    })
      .then(() => this._cache.save('PLAYLISTS', playlists));
  }

  saveMostPlayed(mostPlayed) {
    return this._getStorage().save({
      key: 'MOSTPLAYED',
      data: mostPlayed,
      expires: null
    })
      .then(() => this._cache.save('MOSTPLAYED', mostPlayed));
  }

  saveRecentlyPlayed(recentlyPlayed) {
    return this._getStorage().save({
      key: 'RECENTLYPLAYED',
      data: recentlyPlayed,
      expires: null
    })
      .then(() => this._cache.save('RECENTLYPLAYED', recentlyPlayed));
  }

  saveSong(song) {
    return this.getSongs()
      .then(songs => {
        let index = songs.findIndex(s => s.id === song.id);
        songs[index] = song;
        return this.saveSongs(songs);
      });
  }

  saveAlbum(album) {
    return this.getAlbums()
      .then(albums => {
        let index = albums.findIndex(a => a.id === album.id);
        if (index !== -1) {
          albums[index] = album;
        } else {
          albums.push(album);
        }
        return this.saveAlbums(albums);
      });
  }

  saveArtist(artist) {
    return this.getArtists()
      .then(artists => {
        let index = artists.findIndex(a => a.id === artist.id);
        if (index !== -1) {
          artists[index] = artist;
        } else {
          artists.push(artist);
        }
        return this.saveArtists(artists);
      });
  }

  savePlaylist(playlist) {
    return this.getPlaylists()
      .then(playlists => {
        let index = playlists.findIndex(p => p.id === playlist.id);
        if (index !== -1) {
          playlists[index] = playlist;
        } else {
          playlist.id = playlists.length + 1;
          playlists.push(playlist);
        }
        return this.savePlaylists(playlists);
      });
  }

  isFirstTime() {
    return this.getSession()
      .then(session => session.isFirstTime);
  }

  firstTimeDone() {
    return this.getSession()
      .then(session => {
        session.isFirstTime = false;
        this.saveSession(session);
      });
  }

  getSession() {
    if (this._cache.exists('SESSION'))
      return Promise.resolve(this._cache.get('SESSION'));

    return this._getStorage().load({
      key: 'SESSION'
    }).then(session => {
      this._cache.save('SESSION', session);
      return session;
    }).catch(err => {
      switch (err.name) {
        case 'NotFoundError':
          return {
            isFirstTime: true,
            currentSong: null,
            currentIndex: -1,
            queue: [],
            language: 'english',
            mostPlayedLength: 0,
            recentlyPlayedLength: 0,
            mostPlayedReproductions: 0,
            itemViewMode: 'card'
          };

        default:
          throw new Exception(err);
      }
    });
  }

  getSongs() {
    if (this._cache.exists('SONGS'))
      return Promise.resolve(this._cache.get('SONGS'));

    return this._getStorage().load({
      key: 'SONGS'
    }).then(songs => {
      this._cache.save('SONGS', songs);
      return songs;
    }).catch(err => {
      switch (err.name) {
        case 'NotFoundError':
          return [];

        default:
          throw new Exception(err);
      }
    });
  }

  getArtists() {
    if (this._cache.exists('ARTISTS'))
      return Promise.resolve(this._cache.get('ARTISTS'));

    return this._getStorage().load({
      key: 'ARTISTS'
    }).then(artists => {
      this._cache.save('ARTISTS', artists);
      return artists;
    }).catch(err => {
      switch (err.name) {
        case 'NotFoundError':
          return [];

        default:
          throw new Exception(err);
      }
    });
  }

  getAlbums() {
    if (this._cache.exists('ALBUMS'))
      return Promise.resolve(this._cache.get('ALBUMS'));

    return this._getStorage().load({
      key: 'ALBUMS'
    }).then(albums => {
      this._cache.save('ALBUMS', albums);
      return albums;
    }).catch(err => {
      switch (err.name) {
        case 'NotFoundError':
          return [];

        default:
          throw new Exception(err);
      }
    });
  }

  getPlaylists() {
    if (this._cache.exists('PLAYLISTS'))
      return Promise.resolve(this._cache.get('PLAYLISTS'));

    return this._getStorage().load({
      key: 'PLAYLISTS'
    }).then(playlists => {
      this._cache.save('PLAYLISTS', playlists);
      return playlists;
    }).catch(err => {
      switch (err.name) {
        case 'NotFoundError':
          return [];

        default:
          throw new Exception(err);
      }
    });
  }

  getMostPlayed() {
    if (this._cache.exists('MOSTPLAYED'))
      return Promise.resolve(this._cache.get('MOSTPLAYED'));

    return this._getStorage().load({
      key: 'MOSTPLAYED'
    }).then(mostPlayed => {
      this._cache.save('MOSTPLAYED', mostPlayed);
      return mostPlayed;
    }).catch(err => {
      switch (err.name) {
        case 'NotFoundError':
          return [];

        default:
          throw new Exception(err);
      }
    });
  }

  getRecentlyPlayed() {
    if (this._cache.exists('RECENTLYPLAYED'))
      return Promise.resolve(this._cache.get('RECENTLYPLAYED'));

    return this._getStorage().load({
      key: 'RECENTLYPLAYED'
    }).then(recentlyPlayed => {
      this._cache.save('RECENTLYPLAYED', recentlyPlayed);
      return recentlyPlayed;
    }).catch(err => {
      switch (err.name) {
        case 'NotFoundError':
          return [];

        default:
          throw new Exception(err);
      }
    });
  }

  getUserPlaylists() {
    return this.getPlaylists()
      .then(playlists => {
        return playlists;
      });
  }

  getFavorites() {
    let songsPromise = this.getSongs()
      .then(songs => songs.filter(s => s.isFavorite));

    let albumsPromise = this.getAlbums()
      .then(albums => albums.filter(a => a.isFavorite));

    let artistsPromise = this.getArtists()
      .then(artists => artists.filter(a => a.isFavorite));

    return Promise.all([songsPromise, artistsPromise, albumsPromise])
      .then(result => {
        return {
          songs: result[0],
          artists: result[1],
          albums: result[2]
        }
      });
  }

  getAlbum(album) {
    return this.getAlbums()
      .then(albums => {
        return albums.find(a => a.id === album.id);
      });
  }

  getAlbumByName(name, artist) {
    return this.getAlbums()
      .then(albums => {
        return albums.find(a => a.artist.toLowerCase() === artist.toLowerCase() && a.album.toLowerCase() === name.toLowerCase());
      });
  }

  getArtist(artist) {
    return this.getArtists()
      .then(artists => {
        return artists.find(a => a.id === artist.id);
      });
  }

  getArtistByName(name) {
    return this.getArtists()
      .then(artists => {
        return artists.find(a => a.artist.toLowerCase() === name.toLowerCase());
      });
  }

  getGenre(genre) {
    return this.getSongs()
      .then(songs => {
        return songs.filter(s => s.genre.toLowerCase() === genre.toLowerCase());
      }).catch(err => {
        switch (err.name) {
          case 'NotFoundError':
            return [];

          default:
            throw new Exception(err);
        }
      });
  }

  getPlaylist(playlist) {
    return this.getPlaylists()
      .then(playlists => {
        return playlists.find(p => p.id === playlist.id);
      });
  }

  getPlaylistById(playlistId) {
    return this.getPlaylists()
      .then(playlists => {
        return playlists.find(p => p.id === playlistId);
      });
  }

  getPlaylistByName(playlistName) {
    return this.getPlaylists()
      .then(playlists => {
        return playlists.find(playlist => playlist.name.toLowerCase() === playlistName.toLowerCase());
      });
  }

  deletePlaylist(playlist) {
    return this.getPlaylists()
      .then(playlists => {
        var index = playlists.findIndex(p => p.id === playlist.id);
        if (index > -1) {
          playlists.splice(index, 1);
        }
        return this.savePlaylists(playlists);
      });
  }
}

let localService = new LocalService();

export default localService;
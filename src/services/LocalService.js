import { AsyncStorage, NativeModules } from 'react-native';
import Storage from 'react-native-storage';

import Cache from './Cache';

class LocalService {
  constructor() {
    this.__initLocalStorage = this.__initLocalStorage.bind(this);
    this._getStorage = this._getStorage.bind(this);
    this.scanForSongs = this.scanForSongs.bind(this);
    this.saveSession = this.saveSession.bind(this);
    this.saveSongs = this.saveSongs.bind(this);
    this.saveArtists = this.saveArtists.bind(this);
    this.saveAlbums = this.saveAlbums.bind(this);
    this.saveGenres = this.saveGenres.bind(this);
    this.getSongs = this.getSongs.bind(this);
    this.getArtists = this.getArtists.bind(this);
    this.getAlbums = this.getAlbums.bind(this);
    this.getGenres = this.getGenres.bind(this);
    this.getSession = this.getSession.bind(this);
    this.isFirstTime = this.isFirstTime.bind(this);
    this.firstTimeDone = this.firstTimeDone.bind(this);

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

  scanForSongs() {
    return new Promise((resolve, reject) => {
      NativeModules.MusicFileManager.getAll(err => {
        console.log('Error scaning songs: ' + err);
        reject(err);
      }, (response) => {
        resolve(response);
      });
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
    this._getStorage().save({
      key: 'ARTISTS',
      data: artists,
      expires: null
    })
      .then(() => this._cache.save('ARTISTS', artists));
  }

  saveAlbums(albums) {
    this._getStorage().save({
      key: 'ALBUMS',
      data: albums,
      expires: null
    })
      .then(() => this._cache.save('ALBUMS', albums));
  }

  saveGenres(genres) {
    this._getStorage().save({
      key: 'GENRES',
      data: genres,
      expires: null
    })
      .then(() => this._cache.save('GENRES', genres));
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
        albums[index] = album;
        return this.saveAlbums(albums);
      });
  }

  saveArtist(artist) {
    return this.getArtists()
      .then(artists => {
        let index = artists.findIndex(a => a.id === artist.id);
        artists[index] = artist;
        return this.saveArtists(artists);
      });
  }

  saveGenre(genre) {
    return this.getGenres()
      .then(genres => {
        let index = genres.findIndex(g => g.id === genre.id);
        genres[index] = genre;
        return this.saveGenres(genres);
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
            currentIndex: 0,
            queue: [],
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

  getGenres() {
    if (this._cache.exists('GENRES'))
      return Promise.resolve(this._cache.get('GENRES'));

    return this._getStorage().load({
      key: 'GENRES'
    }).then(genres => {
      this._cache.save('GENRES', genres);
      return genres;
    }).catch(err => {
      switch (err.name) {
        case 'NotFoundError':
          return [];

        default:
          throw new Exception(err);
      }
    });
  }

  getFavorites() {
    let songsPromise = this.getSongs()
      .then(songs => songs.filter(s => s.isFavorite));

    let albumsPromise = this.getAlbums()
      .then(albums => albums.filter(a => a.isFavorite));

    let artistsPromise = this.getAlbums()
      .then(artists => artists.filter(a => a.isFavorite));

    let genresPromise = this.getAlbums()
      .then(genres => genres.filter(g => g.isFavorite));

    return Promise.all([songsPromise, artistsPromise, albumsPromise, genresPromise])
      .then(result => {
        return {
          songs: result[0],
          artists: result[1],
          albums: result[2],
          genres: result[3],
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
}

let localService = new LocalService();

export default localService;